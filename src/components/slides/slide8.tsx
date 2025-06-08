// components/slides/Slide8.tsx
"use client";

import React, { forwardRef, useImperativeHandle } from "react";
import dynamic from "next/dynamic";
import routingLottie from "@/data/routing.json";
import styles from "./slides.module.scss";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const Slide8 = forwardRef((_, ref) => {
  useImperativeHandle(ref, () => ({
    entryAnimation: () => {},
    exitAnimation: () => Promise.resolve(),
  }));

  return (
    <div className={styles.slide}>
      <div className={styles.s8}>
        <div className={styles.s8__desktop}>
          <Lottie
            className={styles.s8__routingLottie}
            animationData={routingLottie}
            loop={true}
          />
          <div className={styles.s8__headers}>
            <div className={styles.layerTitles} style={{ gridArea: "title-l" }}>
              <p>TCP / IP Stack</p>
            </div>
            <div className={styles.layerTitles} style={{ gridArea: "title-r" }}>
              <p>OSI Model</p>
            </div>
            <div className={styles.arrows} style={{ gridArea: "arrow-l" }}>
              <svg
                viewBox="0 0 100 500"
                preserveAspectRatio="none"
                style={{ width: "100%", height: "100%", display: "block" }}
              >
                {/* arrow head + shaft */}
                <path
                  d="M50,0 L100,50 L70,50 L70,500 L30,500 L30,50 L0,50 Z"
                  fill="#444"
                />
              </svg>
              <div
                className={styles.arrowText}
                style={{ transform: "translate(-50%, -50%) rotate(90deg)" }}
              >
                <p>&nbsp;encapsulation&nbsp;</p>
              </div>
            </div>
            <div className={styles.arrows} style={{ gridArea: "arrow-r" }}>
              <svg
                viewBox="0 0 100 500"
                preserveAspectRatio="none"
                style={{ width: "100%", height: "100%", display: "block" }}
              >
                {/* rotate the arrow shape 180° around its center */}
                <g transform="rotate(180 50 250)">
                  <path
                    d="M50,0 L100,50 L70,50 L70,500 L30,500 L30,50 L0,50 Z"
                    fill="#444"
                  />
                </g>
              </svg>
              <div
                className={styles.arrowText}
                style={{ transform: "translate(-50%, -50%) rotate(-90deg)" }}
              >
                <p>&nbsp;decapsulation&nbsp;</p>
              </div>
            </div>
            <div className={styles.layerApp} style={{ gridArea: "layer-1l" }}>
              <p>Application</p>
            </div>
            <div className={styles.layerTrans} style={{ gridArea: "layer-2l" }}>
              <p>Transport</p>
            </div>
            <div
              className={styles.layerNetwork}
              style={{ gridArea: "layer-3l" }}
            >
              <p>Internet</p>
            </div>
            <div className={styles.layerLink} style={{ gridArea: "layer-4l" }}>
              <p>Link</p>
            </div>
            <div className={styles.layerApp} style={{ gridArea: "layer-1r" }}>
              <p>Application</p>
            </div>
            <div className={styles.layerApp} style={{ gridArea: "layer-2r" }}>
              <p>Presentation</p>
            </div>
            <div className={styles.layerApp} style={{ gridArea: "layer-3r" }}>
              <p>Session</p>
            </div>
            <div className={styles.layerTrans} style={{ gridArea: "layer-4r" }}>
              <p>Transport</p>
            </div>
            <div
              className={styles.layerNetwork}
              style={{ gridArea: "layer-5r" }}
            >
              <p>Network</p>
            </div>
            <div className={styles.layerLink} style={{ gridArea: "layer-6r" }}>
              <p>Data Link</p>
            </div>
            <div className={styles.layerPhys} style={{ gridArea: "layer-7r" }}>
              <p>Physical</p>
            </div>
            <div className={styles.packet} style={{ gridArea: "packet-1" }}>
              <div className={styles.packetData}>
                <p>data</p>
              </div>
            </div>
            <div className={styles.packet} style={{ gridArea: "packet-2" }}>
              <div className={styles.packetHeader1}>
                <p>header</p>
              </div>
              <div className={styles.packetData}>
                <p>data</p>
              </div>
            </div>
            <div className={styles.packet} style={{ gridArea: "packet-3" }}>
              <div className={styles.packetHeader2}>
                <p>header</p>
              </div>
              <div className={styles.packetHeader1}>
                <p>header</p>
              </div>
              <div className={styles.packetData}>
                <p>data</p>
              </div>
            </div>
            <div className={styles.packet} style={{ gridArea: "packet-4" }}>
              <div className={styles.packetHeader3}>
                <p>header</p>
              </div>
              <div className={styles.packetHeader2}>
                <p>header</p>
              </div>
              <div className={styles.packetHeader1}>
                <p>header</p>
              </div>
              <div className={styles.packetData}>
                <p>data</p>
              </div>
              <div className={styles.packetFooter3}>
                <p>footer</p>
              </div>
            </div>
            <div className={styles.packet} style={{ gridArea: "packet-5" }}>
              <div className={styles.packetHeader4}></div>
              <div className={styles.packetHeader3}>
                <p>header</p>
              </div>
              <div className={styles.packetHeader2}>
                <p>header</p>
              </div>
              <div className={styles.packetHeader1}>
                <p>header</p>
              </div>
              <div className={styles.packetData}>
                <p>data</p>
              </div>
              <div className={styles.packetFooter3}>
                <p>footer</p>
              </div>
              <div className={styles.packetFooter4}></div>
            </div>
          </div>
        </div>
        <div className={styles.s8__mobile}>
          <div className={styles.routing}>
            <Lottie
              className={styles.s8__routingLottie}
              animationData={routingLottie}
              loop={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

export default Slide8;
