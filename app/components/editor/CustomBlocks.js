import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';

import { StatsBlockView, QuoteBlockView, TechGridBlockView, CaseStudyBlockView, HighlightBlockView, WorkflowBlockView } from './NodeViews';

function createBlockExtension(name, defaultAttrs = {}, NodeViewComponent) {
  return Node.create({
    name,
    group: 'block',
    atom: true,
    draggable: true,
    addAttributes() {
      return Object.keys(defaultAttrs).reduce((acc, key) => {
        acc[key] = { default: defaultAttrs[key] };
        return acc;
      }, {});
    },
    parseHTML() {
      return [{ tag: `[data-type="${name}"]` }];
    },
    renderHTML({ HTMLAttributes }) {
      return [name, mergeAttributes(HTMLAttributes, { 'data-type': name })];
    },
    addNodeView() {
      return ReactNodeViewRenderer(NodeViewComponent);
    },
  });
}

export const StatsBlock = createBlockExtension('statsBlock', {
  items: [
    { value: '$20k', label: 'Cost per drone' },
    { value: '$4M', label: 'Intercept cost' },
    { value: '95%', label: 'Success rate' },
  ],
}, StatsBlockView);

export const QuoteBlock = createBlockExtension('quoteBlock', {
  text: 'This is a pull quote that highlights important content with a left border.',
  author: 'Author Name',
}, QuoteBlockView);

export const TechGridBlock = createBlockExtension('techGridBlock', {
  items: [
    { icon: '🚀', title: 'Fast Performance', description: 'Lightning fast load times' },
    { icon: '🔒', title: 'Secure', description: 'Enterprise-grade security' },
    { icon: '📱', title: 'Responsive', description: 'Works on all devices' },
  ],
}, TechGridBlockView);

export const CaseStudyBlock = createBlockExtension('caseStudyBlock', {
  title: 'Case Study Title',
  body: 'The main body content of the case study goes here. Describe the problem, solution, and results.',
  verdict: 'Success',
  verdictLabel: 'Verdict',
}, CaseStudyBlockView);

export const HighlightBlock = createBlockExtension('highlightBlock', {
  content: 'This is important content that needs to be highlighted for reader attention.',
  style: 'info',
}, HighlightBlockView);

export const WorkflowBlock = createBlockExtension('workflowBlock', {
  steps: ['Research', 'Write', 'Publish'],
  layout: 'horizontal',
}, WorkflowBlockView);

export const customBlockTypes = [
  'statsBlock',
  'quoteBlock',
  'techGridBlock',
  'caseStudyBlock',
  'highlightBlock',
  'workflowBlock',
];

export function getCustomBlockExtensions() {
  return [
    StatsBlock,
    QuoteBlock,
    TechGridBlock,
    CaseStudyBlock,
    HighlightBlock,
    WorkflowBlock,
  ];
}
