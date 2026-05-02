const express = require('express')
const os = require('os')
const Bonjour = require('bonjour')
const { v4: uuidv4 } = require('uuid')

const app = express()
const port = process.env.PORT || 3000
const deviceId = uuidv4()

function getLocalIpAddresses() {
  const nets = os.networkInterfaces()
  for (const names of Object.keys(nets)) {
    for (const net of nets[names]) {
      const v4 = net.family === 'IPv4' || net.family === 4
      if (v4 && !net.internal) {
        return net.address
      }
    }
  }
  return '127.0.0.1'
}

const myIp = getLocalIpAddresses()

app.get('/', (req, res) => {
  res.send('Hello World')
})

const bonjour = Bonjour()
let devices = {}

function upsertFromService(service) {
  const id = service.txt?.id
  if (!id) {
    console.warn('QuickSand service without txt.id, skipping:', service.name)
    return
  }
  const ip = service.referer?.address || service.addresses?.[0]
  if (!ip) return
  const entry = {
    name: service.name,
    ip,
    port: service.port,
    id,
  }
  console.log('Service is up:', entry)
  devices[id] = entry
}

function removeFromService(service) {
  const id = service.txt?.id
  if (!id) return
  console.log('Device left:', service.name, id)
  delete devices[id]
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

const published = bonjour.publish({
  name: `Device-${myIp}-port-${port}`,
  type: 'QuickSand',
  port,
  txt: {
    id: deviceId,
    ip: myIp,
  },
})

published.on('error', (err) => {
  console.error('mDNS publish error:', err.message)
})

console.log('publish device', deviceId)

const browser = bonjour.find({
  type: 'QuickSand',
})

browser.on('up', (service) => {
  console.log('service up', service)
  upsertFromService(service)
})

browser.on('down', (service) => {
  removeFromService(service)
})

app.get('/devices', (req, res) => {
  console.log('devices', devices)
  res.json(Object.values(devices))
})
