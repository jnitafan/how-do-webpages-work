"use client";
import React, { useMemo } from "react";
import { motion } from "framer-motion";

// ---------------------------------------------------------------------------
// 1. JSON Data
// ---------------------------------------------------------------------------
const data = [
  {
    tagName: "HTML",
    attributes: {},
    className: "",
    id: "",
    textContent:
      'Title\n\n body {\n width: 500px;\n }\n\n\n Title\n \n \n\n\n let all = document.getElementsByTagName("*");\n let banana = document.getElementById("banana");\n let allBanana = [];\n for (let i = 0, max = all.length; i < max; i++) {\n let elementData = {};\n Object.defineProperties(elementData, {\n tagName: { value: all[i].tagName, enumerable: true },\n attributes: { value: all[i].attributes, enumerable: true },\n className: { value: all[i].className, enumerable: true },\n id: { value: all[i].id, enumerable: true },\n textContent: { value: all[i].textContent, enumerable: true },\n childNodes: { value: all[i].childNodes, enumerable: true },\n children: { value: all[i].children, enumerable: true },\n });\n allBanana.push(elementData);\n }\n banana.textContent = JSON.stringify(allBanana, null, 4);\n',
    childNodes: { "0": {}, "1": {} },
    children: { "0": {}, "1": {} },
  },
  {
    tagName: "HEAD",
    attributes: {},
    className: "",
    id: "",
    textContent: "Title\n\n body {\n width: 500px;\n }\n\n",
    childNodes: { "0": {}, "1": {}, "2": {}, "3": {} },
    children: { "0": {}, "1": {} },
  },
  {
    tagName: "TITLE",
    attributes: {},
    className: "",
    id: "",
    textContent: "Title",
    childNodes: { "0": {} },
    children: {},
  },
  {
    tagName: "STYLE",
    attributes: {},
    className: "",
    id: "",
    textContent: "\n body {\n width: 500px;\n }\n",
    childNodes: { "0": {} },
    children: {},
  },
  {
    tagName: "BODY",
    attributes: {},
    className: "",
    id: "",
    textContent:
      '\n Title\n \n \n\n\n let all = document.getElementsByTagName("*");\n let banana = document.getElementById("banana");\n let allBanana = [];\n for (let i = 0, max = all.length; i < max; i++) {\n let elementData = {};\n Object.defineProperties(elementData, {\n tagName: { value: all[i].tagName, enumerable: true },\n attributes: { value: all[i].attributes, enumerable: true },\n className: { value: all[i].className, enumerable: true },\n id: { value: all[i].id, enumerable: true },\n textContent: { value: all[i].textContent, enumerable: true },\n childNodes: { value: all[i].childNodes, enumerable: true },\n children: { value: all[i].children, enumerable: true },\n });\n allBanana.push(elementData);\n }\n banana.textContent = JSON.stringify(allBanana, null, 4);\n',
    childNodes: {
      "0": {},
      "1": {},
      "2": {},
      "3": {},
      "4": {},
      "5": {},
      "6": {},
      "7": {},
    },
    children: { "0": {}, "1": {}, "2": {} },
  },
  {
    tagName: "P",
    attributes: { "0": {}, "1": {}, "2": {} },
    className: "title",
    id: "title",
    textContent: "Title",
    childNodes: { "0": {} },
    children: {},
  },
  {
    tagName: "SCRIPT",
    attributes: { "0": {} },
    className: "",
    id: "",
    textContent:
      '\n let all = document.getElementsByTagName("*");\n let banana = document.getElementById("banana");\n let allBanana = [];\n for (let i = 0, max = all.length; i < max; i++) {\n let elementData = {};\n Object.defineProperties(elementData, {\n tagName: { value: all[i].tagName, enumerable: true },\n attributes: { value: all[i].attributes, enumerable: true },\n className: { value: all[i].className, enumerable: true },\n id: { value: all[i].id, enumerable: true },\n textContent: { value: all[i].textContent, enumerable: true },\n childNodes: { value: all[i].childNodes, enumerable: true },\n children: { value: all[i].children, enumerable: true },\n });\n allBanana.push(elementData);\n }\n banana.textContent = JSON.stringify(allBanana, null, 4);\n',
    childNodes: { "0": {} },
    children: {},
  },
];

