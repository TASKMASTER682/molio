import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import React from 'react';

function createNodeView(name, Component) {
  return Node.create({
    name,
    group: 'block',
    atom: true,
    draggable: true,
    addAttributes() {
      return {
        items: { default: [] },
        text: { default: '' },
        author: { default: '' },
        title: { default: '' },
        body: { default: '' },
        verdict: { default: '' },
        verdictLabel: { default: 'Verdict' },
        content: { default: '' },
        style: { default: 'info' },
        steps: { default: [] },
        layout: { default: 'horizontal' },
        icon: { default: '' },
        description: { default: '' },
      };
    },
    parseHTML() {
      return [{ tag: `[data-type="${name}"]` }];
    },
    renderHTML({ HTMLAttributes }) {
      return [name, mergeAttributes(HTMLAttributes, { 'data-type': name })];
    },
    addNodeView() {
      return ReactNodeViewRenderer((props) => {
        const { node } = props;
        const attrs = node.attrs;
        return <Component {...attrs} />;
      });
    },
  });
}

export function createAllNodeViews() {
  return [];
}

export { createNodeView };
