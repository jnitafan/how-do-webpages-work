// components/slides/Slide9.tsx
"use client";

import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
  useRef,
} from "react";
// Prism for syntax highlighting
import Prism from "prismjs";
// load the CSS theme you like:
import "prismjs/themes/prism-tomorrow.css";
// load the languages we need
import "prismjs/components/prism-markup.js"; // HTML/XML
import "prismjs/components/prism-json.js";
import styles from "./slides.module.scss";
import placeholderHTML from "@/data/placeholder";
import { motion } from "framer-motion";

const HIGHLIGHTCOLOR = "#00a8db";

// ———————————————————————————————————————————————
// 1) Helpers to compute paths & descendants
const findPath = (id, nodes, path = []) => {
  for (const node of nodes) {
    const cp = [...path, node.id];
    if (node.id === id) return cp;
    if (node.domChildren) {
      const res = findPath(id, node.domChildren, cp);
      if (res) return res;
    }
  }
  return null;
};

const getDescendantIds = (node) =>
  (node.htmlChildren || []).reduce(
    (acc, c) => acc.concat(c.id, getDescendantIds(c)),
    []
  );

const getRelatedIds = (activeId, tree) => {
  if (!activeId) return [];
  const path = findPath(activeId, tree);
  if (!path) return [];
  const findNodeByPath = (nodes, path) => {
    const [head, ...rest] = path;
    const node = nodes.find((n) => n.id === head);
    if (!node) return null;
    return rest.length ? findNodeByPath(node.children || [], rest) : node;
  };
  const activeNode = findNodeByPath(tree, path);
  const descendantIds = activeNode ? getDescendantIds(activeNode) : [];
  return [...path, ...descendantIds];
};

const getPathIds = (activeId, tree) => findPath(activeId, tree) || [];

// ———————————————————————————————————————————————
// 2) Convert a React element into a node tree with separate htmlChildren & domChildren
let idCounter = 0;

