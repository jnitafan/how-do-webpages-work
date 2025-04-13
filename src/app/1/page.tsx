"use client";

// timeline.tsx
import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  SpringOptions,
  MotionValue,
} from "framer-motion";
import styles from "./page.module.scss";

interface timelineItem {
  year: string;
  image: {
    src: string;
    alt: string;
    start: number;
    end: number;
  };
  text: string;
}

interface timelineItemProps {
  item: timelineItem;
  index: number;
  scroll: MotionValue<number>;
  height: number;
}

const springOptions: SpringOptions = {
  stiffness: 362,
  damping: 26,
  mass: 0.1,
};

const TimelineItem: React.FC<timelineItemProps> = ({
  item,
  index,
  scroll,
  height,
}) => {
  const yPos = useSpring(
    useTransform(
      scroll,
      [0, height],
      [item.image.start * height, item.image.end * height]
    ),
    springOptions
  );

  return (
    <>
      <motion.div
        key={index}
        className={`${styles.event} ${
          index % 2 === 0 ? styles.left : styles.right
        }`}
        initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className={styles.year}>{item.year}</div>
        <div className={styles.text}>{item.text}</div>
      </motion.div>
      <motion.img
        src={item.image.src}
        alt={item.image.alt}
        style={{ y: yPos }}
        className={styles.parallaxImageLeft}
      />
    </>
  );
};

const timelineUrl = "/timeline-data.json";

const Timeline: React.FC = () => {
  const [tData, setTData] = useState<timelineItem[]>([]);
  const [scrollContainerheight, setScrollContainerHeight] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ container: scrollContainerRef });

  useEffect(() => {
    if (scrollContainerRef.current !== null) {
      setScrollContainerHeight(scrollContainerRef.current.scrollHeight);
    }
  });
  useEffect(() => {
    // Define an async function to fetch the JSON data.
    async function fetchTimelineData() {
      try {
        const response = await fetch(timelineUrl); // update the path accordingly
        const json = await response.json();
        // Assuming your JSON has a shape like { data: TimelineItem[] }
        setTData(json.data);
      } catch (error) {
        console.error("Error fetching timeline data.", error);
      }
    }
    fetchTimelineData();
  }, []);

  return (
    <div ref={scrollContainerRef} className={styles.timelineContainer}>
      <div className={styles.timeline}>
        <div className={styles.line} />
        {tData.map((item, index) => (
          <TimelineItem
            key={index}
            item={item}
            index={index}
            scroll={scrollY}
            height={scrollContainerheight}
          />
        ))}
      </div>
    </div>
  );
};

export default Timeline;
