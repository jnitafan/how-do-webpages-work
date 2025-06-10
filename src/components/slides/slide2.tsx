// components/slides/Slide2.tsx
"use client";

import React, {
  forwardRef,
  useImperativeHandle,
  Suspense,
  useRef,
  useEffect,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import styles from "./slides.module.scss";

// suppress context‐lost message (same as Slide1)
const SuppressContextLost: React.FC = () => {
  const { gl } = useThree();
  useEffect(() => {
    const canvas = gl.domElement;
    const onLost = (e: Event) => {
      e.preventDefault();
      e.stopImmediatePropagation();
    };
    canvas.addEventListener("webglcontextlost", onLost, { capture: true });
    return () => {
      canvas.removeEventListener("webglcontextlost", onLost, { capture: true });
    };
  }, [gl]);
  return null;
};

const FloatingLayers: React.FC = () => {
  const LABEL_SIZE = 0.3;
  const group = useRef<THREE.Group>(null!);

  // store normalized device orientation
  const orientation = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma != null && e.beta != null) {
        // gamma: left/right tilt → x, beta: forward/back tilt → y
        orientation.current.x = THREE.MathUtils.clamp(e.gamma / 45, -1, 1);
        orientation.current.y = THREE.MathUtils.clamp(e.beta / 45, -1, 1);
      }
    };

    // iOS 13+ permission flow
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof (DeviceOrientationEvent as any).requestPermission === "function"
    ) {
      (DeviceOrientationEvent as any)
        .requestPermission()
        .then((perm: string) => {
          if (perm === "granted") {
            window.addEventListener("deviceorientation", handleOrientation);
          }
        })
        .catch(console.error);
    } else {
      window.addEventListener("deviceorientation", handleOrientation);
    }

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  useFrame((state) => {
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    const [px, py] = isMobile
      ? [orientation.current.x, orientation.current.y]
      : state.pointer;

    const targetY = px * Math.PI * 0.25;
    const targetX = -py * Math.PI * 0.25;

    group.current.rotation.y += (targetY - group.current.rotation.y) * 0.1;
    group.current.rotation.x += (targetX - group.current.rotation.x) * 0.1;
  });

  type WebPlane = {
    label: string;
    color: string;
    position: [number, number, number];
  };
  const webStack: WebPlane[] = [
    { label: "HTML", color: "#ee284c", position: [0, 0.75, -2] },
    { label: "CSS", color: "#0e99c7", position: [0, 0.0, -2] },
    { label: "JavaScript", color: "#f3ce15", position: [0, -0.75, -2] },
  ];

  type OsiPlane = {
    label: string;
    color: string;
    position: [number, number, number];
    size: [number, number];
  };
  const osiStack: OsiPlane[] = [
    {
      label: "Application",
      color: "#f05572",
      position: [0, 0, -3.4],
      size: [3.5, 3.5],
    },
    {
      label: "Transport",
      color: "#f68f43",
      position: [0, 0, -4.0],
      size: [5, 5],
    },
    {
      label: "Network",
      color: "#fce054",
      position: [0, 0, -4.6],
      size: [6.5, 6.5],
    },
    {
      label: "Data Link",
      color: "#79c35b",
      position: [0, 0, -5.2],
      size: [8, 8],
    },
    {
      label: "Physical",
      color: "#4ccaf5",
      position: [0, 0, -5.8],
      size: [9.5, 9.5],
    },
  ];

  return (
    <group ref={group}>
      {webStack.map(({ label, color, position }, i) => (
        <mesh key={`web-${i}`} position={position}>
          <planeGeometry args={[3, 0.6]} />
          <meshBasicMaterial color={color} transparent opacity={1.0} />
          <Text
            position={[0, 0, 0.01]}
            fontSize={LABEL_SIZE}
            anchorX="center"
            anchorY="middle"
            color="#ffffff"
          >
            {label}
          </Text>
        </mesh>
      ))}

      {osiStack.map(({ label, color, position, size }, i) => {
        const [, height] = size;
        const textYOffset = height / 2 - 0.1;
        return (
          <mesh key={`osi-${i}`} position={position}>
            <planeGeometry args={size} />
            <meshBasicMaterial color={color} transparent opacity={1.0} />
            <Text
              position={[0, textYOffset, 0.01]}
              fontSize={LABEL_SIZE}
              anchorX="center"
              anchorY="top"
              color="#ffffff"
            >
              {label}
            </Text>
          </mesh>
        );
      })}
    </group>
  );
};

const Slide2 = forwardRef((_, ref) => {
  useImperativeHandle(ref, () => ({
    entryAnimation: () => {},
    exitAnimation: () => Promise.resolve(),
  }));

  return (
    <div className={styles.slide}>
      <div className={styles.s2__layers}>
        <Canvas
          camera={{ position: [0, 0, 6], fov: 50 }}
          gl={{ logarithmicDepthBuffer: true }}
        >
          <SuppressContextLost />
          <Suspense fallback={null}>
            <FloatingLayers />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
});

Slide2.displayName = "Slide2";
export default Slide2;
