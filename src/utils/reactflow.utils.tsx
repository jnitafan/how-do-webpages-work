"use client";

import React, { JSX, memo, useRef } from "react";
import {
  Position,
  Handle,
  useConnection,
  useInternalNode,
  EdgeProps,
  getBezierPath,
  BaseEdge,
} from "@xyflow/react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import Image from "next/image";

export const ComputerIcon = () => {
  return (
    <Image
      src="/images/computer-solid.svg"
      alt="Switch Icon"
      width="64"
      height="64"
      style={{ fill: "#4c8ed4", width: "85%", height: "85%" }}
    />
  );
};

export const TabletIcon = () => {
  return (
    <Image
      src="/images/tablet-solid.svg"
      alt="Switch Icon"
      width="64"
      height="64"
      style={{ fill: "#4c8ed4", width: "85%", height: "85%" }}
    />
  );
};

export const MobileIcon = () => {
  return (
    <Image
      src="/images/mobile-solid.svg"
      alt="Switch Icon"
      width="64"
      height="64"
      style={{ fill: "#4c8ed4", width: "85%", height: "85%" }}
    />
  );
};

export const NetworkIcon = () => {
  return (
    <Image
      src="/images/network-switch-solid.svg"
      alt="Switch Icon"
      width="64"
      height="64"
      style={{ fill: "#4c8ed4", width: "85%", height: "85%" }}
    />
  );
};

export const ServerIcon = () => {
  return (
    <Image
      src="/images/rack-server-solid.svg"
      alt="Switch Icon"
      width="64"
      height="64"
      style={{ fill: "#4c8ed4", width: "85%", height: "85%" }}
    />
  );
};

export const WifiIcon = () => {
  return (
    <Image
      src="/images/wifi-solid.svg"
      alt="Switch Icon"
      width="64"
      height="64"
      style={{ fill: "#4c8ed4", width: "85%", height: "85%" }}
    />
  );
};

export const SwitchIcon = () => {
  return (
    <Image
      src="/images/network-switch-solid.svg"
      alt="Switch Icon"
      width="64"
      height="64"
      style={{ fill: "#4c8ed4", width: "85%", height: "85%" }}
    />
  );
};

export const RouterIcon = () => {
  return (
    <Image
      src="/images/router-solid.svg"
      alt="Router Icon"
      width="64"
      height="64"
      style={{ fill: "#4c8ed4", width: "85%", height: "85%" }}
    />
  );
};

type ComponentKey =
  | "router"
  | "switch"
  | "wifi"
  | "server"
  | "network"
  | "mobile"
  | "tablet"
  | "computer";

// Create a mapping of keys to elements
const componentMap: Record<ComponentKey, JSX.Element> = {
  router: <RouterIcon />,
  switch: <SwitchIcon />,
  wifi: <WifiIcon />,
  server: <ServerIcon />,
  network: <NetworkIcon />,
  mobile: <MobileIcon />,
  tablet: <TabletIcon />,
  computer: <ComputerIcon />,
};

function Annotation({ data }) {
  return (
    <>
      <div className="annotation-content">
        <div>{data.label}</div>
      </div>
    </>
  );
}

export const AnnotationNode = memo(Annotation);

export function CustomNode({ id, data }) {
  const connection = useConnection();
  const isTarget = connection.inProgress && connection.fromNode.id !== id;

  return (
    <div className="customNode">
      <div className="customNodeBody">
        {componentMap[data.icon]}
        {!connection.inProgress && (
          <Handle
            className="customHandle"
            position={Position.Right}
            type="source"
          />
        )}
        {(!connection.inProgress || isTarget) && (
          <Handle
            className="customHandle"
            position={Position.Left}
            type="target"
            isConnectableStart={false}
          />
        )}
      </div>
    </div>
  );
}

export function CloudNode() {
  return <div className="cloudNode"></div>;
}

const AnimatedCircle = ({ delay = 0, reverse = false, pathRef }) => {
  const progress = useMotionValue(reverse ? 1 : 0);
  const [isVisible, setIsVisible] = React.useState(false);

  const x = useTransform(progress, (value) => {
    if (pathRef.current) {
      const totalLength = pathRef.current.getTotalLength();
      const point = pathRef.current.getPointAtLength(value * totalLength);
      return point.x;
    }
    return 0;
  });
  const y = useTransform(progress, (value) => {
    if (pathRef.current) {
      const totalLength = pathRef.current.getTotalLength();
      const point = pathRef.current.getPointAtLength(value * totalLength);
      return point.y;
    }
    return 0;
  });

  const animationRef = useRef(null);
  const delayTimeoutRef = useRef(null);

  const animateMotion = () => {
    if (animationRef.current) animationRef.current.stop();
    const current = progress.get();
    let target, baseDuration;
    if (reverse) {
      target = 0;
      baseDuration = current * 2; // base duration for reverse motion
    } else {
      target = 1;
      baseDuration = (1 - current) * 2; // base duration for forward motion
    }
    // Multiply duration by a random speed factor between 0.5 and 2.0.
    const randomSpeed = 0.5 + Math.random() * 1.5;
    const duration = baseDuration * randomSpeed;

    const controls = animate(progress, target, {
      duration,
      ease: "linear",
      onComplete: () => {
        // Hide the circle before resetting its progress.
        setIsVisible(false);
        // Use a zero-delay timeout (next tick) to let the hide take effect.
        setTimeout(() => {
          progress.set(reverse ? 1 : 0);
          // Wait a random delay (1-3 seconds) before restarting.
          const randomDelay = 1 + Math.random() * 2;
          delayTimeoutRef.current = setTimeout(() => {
            setIsVisible(true);
            animateMotion();
          }, randomDelay * 1000);
        }, 0);
      },
    });
    animationRef.current = controls;
  };

  React.useEffect(() => {
    // Add a random initial delay on top of any provided delay.
    const randomInitialDelay = (delay + Math.random() * 4) * 1000;
    const initTimeout = setTimeout(() => {
      setIsVisible(true);
      animateMotion();
    }, randomInitialDelay);

    return () => {
      clearTimeout(initTimeout);
      if (delayTimeoutRef.current) clearTimeout(delayTimeoutRef.current);
      if (animationRef.current) animationRef.current.stop();
    };
  }, [delay, reverse, progress, pathRef]);

  return (
    <>{isVisible && <motion.circle r="5" fill="#ffffff" style={{ x, y }} />}</>
  );
};

