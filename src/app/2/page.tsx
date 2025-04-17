// src/app/1/page.tsx
"use client";
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
  useMemo,
} from "react";
import { animate } from "framer-motion/dom";
import { PageHandle } from "@/app/types";
import { usePageContext } from "@/contexts/page-context";

const Page = forwardRef<PageHandle>((props, ref) => {
  const animatedRef1 = useRef<HTMLDivElement>(null);
  const animatedRef2 = useRef<HTMLDivElement>(null);
  const { registerPage, unregisterPage, animationType } = usePageContext();

  const handle = useMemo<PageHandle>(
    () => ({
      exitAnimation(onComplete: () => void) {
        if (animationType !== "next") {
          onComplete();
          return;
        }
        if (animatedRef1.current) {
          animate(
            animatedRef1.current,
            { x: [0, 100] },
            {
              duration: 0.5,
              onComplete: () => {
                if (animatedRef2.current) {
                  animate(
                    animatedRef2.current,
                    { x: [0, -100] },
                    { duration: 0.5, onComplete }
                  );
                } else {
                  onComplete();
                }
              },
            }
          );
        } else {
          onComplete();
        }
      },
      enterAnimation(onComplete: () => void) {
        if (animationType !== "next") {
          onComplete();
          return;
        }
        if (animatedRef1.current) {
          animate(
            animatedRef1.current,
            { x: [100, 0] },
            {
              duration: 0.5,
              onComplete: () => {
                if (animatedRef2.current) {
                  animate(
                    animatedRef2.current,
                    { x: [-100, 0] },
                    { duration: 0.5, onComplete }
                  );
                } else {
                  onComplete();
                }
              },
            }
          );
        } else {
          onComplete();
        }
      },
    }),
    [animationType]
  );

  useImperativeHandle(ref, () => handle);

  useEffect(() => {
    registerPage(handle);
    return () => {
      unregisterPage();
    };
  }, [handle, registerPage, unregisterPage]);

  return (
    <div>
      <h1>Page 2</h1>
      <div
        ref={animatedRef1}
        style={{
          background: "lightblue",
          padding: "20px",
          marginBottom: "10px",
        }}
      >
        Page 2 - Animated Div 1
      </div>
      <div
        ref={animatedRef2}
        style={{
          background: "lightgreen",
          padding: "20px",
        }}
      >
        Page 2 - Animated Div 2
      </div>
    </div>
  );
});

export default Page;
