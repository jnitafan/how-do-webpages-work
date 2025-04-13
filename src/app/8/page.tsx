"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// --------------------------------------------------------------------
// Tree data structure using the "closer" key for elements with children.
const treeData = [
  {
    id: 1,
    html: <span className="hljs-meta">&lt;!DOCTYPE html&gt;</span>,
    relatedDom: {
      tagName: "HTML",
      attributes: {},
      className: "",
      id: "",
      textContent:
        'Title\n\n body {\n width: 500px;\n }\n\n\n Title\n \n \n\n\n let all = document.getElementsByTagName("*");\n let banana = document.getElementById("banana");\n let allBanana = [];\n for (let i = 0, max = all.length; i < max; i++) {\n let elementData = {};\n Object.defineProperties(elementData, {\n tagName: { value: all[i].tagName, enumerable: true },\n attributes: { value: all[i].attributes, enumerable: true },\n className: { value: all[i].className, enumerable: true },\n id: { value: all[i].id, enumerable: true },\n textContent: { value: all[i].textContent, enumerable: true },\n childNodes: { value: all[i].childNodes, enumerable: true },\n children: { value: all[i].children, enumerable: true },\n });\n allBanana.push(elementData);\n }\n banana.textContent = JSON.stringify(allBanana, null, 4);\n',
      childNodes: { "0": {}, "1": {} },
      children: { "0": {}, "1": {} },
    },
    children: [],
  },
  {
    id: 2,
    html: (
      <>
        <span className="hljs-tag">&lt;title&gt;</span>
        Title
        <span className="hljs-tag">&lt;/title&gt;</span>
      </>
    ),
    relatedDom: {
      tagName: "TITLE",
      attributes: {},
      className: "",
      id: "",
      textContent: "Title",
      childNodes: { "0": {} },
      children: {},
    },
    children: [],
  },
  {
    id: 3,
    html: (
      <>
        <span className="hljs-tag">&lt;style&gt;</span>
        body {"{"} width: 500px; {"}"}
        <span className="hljs-tag">&lt;/style&gt;</span>
      </>
    ),
    relatedDom: {
      tagName: "STYLE",
      attributes: {},
      className: "",
      id: "",
      textContent: "\n body {\n width: 500px;\n }\n",
      childNodes: { "0": {} },
      children: {},
    },
    children: [],
  },
  {
    id: 4,
    html: (
      <>
        <span className="hljs-tag">
          &lt;script type="application/javascript"&gt;
        </span>
        <span className="language-javascript">
          <span className="hljs-keyword">function</span> $init() {"{"} return
          true; {"}"}
        </span>
        <span className="hljs-tag">&lt;/script&gt;</span>
      </>
    ),
    relatedDom: {
      tagName: "SCRIPT",
      attributes: { "0": {} },
      className: "",
      id: "",
      textContent:
        '\n let all = document.getElementsByTagName("*");\n let banana = document.getElementById("banana");\n let allBanana = [];\n for (let i = 0, max = all.length; i < max; i++) {\n let elementData = {};\n Object.defineProperties(elementData, {\n tagName: { value: all[i].tagName, enumerable: true },\n attributes: { value: all[i].attributes, enumerable: true },\n className: { value: all[i].className, enumerable: true },\n id: { value: all[i].id, enumerable: true },\n textContent: { value: all[i].textContent, enumerable: true },\n childNodes: { value: all[i].childNodes, enumerable: true },\n children: { value: all[i].children, enumerable: true },\n });\n allBanana.push(elementData);\n }\n banana.textContent = JSON.stringify(allBanana, null, 4);\n',
      childNodes: { "0": {} },
      children: {},
    },
    children: [],
  },
  {
    // The <body> element: opening tag in "html" and closing tag in "closer"
    id: 5,
    html: (
      <>
        <span className="hljs-tag">&lt;body&gt;</span>
      </>
    ),
    closer: (
      <>
        <span className="hljs-tag">&lt;/body&gt;</span>
      </>
    ),
    relatedDom: {
      tagName: "BODY",
      attributes: {},
      className: "",
      id: "",
      textContent:
        '\n Title\n \n \n\n\n let all = document.getElementsByTagName("*");\n let banana = document.getElementById("banana");\n let allBanana = [];\n for (let i = 0, max = all.length; i < max; i++) {\n let elementData = {};\n Object.defineProperties(elementData, {\n tagName: { value: all[i].tagName, enumerable: true },\n attributes: { value: all[i].attributes, enumerable: true },\n className: { value: all[i].className, enumerable: true },\n id: { value: all[i].id, enumerable: true },\n textContent: { value: all[i].textContent, enumerable: true },\n childNodes: { value: all[i].childNodes, enumerable: true },\n children: { value: all[i].children, enumerable: true },\n });\n allBanana.push(elementData);\n }\n banana.textContent = JSON.stringify(allBanana, null, 4);\n',
      childNodes: {
        "0": {},
        "1": {},
        "2": {},
        "3": {},
        "4": {},
        "5": {},
        "6": {},
        "7": {},
      },
      children: { "0": {}, "1": {}, "2": {} },
    },
    children: [
      {
        // <p> element as a self-contained tag.
        id: 6,
        html: (
          <>
            <span className="hljs-tag">&lt;p</span>{" "}
            <span className="hljs-attr">checked</span>{" "}
            <span className="hljs-attr">class</span>=
            <span className="hljs-string">"title"</span>{" "}
            <span className="hljs-attr">id</span>=
            <span className="hljs-string">'title'</span>
            <span className="hljs-tag">&gt;</span>
            Title
            <span className="hljs-tag">&lt;/p&gt;</span>
          </>
        ),
        relatedDom: {
          tagName: "P",
          attributes: { "0": {}, "1": {}, "2": {} },
          className: "title",
          id: "title",
          textContent: "Title",
          childNodes: { "0": {} },
          children: {},
        },
        children: [],
      },
      {
        id: 7,
        html: (
          <>
            <span className="hljs-comment">
              &lt;!-- here goes the rest of the page --&gt;
            </span>
          </>
        ),
        relatedDom: "",
        children: [],
      },
    ],
  },
];

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
        {JSON.stringify(node.relatedDom, null, 4)}
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
    <div>
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
  );
};

export default HighlightComponent;
