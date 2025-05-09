// components/slides/Slide10.tsx
"use client";

import React, { forwardRef, useImperativeHandle, useMemo } from "react";
import { Node, Edge } from "@xyflow/react";
import dagre from "@dagrejs/dagre";
import styles from "./slides.module.scss";
import DiagramGraph from "@/utils/diagram.utils";
import { LabelNode } from "@/utils/reactflow.utils";
import placeholderHTML from "@/data/placeholder";


let nextId = 1;

function traverse(
  element: React.ReactElement<any>,
  parentId: string | null,
  nodes: Node[],
  edges: Edge[]
) {
  const myId = `node_${nextId++}`;
  const label =
    typeof element.type === "string"
      ? element.type
      : (element.type as any).name || "Anonymous";

  nodes.push({
    id: myId,
    data: { label },
    position: { x: 0, y: 0 },
    style: {
      padding: 8,
      border: "1px solid #777",
      borderRadius: 4,
      color: "black",
      background: "#fff",
    },
  });

  if (parentId) {
    edges.push({ id: `e_${parentId}_${myId}`, source: parentId, target: myId });
  }

  React.Children.forEach(element.props.children, (child) => {
    if (React.isValidElement(child)) {
      traverse(child, myId, nodes, edges);
    }
  });
}

function applyDagreLayout(
  nodes: Node[],
  edges: Edge[],
  direction: "TB" | "LR" = "TB"
): Node[] {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: direction });

  const NODE_WIDTH = 150;
  const NODE_HEIGHT = 40;

  nodes.forEach((n) =>
    g.setNode(n.id, { width: NODE_WIDTH, height: NODE_HEIGHT })
  );
  edges.forEach((e) => g.setEdge(e.source, e.target));

  dagre.layout(g);

  return nodes.map((n) => {
    const { x, y } = g.node(n.id)!;
    return {
      ...n,
      position: { x: x - NODE_WIDTH / 2, y: y - NODE_HEIGHT / 2 },
    };
  });
}

const Slide10 = forwardRef((_, ref) => {
  useImperativeHandle(ref, () => ({
    entryAnimation: () => {},
    exitAnimation: () => Promise.resolve(),
  }));

  const { nodes, edges, nodeTypes } = useMemo(() => {
    nextId = 1;
    // manual positions for custom nodes
    const manualPositions: Record<string, { x: number; y: number }> = {
      "label-1": { x: 2250, y: -300 },
    };

    const rawNodes: Node[] = [];
    const rawEdges: Edge[] = [];

    // add custom label node
    rawNodes.push({
      id: "label-1",
      type: "label",
      position: manualPositions["label-1"],
      data: {
        label: "The html data in tree format.",
        fontSize: "10rem",
      },
      draggable: false,
      connectable: false,
    });

    // traverse placeholderHTML()
    const tree = placeholderHTML();
    traverse(tree, null, rawNodes, rawEdges);

    // apply Dagre layout, then reapply manual positions
    const laidOut = applyDagreLayout(rawNodes, rawEdges, "TB");
    const finalNodes = laidOut.map((n) =>
      manualPositions[n.id] ? { ...n, position: manualPositions[n.id] } : n
    );

    const types = { label: LabelNode };
    return { nodes: finalNodes, edges: rawEdges, nodeTypes: types };
  }, []);

  return (
    <div className={styles.slide}>
      <DiagramGraph nodes={nodes} edges={edges} />
    </div>
  );
});

export default Slide10;
