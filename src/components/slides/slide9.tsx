// components/slides/Slide9.tsx
"use client";

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { motion } from "framer-motion";
import { animate } from "framer-motion/dom";
import { treeData } from "@/data/html-tree-data";
import styles from "./slides.module.scss";

// --------------------------------------------------------------------
// Helper functions for traversing the tree

// Recursively searches for a node with the given id and returns an array
// representing the path (list of IDs) from the root to that node.
const findPath = (id, nodes, path = []) => {
  for (let node of nodes) {
    const currentPath = [...path, node.id];
    if (node.id === id) {
      return currentPath;
    }
    if (node.children && node.children.length > 0) {
      const result = findPath(id, node.children, currentPath);
      if (result) return result;
    }
  }
  return null;
};

// Recursively collects all descendant IDs for a given node.
const getDescendantIds = (node) => {
  let ids = [];
  if (node.children && node.children.length > 0) {
    node.children.forEach((child) => {
      ids.push(child.id);
      ids = ids.concat(getDescendantIds(child));
    });
  }
  return ids;
};

// Returns an array including the active node's ID, its ancestors (the path),
// and all its descendant IDs.
const getRelatedIds = (activeId, tree) => {
  if (!activeId) return [];
  const path = findPath(activeId, tree);
  if (!path) return [];
  // Retrieve the active node from the computed path.
  const findNodeByPath = (nodes, path) => {
    if (!path || path.length === 0) return null;
    const currentId = path[0];
    const node = nodes.find((n) => n.id === currentId);
    if (!node) return null;
    if (path.length === 1) return node;
    return findNodeByPath(node.children || [], path.slice(1));
  };
  const activeNode = findNodeByPath(tree, path);
  const descendantIds = activeNode ? getDescendantIds(activeNode) : [];
  return [...path, ...descendantIds];
};

// Returns only the path (active node and its ancestors) from the root.
const getPathIds = (activeId, tree) => {
  if (!activeId) return [];
  const path = findPath(activeId, tree);
  return path || [];
};

// --------------------------------------------------------------------
// Recursive component to render each node (for the pseudo HTML view).
// It renders the opening tag (node.html), then any children, and finally the closing tag if available.
// The entire node container is animated from 0 opacity to full opacity when revealed.
const RenderNode = ({
  node,
  activeIds,
  setActiveItem,
  visibleIds,
  level = 0,
}) => {
  const isActive = activeIds.includes(node.id);
  const containerStyle = { marginLeft: level * 20 };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: visibleIds.includes(node.id) ? 1 : 0 }}
      transition={{ duration: 0.5 }}
      style={containerStyle}
    >
      <motion.span
        onMouseEnter={() => setActiveItem(node)}
        onMouseLeave={() => setActiveItem(null)}
        animate={{ backgroundColor: isActive ? "yellow" : "transparent" }}
        transition={{ duration: 0.3 }}
        style={{ display: "inline-block", cursor: "pointer", padding: "5px" }}
      >
        {node.html}
      </motion.span>
      {node.children && node.children.length > 0 && (
        <div>
          {node.children.map((child) => (
            <RenderNode
              key={child.id}
              node={child}
              activeIds={activeIds}
              setActiveItem={setActiveItem}
              visibleIds={visibleIds}
              level={level + 1}
            />
          ))}
        </div>
      )}
      {node.closer && (
        <motion.span
          onMouseEnter={() => setActiveItem(node)}
          onMouseLeave={() => setActiveItem(null)}
          animate={{ backgroundColor: isActive ? "yellow" : "transparent" }}
          transition={{ duration: 0.3 }}
          style={{ display: "inline-block", cursor: "pointer", padding: "5px" }}
        >
          {node.closer}
        </motion.span>
      )}
    </motion.div>
  );
};

// Recursive component to render the corresponding related DOM structure.
// Here, only the active node and its ancestors (the path) are highlighted.
// Each node animates its opacity from 0 to 1 when it is revealed.
const RenderRelatedNode = ({ node, activeIds, visibleIds, level = 0 }) => {
  const isActive = activeIds.includes(node.id);
  const containerStyle = { marginLeft: level * 20 };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: visibleIds.includes(node.id) ? 1 : 0 }}
      transition={{ duration: 0.5 }}
      style={containerStyle}
    >
      <div
        style={{
          padding: "5px",
          backgroundColor: isActive ? "yellow" : "transparent",
        }}
      >
        {node.relatedDom}
      </div>
      {node.children && node.children.length > 0 && (
        <div>
          {node.children.map((child) => (
            <RenderRelatedNode
              key={child.id}
              node={child}
              activeIds={activeIds}
              visibleIds={visibleIds}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

// --------------------------------------------------------------------
// Main component using the updated tree structure.
const HighlightComponent = () => {
  const [activeItem, setActiveItem] = useState(null);
  const [visibleIds, setVisibleIds] = useState([]);

  // For the pseudo HTML view, we highlight the active node, its ancestors, and descendants.
  const pseudoActiveIds = activeItem
    ? getRelatedIds(activeItem.id, treeData)
    : [];
  // For the related DOM view, we highlight only the active node and its ancestors.
  const relatedActiveIds = activeItem
    ? getPathIds(activeItem.id, treeData)
    : [];

  useEffect(() => {
    // Sequentially reveal all nodes using a depth-first traversal.
    const allNodes = [];
    const traverse = (nodes) => {
      nodes.forEach((node) => {
        allNodes.push(node);
        if (node.children && node.children.length > 0) {
          traverse(node.children);
        }
      });
    };
    traverse(treeData);
    allNodes.forEach((node, index) => {
      setTimeout(() => {
        setVisibleIds((prev) => [...prev, node.id]);
      }, index * 700);
    });
  }, []);

  return (
    <div className={styles.s9__highlight}>
      <div className={styles.s9__html}>
        <pre>
          <code className="language-xml">
            {/* Render the nested pseudo HTML structure recursively */}
            {treeData.map((node) => (
              <RenderNode
                key={node.id}
                node={node}
                activeIds={pseudoActiveIds}
                setActiveItem={setActiveItem}
                visibleIds={visibleIds}
              />
            ))}
          </code>
        </pre>
      </div>
      <div className={styles.s9_js}>
        <pre>
          <code className="language-javascript">
            {/* Render the corresponding related DOM structure recursively */}
            {treeData.map((node) => (
              <RenderRelatedNode
                key={node.id}
                node={node}
                activeIds={relatedActiveIds}
                visibleIds={visibleIds}
              />
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
};

const Slide9 = forwardRef((_, ref) => {
  useImperativeHandle(ref, () => ({
    entryAnimation: () => { },
    exitAnimation: () => Promise.resolve(),
  }));

  return (
    <div className={styles.slide}>
      <HighlightComponent />
    </div>
  );
});

export default Slide9;
