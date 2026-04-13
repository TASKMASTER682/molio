import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import React from 'react';
import {
  StatsBlockView,
  QuoteBlockView,
  TechGridBlockView,
  CaseStudyBlockView,
  HighlightBlockView,
  WorkflowBlockView,
} from './blocks/BlockComponents';

function createBlockNode(name, defaultAttrs = {}, Component) {
  const attrDefaults = Object.keys(defaultAttrs).reduce((acc, key) => {
    acc[key] = { default: defaultAttrs[key] };
    return acc;
  }, {});

  const NodeViewComponent = ({ node, getPos, editor }) => {
    const attrs = node.attrs;
    const mergedAttrs = { ...defaultAttrs, ...attrs };

    const handleRemove = () => {
      const position = getPos();
      if (position !== undefined) {
        editor.chain().focus().deleteRange({ from: position, to: position + node.nodeSize }).run();
      }
    };

    return (
      <NodeViewWrapper className={`custom-block custom-block-${name}`}>
        <div className="block-container">
          <button
            className="block-remove-btn"
            onClick={handleRemove}
            title="Remove block"
            type="button"
          >
            ×
          </button>
          <Component {...mergedAttrs} />
        </div>
      </NodeViewWrapper>
    );
  };

  return Node.create({
    name,
    group: 'block',
    atom: true,
    draggable: true,
    addAttributes() {
      return attrDefaults;
    },
    parseHTML() {
      return [
        { tag: name },
        { tag: `div[data-type="${name}"]` },
      ];
    },
    renderHTML({ HTMLAttributes }) {
      return ['div', {
        'data-type': name,
        'data-attrs': JSON.stringify(HTMLAttributes),
        class: `custom-block custom-block-${name}`,
      }];
    },
    addNodeView() {
      return ReactNodeViewRenderer(NodeViewComponent);
    },
  });
}

export const StatsBlockExtension = createBlockNode(
  'statsBlock',
  {
    items: [
      { value: '$20k', label: 'Cost per drone', description: 'Per unit' },
      { value: '$4M', label: 'Intercept cost', description: 'Total program' },
      { value: '95%', label: 'Success rate', description: 'In tests' },
      { value: '12%', label: 'Growth rate', description: 'Year over year' },
      { value: '8x', label: 'ROI', description: 'Return on investment' },
      { value: '4.7/5', label: 'User rating', description: 'Average satisfaction' },
    ],
  },
  StatsBlockView
);

export const QuoteBlockExtension = createBlockNode(
  'quoteBlock',
  {
    text: 'This is a pull quote that highlights important content with a left border.',
    author: 'Author Name',
    style: 'default',
  },
  QuoteBlockView
);

export const TechGridBlockExtension = createBlockNode(
  'techGridBlock',
  {
    items: [
      { icon: '🚀', title: 'Fast Performance', description: 'Lightning fast load times' },
      { icon: '🔒', title: 'Secure', description: 'Enterprise-grade security' },
      { icon: '📱', title: 'Responsive', description: 'Works on all devices' },
    ],
  },
  TechGridBlockView
);

export const CaseStudyBlockExtension = createBlockNode(
  'caseStudyBlock',
  {
    title: 'Case Study Title',
    body: 'The main body content of the case study goes here.',
    verdict: 'Success',
    verdictLabel: 'Verdict',
  },
  CaseStudyBlockView
);

export const HighlightBlockExtension = createBlockNode(
  'highlightBlock',
  {
    content: 'This is important content that needs to be highlighted.',
    style: 'info',
  },
  HighlightBlockView
);

export const WorkflowBlockExtension = createBlockNode(
  'workflowBlock',
  {
    steps: ['Research', 'Write', 'Publish'],
    layout: 'horizontal',
  },
  WorkflowBlockView
);

export const customBlockExtensions = [
  StatsBlockExtension,
  QuoteBlockExtension,
  TechGridBlockExtension,
  CaseStudyBlockExtension,
  HighlightBlockExtension,
  WorkflowBlockExtension,
];

export function insertStatsBlock(editor) {
  editor.chain().focus().insertContent({ type: 'statsBlock' }).run();
}

export function insertQuoteBlock(editor) {
  editor.chain().focus().insertContent({ type: 'quoteBlock' }).run();
}

export function insertTechGridBlock(editor) {
  editor.chain().focus().insertContent({ type: 'techGridBlock' }).run();
}

export function insertCaseStudyBlock(editor) {
  editor.chain().focus().insertContent({ type: 'caseStudyBlock' }).run();
}

export function insertHighlightBlock(editor) {
  editor.chain().focus().insertContent({ type: 'highlightBlock' }).run();
}

export function insertWorkflowBlock(editor) {
  editor.chain().focus().insertContent({ type: 'workflowBlock' }).run();
}
