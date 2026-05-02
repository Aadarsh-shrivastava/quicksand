import React from "react";
import NetworkCanvas from "./Components/NetworkCanvas/NetworkCanvas.jsx";
import { useState, useEffect } from "react";

export default function App() {
  // const devices = [
  //   { id: "1", name: "Laptop A", ip: "192.168.1.10", port: 3000 },
  //   { id: "2", name: "Phone", ip: "192.168.1.11", port: 3000 },
  //   { id: "3", name: "Tablet", ip: "192.168.1.12", port: 3000 },
  // ];

  const [devices, setDevices] = useState([]);
  const fetchDevices = async () => {
    const res = await fetch("http://localhost:3000/devices");
    const data = await res.json();
    setDevices(data);
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleSendFile = async (device, file) => {
    console.log("Sending file to:", device, file);

    const formData = new FormData();
    formData.append("file", file);

    await fetch(`http://${device.ip}:${device.port}/upload`, {
      method: "POST",
      body: formData,
    });
  };

  return (
    <>
      <h1>Quicksand Desktop</h1>
      <button onClick={fetchDevices}>Refresh Devices</button>
      <p>Devices: {JSON.stringify(devices, null, 2)}</p>
      <NetworkCanvas devices={devices} onSendFile={handleSendFile} />;
    </>
  );
}
