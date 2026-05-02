import React, { useState, useCallback, useEffect } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  applyNodeChanges,
} from "reactflow";
import "reactflow/dist/style.css";

// Device node
const DeviceNode = ({ data }) => {
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      data.onSendFile(data.device, file);
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      style={{
        padding: 12,
        border: "2px solid #444",
        borderRadius: 12,
        background: "#1e1e1e",
        color: "white",
        width: 130,
        textAlign: "center",
        cursor: "grab",
      }}
    >
      <div style={{ fontSize: 11 }}>💻</div>
      <div>{`Name: ${data.label}`}</div>
      <div>{` ID: ${data.device.id}`}</div>
      <div>{` IP: ${data.device.ip}`}</div>
      <div>{` Port: ${data.device.port}`}</div>
    </div>
  );
};

const nodeTypes = { device: DeviceNode };

export default function NetworkCanvas({ devices, onSendFile }) {
  console.log("devices", devices);
  // Initial nodes
  const [nodes, setNodes] = useState( [])

  useEffect(() => {
   const newNodes = devices.map((d, i) => ({
      id: d.id,
      type: "device",
      position: {
        x: 150 * (i % 4),
        y: 150 * Math.floor(i / 4),
      },
      data: {
        label: d.name,
        device: d,
        onSendFile,
      },
    }))

    setNodes(newNodes)
  }, [devices,onSendFile]);

  const [edges] = useState([]);
  console.log("nodes", nodes);
  console.log("edges", edges);
  // Handle dragging updates
  const onNodesChange = useCallback(
    (changes) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    []
  );

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}