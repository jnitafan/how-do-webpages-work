// components/slides/Slide8.tsx
"use client";

import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { ReactFlow, Background } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import styles from "./slides.module.scss";

// Define the initial nodes
const initialNodes = [
  {
    id: "network",
    type: "input",
    position: { x: 0, y: -40 },
    data: { label: "Network" },
    style: { background: "rgb(242, 160, 160)", color: "#222222" },
  },
  {
    id: "html",
    position: { x: -200, y: 40 },
    data: { label: "HTML" },
    style: { background: "rgb(212, 212, 212)", color: "#222222" },
  },
  {
    id: "css",
    position: { x: 200, y: 40 },
    data: { label: "CSS" },
    style: { background: "rgb(195, 195, 195)", color: "#222222" },
  },
  {
    id: "dom",
    position: { x: -200, y: 80 },
    data: { label: "DOM" },
    style: { background: "rgb(68, 190, 154)", color: "#222222" },
  },
  {
    id: "cssom",
    position: { x: 200, y: 80 },
    data: { label: "CSSOM" },
    style: { background: " rgb(68, 190, 154)", color: "#222222" },
  },
  {
    id: "javascript",
    position: { x: 0, y: 80 },
    data: { label: "JavaScript" },
    style: { background: "rgb(255, 187, 68)", color: "#222222" },
  },
  {
    id: "rendertree",
    position: { x: 0, y: 180 },
    data: { label: "Render Tree" },
    style: { background: "rgb(117, 254, 197)", color: "#222222" },
  },
  {
    id: "layout",
    position: { x: 0, y: 220 },
    data: { label: "Layout" },
    style: { background: " rgb(117, 254, 197)", color: "#222222" },
  },
  {
    id: "paint",
    type: "output",
    position: { x: 0, y: 260 },
    data: { label: "Paint" },
    style: { background: " #ffffff", color: "#222222" },
  },
];

// Define the edges (connections) between nodes
const initialEdges = [
  { id: "e-network-html", source: "network", target: "html" },
  { id: "e-network-css", source: "network", target: "css" },
  { id: "e-network-javascript", source: "network", target: "javascript" },
  { id: "e-html-dom", source: "html", target: "dom" },
  { id: "e-css-cssom", source: "css", target: "cssom" },
  { id: "e-dom-rendertree", source: "dom", target: "rendertree" },
  { id: "e-cssom-rendertree", source: "cssom", target: "rendertree" },
  { id: "e-javascript-rendertree", source: "javascript", target: "rendertree" },
  { id: "e-rendertree-layout", source: "rendertree", target: "layout" },
  { id: "e-layout-paint", source: "layout", target: "paint" },
];

export function Browser() {
  return (
    <ReactFlow
      nodes={initialNodes}
      edges={initialEdges}
      fitView
      fitViewOptions={{ padding: 0.1 }}
    >
      <Background />
    </ReactFlow>
  );
}

const Slide8 = forwardRef((_, ref) => {
  useImperativeHandle(ref, () => ({
    entryAnimation: () => {},
    exitAnimation: () => Promise.resolve(),
  }));

  return (
    <div className={styles.slide}>
      <Browser />
    </div>
  );
});

export default Slide8;
