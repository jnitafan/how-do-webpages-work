"use client";

import Link from "next/link";
import { useEffect, useRef, useMemo, useState, Suspense } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useLoader, Canvas, useFrame, useThree } from "@react-three/fiber";
import { useProgress } from "@react-three/drei";
import { animate, useMotionValue } from "motion/react";
import * as THREE from "three";

import styles from "./page.module.scss";

const NUM_STARS = 500;
const CONNECT_THRESHOLD = 16; // Distance threshold for connecting stars
const RESET_DISTANCE = 30; // Distance at which stars reset
const SPEED = 0.08;

const Starfield: React.FC = () => {
  // Initialize stars with random positions
  const stars = useMemo(() => {
    return new Array(NUM_STARS).fill(0).map(() => ({
      x: (Math.random() - 0.5) * 30,
      y: (Math.random() - 0.5) * 30,
      z: Math.random() * (RESET_DISTANCE + 10) - 20, // Starts between -10 and 10
    }));
  }, []);

  // Refs for points and lines objects
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  // This ref will hold a mapping for star connections.
  // Keys will be strings like "i,j" where i and j are star indices.
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
    const controlsZ = animate(cameraZ, 30, {
      duration: 2,
      ease: [0.5, 0.5, 0.3, 0.9],
    });
    // Animate camera fov from 180 to 90
    const controlsFov = animate(cameraFOV, 90, {
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
  const texture = useLoader(THREE.TextureLoader, "images/base.png");
  return null;
}

function LoadingOverlay() {
  const { loaded, total } = useProgress();
  // Manage spinner opacity and visibility
  const [spinnerOpacity, setSpinnerOpacity] = useState(1);
  const [showSpinner, setShowSpinner] = useState(true);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // When loading is complete, start fading out the spinner
    if (total > 0 && loaded === total) {
      setSpinnerOpacity(0);
      // After the transition (1s), hide the spinner and show the button
      const timeout = setTimeout(() => {
        setShowSpinner(false);
        setShowButton(true);
      }, 1000); // Duration in ms must match the CSS transition time
      return () => clearTimeout(timeout);
    }
  }, [loaded, total]);

  return (
    <>
      {showSpinner && (
        <div
          className={styles.startButton}
          style={{
            opacity: spinnerOpacity,
            transition: "opacity 1s ease",
            width: "100%",
            height: "100%",
            zIndex: 10,
          }}
        >
          {/* Replace the text with an actual spinner if you wish */}
          <div className={styles.startSpinner}></div>
        </div>
      )}
      {showButton && (
        <Link href="/1">
          <button
            className={styles.startButton}
            style={{
              opacity: 1,
            }}
            onClick={() => console.log("Button clicked!")}
          >
            Click to start.
          </button>
        </Link>
      )}
    </>
  );
}

export default function Web1() {
  return (
    <div>
      <div className={styles.introLayout}>
        <div className={styles.introButton}>
          <h1>How do webpages work?</h1>
          <LoadingOverlay />
        </div>
      </div>
      <div className={styles.introBackground}>
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
    </div>
  );
}
