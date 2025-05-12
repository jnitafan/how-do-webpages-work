// components/slides/Slide1.tsx
"use client";

import React, {
  forwardRef,
  Suspense,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { animate } from "framer-motion/dom";
import { animate as animateTHREE, useMotionValue } from "framer-motion";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useLoader, Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import styles from "./slides.module.scss";

const NUM_STARS = 500;
const CONNECT_THRESHOLD = 16;
const RESET_DISTANCE = 30;
const SPEED = 0.08;

const Starfield: React.FC = () => {
  const stars = useMemo(() => {
    return new Array(NUM_STARS).fill(0).map(() => ({
      x: (Math.random() - 0.5) * 30,
      y: (Math.random() - 0.5) * 30,
      z: Math.random() * (RESET_DISTANCE + 10) - 20, // Starts between -10 and 10
    }));
  }, []);

  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const connectionMapRef = useRef<{ [key: string]: boolean }>({});

  useFrame(() => {
    if (pointsRef.current && linesRef.current) {
      const positions = pointsRef.current.geometry.attributes.position
        .array as Float32Array;
      const linePositions = linesRef.current.geometry.attributes.position
        .array as Float32Array;
      let lineIndex = 0;
      const connectionMap = connectionMapRef.current;

      // Check for new connections (only add if not already in our map)
      for (let i = 0; i < stars.length; i++) {
        stars[i].z += SPEED;

        if (stars[i].z > RESET_DISTANCE) {
          // Remove any connection that involves star i.
          for (const key in connectionMap) {
            const [indexA, indexB] = key.split(",").map(Number);
            if (indexA === i || indexB === i) {
              delete connectionMap[key];
            }
          }
          // Reset the star to the back with new random x, y
          stars[i].z = -10;
          stars[i].x = (Math.random() - 0.5) * 20;
          stars[i].y = (Math.random() - 0.5) * 20;
        }

        // Update the star position buffer
        positions[i * 3] = stars[i].x;
        positions[i * 3 + 1] = stars[i].y;
        positions[i * 3 + 2] = stars[i].z;
        for (let j = i + 1; j < stars.length; j++) {
          const key = `${i},${j}`;
          if (!(key in connectionMap)) {
            const a = stars[i];
            const b = stars[j];
            const distance =
              (a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2;
            if (distance < CONNECT_THRESHOLD) {
              connectionMap[key] = true;
            }
          }
        }
      }

      // Update line buffer based on our stored connections
      for (const key in connectionMap) {
        const [i, j] = key.split(",").map(Number);
        const a = stars[i];
        const b = stars[j];
        if (lineIndex < linePositions.length - 6) {
          linePositions[lineIndex++] = a.x;
          linePositions[lineIndex++] = a.y;
          linePositions[lineIndex++] = a.z;
          linePositions[lineIndex++] = b.x;
          linePositions[lineIndex++] = b.y;
          linePositions[lineIndex++] = b.z;
        }
      }
      // Clear any unused part of the line positions array
      for (let k = lineIndex; k < linePositions.length; k++) {
        linePositions[k] = 0;
      }

      // Inform three.js that the attributes have been updated
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
      linesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <>
      {/* Connecting Lines */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            args={[new Float32Array(19683), 3]}
            attach="attributes-position"
            count={NUM_STARS * 10}
          />
        </bufferGeometry>
        <lineBasicMaterial color="white" transparent opacity={0.25} />
      </lineSegments>

      {/* Stars */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            args={[
              new Float32Array(stars.flatMap(({ x, y, z }) => [x, y, z])),
              3,
            ]}
            attach="attributes-position"
            count={stars.length}
          />
        </bufferGeometry>
        <pointsMaterial size={0.2} color="white" />
      </points>
    </>
  );
};

const AnimatedCamera: React.FC = () => {
  // Get the current camera from the three.js context.
  const { camera }: { camera: THREE.PerspectiveCamera } = useThree();
  // Create a motion value starting at z = 100.
  const cameraZ = useMotionValue(100);
  const cameraFOV = useMotionValue(180);

  useEffect(() => {
    // Animate camera z from 100 to 30
    const controlsZ = animateTHREE(cameraZ, 30, {
      duration: 2,
      ease: [0.5, 0.5, 0.3, 0.9],
    });
    // Animate camera fov from 180 to 90
    const controlsFov = animateTHREE(cameraFOV, 90, {
      duration: 2,
      ease: [0.5, 0.5, 0.3, 0.9],
    });
    // Clean up the animations on unmount.
    return () => {
      controlsZ.stop();
      controlsFov.stop();
    };
  }, [cameraZ, cameraFOV]);

  useFrame(() => {
    // Update camera's z position and fov every frame.
    camera.position.z = cameraZ.get();
    camera.fov = cameraFOV.get();
    camera.updateProjectionMatrix();
  });

  return null;
};

function DummyAsset() {
  const texture = useLoader(THREE.TextureLoader, "images/placeholder.png");
  return null;
}

const Title = ({ text }: { text: string }) => {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    let alive = true;

    const runGlitch = () => {
      if (!alive || !titleRef.current) return;

      // randomise
      const max = 10;
      const x = Math.random() * max * 2 - max;
      const y = Math.random() * max * 2 - max;
      const dur = 0.05; // 0.05–0.25s
      const rest = Math.random() * 1.0 + 0.5; // 0.5–3.5s

      // animate CSS vars on the h1
      animate(
        titleRef.current!,
        { ["--glitch-x"]: `${x}px`, ["--glitch-y"]: `${y}px` },
        { duration: dur, ease: "linear" }
      );

      // animate back after dur
      setTimeout(() => {
        if (!titleRef.current) return;
        animate(
          titleRef.current!,
          { ["--glitch-x"]: `0px`, ["--glitch-y"]: `0px` },
          { duration: dur, ease: "linear" }
        );
      }, dur * 1000);

      // schedule next burst
      setTimeout(runGlitch, (dur + rest) * 1000);
    };

    runGlitch();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <h1 ref={titleRef} data-text={text}>
      {text}
    </h1>
  );
};

const Slide1 = forwardRef((_, ref) => {
  useImperativeHandle(ref, () => ({
    entryAnimation: () => {},
    exitAnimation: () =>
      new Promise<void>((res) => {
        res();
      }),
  }));

  return (
    <div className={styles.slide}>
      <div className={styles.s1__starfield}>
        <Canvas
          camera={{ position: [0, 0, 100] }}
          gl={{ logarithmicDepthBuffer: true }}
        >
          <Suspense fallback={null}>
            <fog attach="fog" args={["#141415", 0, 40]} />
            <AnimatedCamera />
            <Starfield />
            <EffectComposer>
              <Bloom
                intensity={1.5}
                luminanceThreshold={0.1}
                luminanceSmoothing={0.9}
              />
            </EffectComposer>
            <DummyAsset />
          </Suspense>
        </Canvas>
      </div>
      <div className={styles.s1__titleContainer}>
        <div className={styles.s1__title}>
          <Title text="How do webpages work?" />
        </div>
      </div>
    </div>
  );
});

export default Slide1;