function serializeProps(props = {}) {
  return Object.entries(props)
    .filter(([k]) => k !== "children" && k !== "className")
    .map(([k, v]) => {
      const val =
        typeof v === "string" ? v.replace(/"/g, "&quot;") : JSON.stringify(v);
      return ` ${k}="${val}"`;
    })
    .join("");
}

function elementToNode(element, parentTag = null) {
  const id = `node_${idCounter++}`;
  const tagName =
    typeof element.type === "string"
      ? element.type.toLowerCase()
      : (
          element.type.displayName ||
          element.type.name ||
          "component"
        ).toLowerCase();

  // opening & closing strings
  const classList = (element.props.className || "")
    .toString()
    .split(/\s+/)
    .filter(Boolean);
  const htmlOpen = `<${tagName}${serializeProps(element.props)}${
    classList.length ? ` class="${classList.join(" ")}"` : ""
  }>`;
  const closer = `</${tagName}>`;

  // raw children array (elements + text)
  const rawChildren = React.Children.toArray(element.props.children);

  //  • htmlChildren: convert everything (strings → text nodes + elementToNode)
  const htmlChildren = rawChildren.map((child) => {
    if (typeof child === "string" || typeof child === "number") {
      const textId = `node_${idCounter++}`;
      return {
        id: textId,
        html: child.toString(),
        closer: "",
        relatedMeta: {
          nodeName: "#text",
          children: [],
          innerText: child.toString().trim(),
          parentNode: tagName.toUpperCase(),
          classList: [],
        },
        htmlChildren: [],
        domChildren: [],
      };
    }
    return elementToNode(child, tagName.toUpperCase());
  });

  //  • domChildren: filter only real elements
  const domChildren = htmlChildren.filter(
    (n) => n.relatedMeta.nodeName !== "#text"
  );

  // related-DOM metadata
  const relatedMeta = {
    nodeName: tagName.toUpperCase(),
    children: domChildren.map((c) => c.relatedMeta.nodeName),
    innerText: htmlChildren
      .filter((c) => c.relatedMeta.nodeName === "#text")
      .map((c) => c.relatedMeta.innerText)
      .join(" ")
      .trim(),
    parentNode: parentTag,
    classList,
  };

  return { id, html: htmlOpen, closer, relatedMeta, htmlChildren, domChildren };
}

// ———————————————————————————————————————————————
// 3) Renderers

// Pseudo-HTML view (uses htmlChildren)
const RenderNode = ({
  node,
  activeIds,
  setActiveItem,
  visibleIds,
  level = 0,
}) => {
  const isActive = activeIds.includes(node.id);
  const openHighlighted = Prism.highlight(
    node.html,
    Prism.languages.markup,
    "markup"
  );
  const closeHighlighted = node.closer
    ? Prism.highlight(node.closer, Prism.languages.markup, "markup")
    : "";

  return (
    <motion.div
      onPointerEnter={() => setActiveItem(node)}
      onPointerLeave={() => setActiveItem(null)}
      onTouchStart={() => setActiveItem(node)}
      onTouchEnd={() => setActiveItem(null)}
      initial={{ opacity: 0 }}
      animate={{ opacity: visibleIds.includes(node.id) ? 1 : 0 }}
      transition={{ duration: 0.4 }}
      style={{ marginLeft: level * 5 }}
    >
      <motion.span
        onPointerEnter={() => setActiveItem(node)}
        onPointerLeave={() => setActiveItem(null)}
        onTouchStart={() => setActiveItem(node)}
        onTouchEnd={() => setActiveItem(null)}
        animate={{ backgroundColor: isActive ? HIGHLIGHTCOLOR : "transparent" }}
        transition={{ duration: 0.2 }}
        style={{
          cursor: "pointer",
          display: "inline-block",
          padding: "2px 4px",
        }}
        dangerouslySetInnerHTML={{ __html: openHighlighted }}
      />
      {node.htmlChildren.map((child) => (
        <RenderNode
          key={child.id}
          node={child}
          activeIds={activeIds}
          setActiveItem={setActiveItem}
          visibleIds={visibleIds}
          level={level + 1}
        />
      ))}
      {node.closer && (
        <motion.span
          onPointerEnter={() => setActiveItem(node)}
          onPointerLeave={() => setActiveItem(null)}
          onTouchStart={() => setActiveItem(node)}
          onTouchEnd={() => setActiveItem(null)}
          animate={{
            backgroundColor: isActive ? HIGHLIGHTCOLOR : "transparent",
          }}
          transition={{ duration: 0.2 }}
          style={{
            cursor: "pointer",
            display: "inline-block",
            padding: "2px 4px",
          }}
          dangerouslySetInnerHTML={{ __html: closeHighlighted }}
        />
      )}
    </motion.div>
  );
};

// Pseudo-DOM JSON view (uses domChildren)
const RenderRelatedNode = ({
  node,
  activeIds,
  visibleIds,
  level = 0,
  nodeRefs,
}) => {
  const isActive = activeIds.includes(node.id);
  const pretty = JSON.stringify(node.relatedMeta, null, 2);
  const highlightedJSON = Prism.highlight(pretty, Prism.languages.json, "json");

  return (
    <motion.div
      ref={(el) => {
        if (el) nodeRefs.current[node.id] = el;
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: visibleIds.includes(node.id) ? 1 : 0 }}
      transition={{ duration: 0.4 }}
      style={{
        fontFamily: "monospace",
        whiteSpace: "pre",
      }}
    >
      <div
        style={{
          backgroundColor: isActive ? HIGHLIGHTCOLOR : "transparent",
          padding: "4px",
        }}
        dangerouslySetInnerHTML={{ __html: highlightedJSON }}
      />
      {node.domChildren.map((child) => (
        <RenderRelatedNode
          key={child.id}
          node={child}
          activeIds={activeIds}
          visibleIds={visibleIds}
          level={level + 1}
          nodeRefs={nodeRefs}
        />
      ))}
    </motion.div>
  );
};

// ———————————————————————————————————————————————
// 4) Main component

function HighlightReactTree({ element }) {
  const [treeData, setTreeData] = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  const [visibleIds, setVisibleIds] = useState([]);
  const relatedNodeRefs = useRef({});

  // Build once
  useEffect(() => {
    idCounter = 0;
    setTreeData([elementToNode(element, null)]);
    setVisibleIds([]);
  }, [element]);

  // Staggered reveal
  useEffect(() => {
    if (!treeData.length) return;
    const all = [];
    const gather = (nodes) => {
      nodes.forEach((n) => {
        all.push(n);
        // recurse into htmlChildren so text nodes get included
        if (n.htmlChildren && n.htmlChildren.length) {
          gather(n.htmlChildren);
        }
      });
    };
    gather(treeData);
    setVisibleIds([]);
    all.forEach((n, i) =>
      setTimeout(() => setVisibleIds((v) => [...v, n.id]), i * 400)
    );
  }, [treeData]);

  // Auto-scroll
  useEffect(() => {
    if (!activeItem) return;
    const el = relatedNodeRefs.current[activeItem.id];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [activeItem]);

  const pseudoActiveIds = activeItem
    ? getRelatedIds(activeItem.id, treeData)
    : [];
  const relatedActiveIds = activeItem
    ? getPathIds(activeItem.id, treeData)
    : [];

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Pseudo-HTML */}
      <div style={{ flex: 1, overflowY: "auto", padding: "1rem" }}>
        {treeData.map((n) => (
          <RenderNode
            key={n.id}
            node={n}
            activeIds={pseudoActiveIds}
            setActiveItem={setActiveItem}
            visibleIds={visibleIds}
          />
        ))}
      </div>

      {/* Pseudo-DOM JSON */}
      <div style={{ flex: 1, overflowY: "auto", padding: "1rem" }}>
        {treeData.map((n) => (
          <RenderRelatedNode
            key={n.id}
            node={n}
            activeIds={relatedActiveIds}
            visibleIds={visibleIds}
            nodeRefs={relatedNodeRefs}
          />
        ))}
      </div>
    </div>
  );
}

const Slide9 = forwardRef((_, ref) => {
  useImperativeHandle(ref, () => ({
    entryAnimation: () => {},
    exitAnimation: () => Promise.resolve(),
  }));

  return (
    <div className={styles.slide}>
      <HighlightReactTree element={placeholderHTML()} />
    </div>
  );
});

export default Slide9;
