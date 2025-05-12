// components/slides/Slide11.tsx
"use client";

import React, {
  forwardRef,
  useImperativeHandle,
  ReactNode,
} from "react";
import { motion, Variants } from "framer-motion";
import placeholderHTML from "@/data/placeholder";
import styles from "./slides.module.scss";

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.5,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5 } },
};

const Slide11 = forwardRef((_, ref) => {
  useImperativeHandle(ref, () => ({
    entryAnimation: () => {},
    exitAnimation: () => Promise.resolve(),
  }));

  // cast to ReactElement so TS knows .props.children exists
  const htmlTree = placeholderHTML() as unknown as React.ReactElement<{
    children?: ReactNode;
  }>;

  // extract <body> content
  let bodyContent: ReactNode = null;
  if (React.isValidElement(htmlTree)) {
    const childrenArray = React.Children.toArray(htmlTree.props.children);
    const bodyElement = childrenArray.find(
      (child): child is React.ReactElement<{ children?: ReactNode }> =>
        React.isValidElement(child) && child.type === "body"
    );
    if (bodyElement) {
      bodyContent = bodyElement.props.children;
    }
  }

  return (
    <div className={styles.slide}>
      <motion.div
        className="skeleton"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {React.Children.map(bodyContent, (child, i) => (
          <motion.div key={i} variants={itemVariants}>
            {child}
          </motion.div>
        ))}

        <style jsx global>{`
          .skeleton * {
            color: transparent !important;
            background-color: #000 !important;
            border: 1px double #fff !important;
            margin: 10px;
          }
          .skeleton img {
            filter: brightness(0) !important;
          }
        `}</style>
      </motion.div>
    </div>
  );
});

export default Slide11;