export function FloatingEdge({ source, target }: EdgeProps) {
  let sourceNode = useInternalNode(source);
  let targetNode = useInternalNode(target);

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty } = getEdgeParams(sourceNode, targetNode);

  const [edgePath] = getBezierPath({
    sourceX: sx,
    sourceY: sy,
    targetX: tx,
    targetY: ty,
  });

  // Create a ref for the invisible path element used for measurement.
  const pathRef = useRef(null);

  return (
    <>
      <BaseEdge path={edgePath} />
      {/* Invisible SVG path used by AnimatedCircle for getting total length and points */}
      <path ref={pathRef} d={edgePath} fill="none" stroke="transparent" />
      <AnimatedCircle delay={0} reverse={false} pathRef={pathRef} />
      <AnimatedCircle delay={1} reverse={true} pathRef={pathRef} />
    </>
  );
}

export const CustomConnectionLine = ({
  toX,
  toY,
  fromPosition,
  toPosition,
  fromNode,
}) => {
  if (!fromNode) {
    return null;
  }

  const targetNode = {
    id: "connection-target",
    measured: {
      width: 1,
      height: 1,
    },
    internals: {
      positionAbsolute: { x: toX, y: toY },
    },
  };

  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(
    fromNode,
    targetNode
  );

  const [edgePath] = getBezierPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: sourcePos || fromPosition,
    targetPosition: targetPos || toPosition,
    targetX: tx || toX,
    targetY: ty || toY,
  });

  return (
    <g>
      <path
        fill="none"
        stroke="#222"
        strokeWidth={1.5}
        className="animated"
        d={edgePath}
      />
      <circle
        cx={tx || toX}
        cy={ty || toY}
        fill="#fff"
        r={3}
        stroke="#222"
        strokeWidth={1.5}
      />
    </g>
  );
};

// Helper functions for edge parameter calculations.
function getNodeIntersection(intersectionNode, targetNode) {
  const { width: intersectionNodeWidth, height: intersectionNodeHeight } =
    intersectionNode.measured;
  const intersectionNodePosition = intersectionNode.internals.positionAbsolute;
  const targetPosition = targetNode.internals.positionAbsolute;

  const w = intersectionNodeWidth / 2;
  const h = intersectionNodeHeight / 2;

  const x2 = intersectionNodePosition.x + w;
  const y2 = intersectionNodePosition.y + h;
  const x1 = targetPosition.x + targetNode.measured.width / 2;
  const y1 = targetPosition.y + targetNode.measured.height / 2;

  const xx1 = (x1 - x2) / (2 * w) - (y1 - y2) / (2 * h);
  const yy1 = (x1 - x2) / (2 * w) + (y1 - y2) / (2 * h);
  const a = 1 / (Math.abs(xx1) + Math.abs(yy1) || 1);
  const xx3 = a * xx1;
  const yy3 = a * yy1;
  const x = w * (xx3 + yy3) + x2;
  const y = h * (-xx3 + yy3) + y2;

  return { x, y };
}

function getEdgePosition(node, intersectionPoint) {
  const n = { ...node.internals.positionAbsolute, ...node };
  const nx = Math.round(n.x);
  const ny = Math.round(n.y);
  const px = Math.round(intersectionPoint.x);
  const py = Math.round(intersectionPoint.y);

  if (px <= nx + 1) {
    return Position.Left;
  }
  if (px >= nx + n.measured.width - 1) {
    return Position.Right;
  }
  if (py <= ny + 1) {
    return Position.Top;
  }
  if (py >= n.y + n.measured.height - 1) {
    return Position.Bottom;
  }

  return Position.Top;
}

export function getEdgeParams(source, target) {
  const sourceIntersectionPoint = getNodeIntersection(source, target);
  const targetIntersectionPoint = getNodeIntersection(target, source);

  const sourcePos = getEdgePosition(source, sourceIntersectionPoint);
  const targetPos = getEdgePosition(target, targetIntersectionPoint);

  return {
    sx: sourceIntersectionPoint.x,
    sy: sourceIntersectionPoint.y,
    tx: targetIntersectionPoint.x,
    ty: targetIntersectionPoint.y,
    sourcePos,
    targetPos,
  };
}
