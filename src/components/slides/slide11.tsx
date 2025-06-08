// components/slides/Slide11.tsx
"use client";

import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useCallback,
  useRef,
} from "react";
import dagre from "@dagrejs/dagre";
import styles from "./slides.module.scss";
import placeholderHTML from "@/data/placeholder";

import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  BackgroundVariant,
} from "@xyflow/react";
import type {
  ReactFlowInstance,
  Node as FlowNode,
  Edge as FlowEdge,
} from "@xyflow/react";
import { LabelNode } from "@/utils/reactflow.utils";
import { AutoSizeNode } from "@/utils/reactflow.utils";

let nextId = 1;

// Traversal & dagre layout (unchanged)…
function traverse(
  element: React.ReactElement<any>,
  parentId: string | null,
  nodes: FlowNode[],
  edges: FlowEdge[]
) {
  const myId = `node_${nextId++}`;
  const label =
    typeof element.type === "string"
      ? element.type
      : (element.type as any).name || "Anonymous";

  nodes.push({
    id: myId,
    type: "autoSize",
    data: { label },
    position: { x: 0, y: 0 },
    style: {
      border: "1px solid #777",
      borderRadius: 4,
      color: "black",
      background: "#fff",
    },
  });

  if (parentId) {
    edges.push({
      id: `e_${parentId}_${myId}`,
      source: parentId,
      target: myId,
    });
  }

  React.Children.forEach(element.props.children, (child) => {
    if (React.isValidElement(child)) {
      traverse(child, myId, nodes, edges);
    }
  });
}

function applyDagreLayout(
  nodes: FlowNode[],
  edges: FlowEdge[],
  direction: "TB" | "LR" = "TB"
): FlowNode[] {
  const g = new dagre.graphlib.Graph();

  // ↓ add nodesep and ranksep here ↓
  g.setGraph({
    rankdir: direction,
    nodesep: 50, // <-- smaller horizontal gap
    ranksep: 60, // <-- smaller vertical gap
    marginx: 20, // optional: outer margin
    marginy: 20, // optional: outer margin
  });

  g.setDefaultEdgeLabel(() => ({}));

  const NODE_WIDTH = 30;
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

const Slide11 = forwardRef((_, ref) => {
  useImperativeHandle(ref, () => ({
    entryAnimation: () => {},
    exitAnimation: () => Promise.resolve(),
  }));

  // build the full tree once
  const { fullNodes, fullEdges, nodeTypes, edgeTypes } = useMemo(() => {
    nextId = 1;
    const rawNodes: FlowNode[] = [];
    const rawEdges: FlowEdge[] = [];

    // root label
    rawNodes.push({
      id: "label-1",
      type: "autoSize",
      position: { x: 0, y: -200 },
      data: { label: "HTML as a tree (try clicking me!)" },
      style: { color: "black" },
      draggable: false,
      connectable: false,
    });

    traverse(placeholderHTML(), "label-1", rawNodes, rawEdges);
    const laid = applyDagreLayout(rawNodes, rawEdges);
    // overwrite root position
    laid.forEach((n) => {
      if (n.id === "label-1") n.position = { x: 0, y: -200 };
    });

    return {
      fullNodes: laid,
      fullEdges: rawEdges,
      nodeTypes: { label: LabelNode, autoSize: AutoSizeNode },
      edgeTypes: {},
    };
  }, []);

  return (
    <div className={styles.slide}>
      <ReactFlowProvider>
        <InteractiveGraph
          fullNodes={fullNodes}
          fullEdges={fullEdges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
        />
      </ReactFlowProvider>
    </div>
  );
});
Slide11.displayName = "Slide11";
export default Slide11;

// ——————————————————————————————————————————————
// InteractiveGraph.tsx
// ——————————————————————————————————————————————
interface InteractiveGraphProps {
  fullNodes: FlowNode[];
  fullEdges: FlowEdge[];
  nodeTypes: Record<string, any>;
  edgeTypes: Record<string, any>;
}

const InteractiveGraph: React.FC<InteractiveGraphProps> = ({
  fullNodes,
  fullEdges,
  nodeTypes,
  edgeTypes,
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<FlowNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<FlowEdge>([]);
  const flowInstance = useRef<ReactFlowInstance>(null);

  // On init: collapse to just the root, then fit view
  const handleInit = useCallback(
    (instance: ReactFlowInstance) => {
      flowInstance.current = instance;
      // roots = nodes with no incoming edge
      const roots = fullNodes.filter(
        (n) => !fullEdges.some((e) => e.target === n.id)
      );
      setNodes(roots);
      setEdges([]);
      instance.fitView({ padding: 0.2 });
    },
    [fullNodes, fullEdges, setNodes, setEdges]
  );

  // Expand children + reset camera
  const handleNodeClick = useCallback(
    (_evt, node) => {
      // find edges from this node
      const outgoing = fullEdges.filter((e) => e.source === node.id);
      if (outgoing.length === 0) return;

      // add missing child nodes
      const childIds = outgoing.map((e) => e.target);
      const newNodes = fullNodes.filter(
        (n) => childIds.includes(n.id) && !nodes.find((x) => x.id === n.id)
      );
      if (newNodes.length) setNodes((nds) => nds.concat(newNodes));

      // add missing edges
      const newEdges = outgoing.filter(
        (e) => !edges.find((x) => x.id === e.id)
      );
      if (newEdges.length) setEdges((eds) => eds.concat(newEdges));

      // reset camera
      flowInstance.current?.fitView({ padding: 0.2 });
    },
    [fullEdges, fullNodes, nodes, edges, setNodes, setEdges]
  );

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onInit={handleInit}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={{
          markerEnd: { type: MarkerType.ArrowClosed },
        }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.1}
        maxZoom={1.5}
      >
        <Background color="#444" variant={BackgroundVariant.Cross} gap={12} />
      </ReactFlow>
    </div>
  );
};
