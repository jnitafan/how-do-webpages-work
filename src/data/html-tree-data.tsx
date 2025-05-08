import React from "react";

export const treeData = [
  {
    id: 1,
    html: (
      <>
        <span className="hljs-meta">
          &lt;!DOCTYPE <span className="hljs-keyword">html</span>&gt;
        </span>
      </>
    ),
    relatedDom: (
      <>
        <p>banana2</p>
      </>
    ),
    children: [],
  },
  {
    id: 1,
    html: (
      <>
        <p>banana</p>
      </>
    ),
    relatedDom: (
      <>
        <p>banana2</p>
      </>
    ),
    children: [],
  }
]