// ---------------------------------------------------------------------------
// 2. Build a Hierarchy (Skip Empty Nodes)
// ---------------------------------------------------------------------------
function buildHierarchy(node: any) {
  if (!node || !node.tagName) return null;
  const childArray = node.children ? Object.values(node.children) : [];
  const validChildren = childArray
    .map((child) => buildHierarchy(child))
    .filter(Boolean) as { name: string; children: any[] }[];
  return {
    name: node.tagName,
    children: validChildren,
  };
}
function buildHierarchyFromArray(dataArray: any[]) {
  const topLevel = dataArray
    .map((item) => buildHierarchy(item))
    .filter(Boolean) as { name: string; children: any[] }[];
  return { name: "DOM", children: topLevel };
}

// ---------------------------------------------------------------------------
// 3. Compute Layout (BFS) with an Offset to Center the Graph
// ---------------------------------------------------------------------------
function computeLayout(
  root: { name: string; children: any[] },
  horizontalSpacing = 140,
  verticalSpacing = 100
) {
  interface NodeLayout {
    idx: number;
    name: string;
    x: number;
    y: number;
  }
  const nodes: NodeLayout[] = [];
  const edges: { source: number; target: number }[] = [];
  const positionsPerDepth: { [depth: number]: number } = {};

  // BFS traversal
  const queue: { node: any; depth: number; parentIndex: number }[] = [];
  let index = 0;
  queue.push({ node: root, depth: 0, parentIndex: -1 });

  while (queue.length > 0) {
    const { node, depth, parentIndex } = queue.shift()!;
    positionsPerDepth[depth] = positionsPerDepth[depth] || 0;

    const x = positionsPerDepth[depth] * horizontalSpacing;
    const y = depth * verticalSpacing;
    const currentIndex = index;

    nodes.push({
      idx: currentIndex,
      name: node.name,
      x,
      y,
    });

    if (parentIndex !== -1) {
      edges.push({ source: parentIndex, target: currentIndex });
    }

    positionsPerDepth[depth]++;
    index++;

    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        queue.push({
          node: child,
          depth: depth + 1,
          parentIndex: currentIndex,
        });
      }
    }
  }

  // Add an offset so the nodes don't all sit in the top left.
  const offsetX = 50;
  const offsetY = 50;
  nodes.forEach((n) => {
    n.x += offsetX;
    n.y += offsetY;
  });

  // Expand the SVG dimensions to account for the offset.
  const maxDepth = Math.max(...Object.keys(positionsPerDepth).map(Number));
  const maxAtDepth = Math.max(...Object.values(positionsPerDepth));
  const width = maxAtDepth * horizontalSpacing + offsetX * 2;
  const height = (maxDepth + 1) * verticalSpacing + offsetY * 2;

  return { nodes, edges, width, height };
}

// ---------------------------------------------------------------------------
// 4. Tree Diagram Component (SVG with Center-to-Center Arrows)
// ---------------------------------------------------------------------------
function TreeDiagram() {
  const root = useMemo(() => buildHierarchyFromArray(data), []);
  const { nodes, edges, width, height } = useMemo(
    () => computeLayout(root, 140, 100),
    [root]
  );

  return (
    <div style={{ overflow: "auto", border: "1px solid #ccc", padding: 16 }}>
      <svg width={width} height={height} style={{ background: "#222" }}>
        <defs>
          <marker
            id="arrow"
            markerWidth="10"
            markerHeight="10"
            refX="10"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,6 L9,3 z" fill="#2a80ff" />
          </marker>
        </defs>

        {/* Edges: drawn from center-to-center */}
        {edges.map((edge, i) => {
          const s = nodes[edge.source];
          const t = nodes[edge.target];
          return (
            <motion.line
              key={i}
              x1={s.x + 20}
              y1={s.y + 20}
              x2={t.x + 20}
              y2={t.y + 20}
              stroke="#2a80ff"
              strokeWidth={2}
              markerEnd="url(#arrow)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            />
          );
        })}

        {/* Nodes: ellipses with text labels */}
        {nodes.map((node, i) => (
          <motion.g
            key={node.idx}
            initial={{ opacity: 0, scale: 0.8, x: node.x + 20, y: node.y + 20 }}
            animate={{ opacity: 1, scale: 1, x: node.x + 20, y: node.y + 20 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <ellipse
              rx={40}
              ry={20}
              fill="#ffd56b"
              stroke="#2a80ff"
              strokeWidth={2}
            />
            <text
              textAnchor="middle"
              dy=".35em"
              fill="#333"
              fontWeight="bold"
              style={{ pointerEvents: "none" }}
            >
              {node.name}
            </text>
          </motion.g>
        ))}
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 5. Export the Page Component
// ---------------------------------------------------------------------------
export default function Page() {
  return (
    <main
      style={{
        padding: 20,
        color: "#fff",
        background: "#111",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ textAlign: "center" }}>Visual Tree Diagram</h1>
      <TreeDiagram />
    </main>
  );
}
