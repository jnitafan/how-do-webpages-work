"use client";

import React, { useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  addEdge,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import {
  CustomNode,
  CloudNode,
  FloatingEdge,
  CustomConnectionLine,
} from "@/utils/reactflow.utils";

import "@xyflow/react/dist/style.css";
import styles from "./page.module.scss";
import variables from "@/utils/variables.module.scss";

const initialNodes = [
  {
    id: "0",
    type: "cloud",
    position: { x: -250, y: -250 },
    draggable: false,
    width: 1500,
    height: 1500,
    data: {},
  },
  {
    id: "1",
    type: "custom",
    position: { x: 824, y: 316 },
    data: { icon: "router" },
  },
  {
    id: "2",
    type: "custom",
    position: { x: 74, y: 490 },
    data: { icon: "router" },
  },
  {
    id: "3",
    type: "custom",
    position: { x: 925, y: 862 },
    data: { icon: "router" },
  },
  {
    id: "4",
    type: "custom",
    position: { x: 978, y: 46 },
    data: { icon: "router" },
  },
  {
    id: "5",
    type: "custom",
    position: { x: 648, y: 752 },
    data: { icon: "router" },
  },
  {
    id: "6",
    type: "custom",
    position: { x: 300, y: 196 },
    data: { icon: "router" },
  },
  {
    id: "7",
    type: "custom",
    position: { x: 562, y: 940 },
    data: { icon: "router" },
  },
  {
    id: "8",
    type: "custom",
    position: { x: 138, y: 26 },
    data: { icon: "router" },
  },
  {
    id: "9",
    type: "custom",
    position: { x: 890, y: 594 },
    data: { icon: "router" },
  },
  {
    id: "10",
    type: "custom",
    position: { x: 432, y: 696 },
    data: { icon: "router" },
  },
  {
    id: "11",
    type: "custom",
    position: { x: 206, y: 114 },
    data: { icon: "router" },
  },
  {
    id: "12",
    type: "custom",
    position: { x: 780, y: 998 },
    data: { icon: "router" },
  },
  {
    id: "13",
    type: "custom",
    position: { x: 616, y: 528 },
    data: { icon: "router" },
  },
  {
    id: "14",
    type: "custom",
    position: { x: 22, y: 640 },
    data: { icon: "router" },
  },
  {
    id: "15",
    type: "custom",
    position: { x: 354, y: 448 },
    data: { icon: "router" },
  },
  {
    id: "16",
    type: "custom",
    position: { x: 500, y: 280 },
    data: { icon: "router" },
  },
  {
    id: "17",
    type: "custom",
    position: { x: 192, y: 778 },
    data: { icon: "router" },
  },
  {
    id: "18",
    type: "custom",
    position: { x: 920, y: 142 },
    data: { icon: "router" },
  },
  {
    id: "19",
    type: "custom",
    position: { x: 684, y: 422 },
    data: { icon: "router" },
  },
  {
    id: "20",
    type: "custom",
    position: { x: 118, y: 936 },
    data: { icon: "router" },
  },
  {
    id: "21",
    type: "custom",
    position: { x: 970, y: 350 },
    data: { icon: "router" },
  },
  {
    id: "22",
    type: "custom",
    position: { x: 268, y: 604 },
    data: { icon: "router" },
  },
  {
    id: "23",
    type: "custom",
    position: { x: 734, y: 68 },
    data: { icon: "router" },
  },
  {
    id: "24",
    type: "custom",
    position: { x: 416, y: 923 },
    data: { icon: "router" },
  },
  {
    id: "25",
    type: "custom",
    position: { x: 56, y: 398 },
    data: { icon: "router" },
  },
];

const initialEdges = [
  {
    type: "floating",
    source: "8",
    target: "11",
    id: "xy-edge__8-11",
  },
  {
    type: "floating",
    source: "11",
    target: "6",
    id: "xy-edge__11-6",
  },
  {
    type: "floating",
    source: "6",
    target: "23",
    id: "xy-edge__6-23",
  },
  {
    type: "floating",
    source: "23",
    target: "4",
    id: "xy-edge__23-4",
  },
  {
    type: "floating",
    source: "4",
    target: "18",
    id: "xy-edge__4-18",
  },
  {
    type: "floating",
    source: "18",
    target: "21",
    id: "xy-edge__18-21",
  },
  {
    type: "floating",
    source: "21",
    target: "9",
    id: "xy-edge__21-9",
  },
  {
    type: "floating",
    source: "9",
    target: "3",
    id: "xy-edge__9-3",
  },
  {
    type: "floating",
    source: "3",
    target: "7",
    id: "xy-edge__3-7",
  },
  {
    type: "floating",
    source: "7",
    target: "5",
    id: "xy-edge__7-5",
  },
  {
    type: "floating",
    source: "5",
    target: "3",
    id: "xy-edge__5-3",
  },
  {
    type: "floating",
    source: "12",
    target: "5",
    id: "xy-edge__12-5",
  },
  {
    type: "floating",
    source: "5",
    target: "24",
    id: "xy-edge__5-24",
  },
  {
    type: "floating",
    source: "7",
    target: "24",
    id: "xy-edge__7-24",
  },
  {
    type: "floating",
    source: "24",
    target: "17",
    id: "xy-edge__24-17",
  },
  {
    type: "floating",
    source: "17",
    target: "20",
    id: "xy-edge__17-20",
  },
  {
    type: "floating",
    source: "17",
    target: "14",
    id: "xy-edge__17-14",
  },
  {
    type: "floating",
    source: "14",
    target: "2",
    id: "xy-edge__14-2",
  },
  {
    type: "floating",
    source: "2",
    target: "25",
    id: "xy-edge__2-25",
  },
  {
    type: "floating",
    source: "25",
    target: "8",
    id: "xy-edge__25-8",
  },
  {
    type: "floating",
    source: "11",
    target: "25",
    id: "xy-edge__11-25",
  },
  {
    type: "floating",
    source: "25",
    target: "15",
    id: "xy-edge__25-15",
  },
  {
    type: "floating",
    source: "15",
    target: "6",
    id: "xy-edge__15-6",
  },
  {
    type: "floating",
    source: "15",
    target: "22",
    id: "xy-edge__15-22",
  },
  {
    type: "floating",
    source: "2",
    target: "15",
    id: "xy-edge__2-15",
  },
  {
    type: "floating",
    source: "15",
    target: "13",
    id: "xy-edge__15-13",
  },
  {
    type: "floating",
    source: "13",
    target: "19",
    id: "xy-edge__13-19",
  },
  {
    type: "floating",
    source: "19",
    target: "1",
    id: "xy-edge__19-1",
  },
  {
    type: "floating",
    source: "1",
    target: "16",
    id: "xy-edge__1-16",
  },
  {
    type: "floating",
    source: "16",
    target: "15",
    id: "xy-edge__16-15",
  },
  {
    type: "floating",
    source: "16",
    target: "18",
    id: "xy-edge__16-18",
  },
  {
    type: "floating",
    source: "16",
    target: "23",
    id: "xy-edge__16-23",
  },
  {
    type: "floating",
    source: "13",
    target: "5",
    id: "xy-edge__13-5",
  },
  {
    type: "floating",
    source: "13",
    target: "10",
    id: "xy-edge__13-10",
  },
  {
    type: "floating",
    source: "10",
    target: "22",
    id: "xy-edge__10-22",
  },
  {
    type: "floating",
    source: "22",
    target: "17",
    id: "xy-edge__22-17",
  },
  {
    type: "floating",
    source: "10",
    target: "17",
    id: "xy-edge__10-17",
  },
  {
    type: "floating",
    source: "13",
    target: "9",
    id: "xy-edge__13-9",
  },
  {
    type: "floating",
    source: "10",
    target: "24",
    id: "xy-edge__10-24",
  },
  {
    type: "floating",
    source: "19",
    target: "16",
    id: "xy-edge__19-16",
  },
  {
    type: "floating",
    source: "21",
    target: "1",
    id: "xy-edge__21-1",
  },
  {
    type: "floating",
    source: "5",
    target: "15",
    id: "xy-edge__5-15",
  },
  {
    type: "floating",
    source: "17",
    target: "11",
    id: "xy-edge__17-11",
  },
  {
    type: "floating",
    source: "11",
    target: "23",
    id: "xy-edge__11-23",
  },
  {
    type: "floating",
    source: "13",
    target: "6",
    id: "xy-edge__13-6",
  },
];

const connectionLineStyle = {
  stroke: "#b1b1b7",
};

const nodeTypes = {
  custom: CustomNode,
  cloud: CloudNode,
};

const edgeTypes = {
  floating: FloatingEdge,
};

const defaultEdgeOptions = {
  type: "floating",
};

const fitViewOptions = {
  padding: 0.1,
};

const isEdgeExists = (edges, source, target) => {
  return edges.some(
    (edge) =>
      (edge.source === source && edge.target === target) ||
      (edge.source === target && edge.target === source)
  );
};

const CloudFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = (params) => {
    // Check bidirectionally for an existing edge
    if (!isEdgeExists(edges, params.source, params.target)) {
      setEdges((eds) => addEdge(params, eds));
    }
  };

  useEffect(() => {
    console.log("Current edges:", edges);
  }, [edges]);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        style={{ backgroundColor: variables.black }}
        defaultEdgeOptions={defaultEdgeOptions}
        connectionLineComponent={CustomConnectionLine}
        connectionLineStyle={connectionLineStyle}
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
        <Controls orientation={"horizontal"} position={"bottom-right"} />
      </ReactFlow>
    </div>
  );
};

export default CloudFlow;
