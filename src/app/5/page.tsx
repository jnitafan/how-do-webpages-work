"use client";

import React, { useCallback } from "react";
import {
  ReactFlow,
  addEdge,
  Background,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import styles from "./page.module.scss";

// 1. Create a custom node for the TCP header breakdown
const TCPHeaderNode = ({ data }: { data: any }) => {
  return (
    <div className={styles.tcpHeaderNode}>
      <div className={styles.tcpHeaderTop}>
        <span className={styles.headerLabel}>Header</span>
        <span className={styles.dataLabel}>Data</span>
      </div>
      <div className={styles.tcpHeaderFields}>
        <div className={styles.field}>Source port address</div>
        <div className={styles.field}>Destination port address</div>
        <div className={styles.field}>Sequence number</div>
        <div className={styles.field}>Acknowledgement number</div>
        <div className={styles.field}>HLEN</div>
        <div className={styles.fieldImportant}>Flags</div>
      </div>
    </div>
  );
};

// 2. Register the custom node type
const nodeTypes = { tcpHeaderNode: TCPHeaderNode };

// 3. Define nodes and edges to approximate your diagram layout
const initialNodes: Node[] = [
  {
    id: "protocols",
    data: { label: "Protocols" },
    position: { x: 300, y: 50 },
    style: { width: 120, height: 40 },
    className: styles.nodeBox + " " + styles.protocolNode,
  },
  {
    id: "messageFormats",
    data: { label: "Message Formats" },
    position: { x: 120, y: 150 },
    style: { width: 140, height: 40 },
    className: styles.nodeBox + " " + styles.messageFormatsNode,
  },
  {
    id: "ordering",
    data: { label: "Ordering of message exchanges" },
    position: { x: 420, y: 150 },
    style: { width: 200, height: 40 },
    className: styles.nodeBox + " " + styles.orderingNode,
  },
  {
    id: "tcpHeader",
    type: "tcpHeaderNode", // Uses our custom TCPHeaderNode
    data: { label: "TCP Header" },
    position: { x: 100, y: 250 },
    style: { width: 220, height: 200 },
    className: styles.nodeBox,
  },
  {
    id: "data",
    data: { label: "Data" },
    position: { x: 100, y: 470 },
    style: { width: 80, height: 40 },
    className: styles.nodeBox,
  },
  {
    id: "expectedResponses",
    data: { label: "Expected responses" },
    position: { x: 480, y: 250 },
    style: { width: 150, height: 40 },
    className: styles.nodeBox + " " + styles.expectedResponsesNode,
  },
  {
    id: "deviceA",
    data: { label: "Device A" },
    position: { x: 100, y: 550 },
    style: { width: 80, height: 40 },
    className: styles.nodeBox + " " + styles.deviceNode,
  },
  {
    id: "deviceB",
    data: { label: "Device B" },
    position: { x: 400, y: 550 },
    style: { width: 80, height: 40 },
    className: styles.nodeBox + " " + styles.deviceNode,
  },
  {
    id: "response200",
    data: { label: "Response: 200" },
    position: { x: 400, y: 500 },
    style: { width: 100, height: 40 },
    className: styles.nodeBox + " " + styles.responseNode,
  },
];

const initialEdges: Edge[] = [
  {
    id: "edge-protocols-messageFormats",
    source: "protocols",
    target: "messageFormats",
  },
  { id: "edge-protocols-ordering", source: "protocols", target: "ordering" },
  {
    id: "edge-messageFormats-tcpHeader",
    source: "messageFormats",
    target: "tcpHeader",
  },
  {
    id: "edge-ordering-expectedResponses",
    source: "ordering",
    target: "expectedResponses",
  },
  {
    id: "edge-deviceA-deviceB",
    source: "deviceA",
    target: "deviceB",
    label: "4 3 2 1",
  },
  { id: "edge-deviceB-response200", source: "deviceB", target: "response200" },
  { id: "edge-response200-deviceA", source: "response200", target: "deviceA" },
];

const DiagramPage = () => {
  // 4. Set up state hooks for nodes and edges
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // 5. Handle new connections (if you want interactive connecting)
  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlowProvider>
        <div className={styles.diagramContainer}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background />
          </ReactFlow>
        </div>
      </ReactFlowProvider>
    </div>
  );
};

export default DiagramPage;
