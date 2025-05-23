"use client";

import React, { useRef, useEffect, useState } from "react";
import {
  ReactFlow,
  Background,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  StraightEdge,
  BackgroundVariant,
  MarkerType,
} from "@xyflow/react";
import { ThrobbingEdge, NetworkNode, LabelNode } from "./reactflow.utils";
import "@xyflow/react/dist/style.css";
import styles from "./reactflow.module.scss";

export const PointNode = () => {
  return (
    <div className={styles.point}>
      <Handle
        type="target"
        position={Position.Top}
        className={styles.diagramHandle}
        isConnectable={true}
        style={{
          opacity: 0,
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
};

export const ContinuousMarqueeNode = ({ data }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    // total width of one copy of content
    const contentWidth = track.scrollWidth / 2;
    // duration so that speed px/sec ⇒ duration = width / speed
    setDuration(contentWidth / data.speed);
  }, [data.speed]);

  return (
    <div
      className={styles.marquee}
      style={{
        width: "215px",
        ...data.style,
      }}
    >
      <div
        ref={trackRef}
        className={styles.track}
        style={{
          animationDuration: `${duration}s`,
          animationDirection: data.status === "1234" ? "reverse" : "normal",
        }}
      >
        {data.status === "response" ? (
          <>
            <div className={styles.trackResponse}>response: 200 OK</div>
            <div className={styles.trackResponse}>response: 200 OK</div>
          </>
        ) : data.status === "1234" ? (
          <>
            <div className={styles.trackItem}>
              <div className={styles.trackNumber}>1</div>
              <div className={styles.trackNumber}>2</div>
              <div className={styles.trackNumber}>3</div>
              <div className={styles.trackNumber}>4</div>
            </div>
            <div className={styles.trackItem}>
              <div className={styles.trackNumber}>1</div>
              <div className={styles.trackNumber}>2</div>
              <div className={styles.trackNumber}>3</div>
              <div className={styles.trackNumber}>4</div>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

const TCPHeaderNode = ({ data, id }: { data: any; id: any }) => {
  return (
    <div
      id={id}
      style={{
        ...data.style,
      }}
    >
      <div className={styles.tcpHeaderNode}>
        <table>
          <tbody>
            <tr>
              <td colSpan={4} style={{ backgroundColor: "#368ce8" }}>
                Header
              </td>
              <td
                rowSpan={7}
                style={{
                  width: "25%",
                  backgroundColor: "white",
                  color: "#333",
                }}
              >
                Data<p className={styles.bits}>&lt;1440 bits</p>
              </td>
            </tr>
            <tr>
              <td colSpan={3}>
                Source port address<p className={styles.bits}>16 bits</p>
              </td>
              <td>
                Destination port address<p className={styles.bits}>16 bits</p>
              </td>
            </tr>
            <tr>
              <td colSpan={4}>
                Sequence number<p className={styles.bits}>32 bits</p>
              </td>
            </tr>
            <tr>
              <td colSpan={4}>
                Acknowledgement number<p className={styles.bits}>32 bits</p>
              </td>
            </tr>
            <tr>
              <td>
                HLEN<p className={styles.bits}>4 bits</p>
              </td>
              <td>
                Reserved<p className={styles.bits}>6 bits</p>
              </td>
              <td>Flags</td>
              <td>
                Window Size<p className={styles.bits}>16 bits</p>
              </td>
            </tr>
            <tr>
              <td colSpan={3}>
                Checksum<p className={styles.bits}>16 bits</p>
              </td>
              <td>
                Urgent Pointer<p className={styles.bits}>16 bits</p>
              </td>
            </tr>
            <tr>
              <td colSpan={4}>
                Options and Padding<p className={styles.bits}>32 bits</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Handle
        type="target"
        position={Position.Top}
        className={styles.diagramHandle}
        isConnectable={true}
        style={{
          opacity: 0,
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
};

const DiagramNode = ({ data, id }) => {
  return (
    <div
      id={id}
      className={styles.diagramNode}
      style={{
        ...data.style,
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className={styles.diagramHandle}
        isConnectable={true}
        style={{
          opacity: 0,
          width: "100%",
          height: "100%",
        }}
      />

      <div className={styles.dataContent}>{data.label}</div>

      <Handle
        type="source"
        position={Position.Bottom}
        className={styles.diagramHandle}
        isConnectable={true}
        style={{
          opacity: 0,
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
};

const nodeTypes = {
  tcpHeaderNode: TCPHeaderNode,
  marquee: ContinuousMarqueeNode,
  point: PointNode,
  diagram: DiagramNode,
  network: NetworkNode,
  label: LabelNode,
};

const edgeTypes = {
  throbbing: ThrobbingEdge,
  straight: StraightEdge,
};

const DiagramGraph = ({ nodes: initialNodes, edges: initialEdges }) => {
  // 4. Set up state hooks for nodes and edges
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className={styles.diagram}>
      <ReactFlowProvider>
        <div className={styles.diagramContainer}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            defaultEdgeOptions={{
              type: "straight",
              markerEnd: {
                type: MarkerType.ArrowClosed,
              },
            }}
            minZoom={0.001}
            maxZoom={1.5}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
            fitViewOptions={{ padding: 0.2 }}
            fitView
          >
            <Background color="#444" variant={BackgroundVariant.Cross} />
          </ReactFlow>
        </div>
      </ReactFlowProvider>
    </div>
  );
};

export default DiagramGraph;
