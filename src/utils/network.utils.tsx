"use client";

import React, { useEffect } from "react";
import {
  ReactFlow,
  Background,
  addEdge,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  ConnectionMode,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  NetworkNode,
  ImageNode,
  LabelNode,
  GroupNode,
  FloatingEdge,
  NetworkConnectionLine,
} from "@/utils/reactflow.utils";

const connectionLineStyle = {
  stroke: "#b1b1b7",
};

const nodeTypes = {
  network: NetworkNode,
  image: ImageNode,
  label: LabelNode,
  group: GroupNode,
};

const edgeTypes = {
  floating: FloatingEdge,
};

const defaultEdgeOptions = {
  type: "floating",
};

const fitViewOptions = {
  padding: 0.175,
};

const isEdgeExists = (edges, source, target) =>
  edges.some(
    (e) =>
      (e.source === source && e.target === target) ||
      (e.source === target && e.target === source)
  );

const NetworkGraph = ({ nodes: initialNodes, edges: initialEdges }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = (params) => {
    if (!isEdgeExists(edges, params.source, params.target)) {
      setEdges((eds) => addEdge(params, eds));
    }
  };

  useEffect(() => {
    console.log("Current edges:", edges);
  }, [edges]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      style={{ backgroundColor: "#000000" }}
      defaultEdgeOptions={defaultEdgeOptions}
      connectionLineComponent={NetworkConnectionLine}
      connectionLineStyle={connectionLineStyle}
      connectionMode={ConnectionMode.Loose}
      proOptions={{ hideAttribution: true }}
      selectNodesOnDrag={false}
      minZoom={0.001}
      maxZoom={1.5}
      nodesDraggable={false}
      nodesFocusable={false}
      edgesFocusable={false}
      fitView
      fitViewOptions={fitViewOptions}
    >
      <Background color="#444" variant={BackgroundVariant.Cross} />
    </ReactFlow>
  );
};

export default NetworkGraph;
