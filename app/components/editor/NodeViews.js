"use client";

import { NodeViewWrapper } from '@tiptap/react';
import { StatsRow, QuoteBlock, TechGrid, CaseCard, HighlightBox, Workflow } from './BlockComponents';

export function StatsBlockView({ node, updateAttributes }) {
  const items = node.attrs.items || [];

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    updateAttributes({ items: newItems });
  };

  const addItem = () => {
    updateAttributes({ items: [...items, { value: '0', label: 'Label' }] });
  };

  const removeItem = (index) => {
    updateAttributes({ items: items.filter((_, i) => i !== index) });
  };

  return (
    <NodeViewWrapper className="my-6 p-4 bg-white/[0.02] border border-white/[0.08] rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-white/40 uppercase tracking-wider">Stats Block</span>
        <button onClick={addItem} className="text-xs text-cyan hover:underline">+ Add Item</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((item, i) => (
          <div key={i} className="glass-card p-3 relative group">
            <button
              onClick={() => removeItem(i)}
              className="absolute top-1 right-1 text-white/30 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ×
            </button>
            <input
              value={item.value}
              onChange={(e) => updateItem(i, 'value', e.target.value)}
              className="w-full bg-transparent text-center text-xl font-bold text-cyan border-none focus:outline-none"
              placeholder="Value"
            />
            <input
              value={item.label}
              onChange={(e) => updateItem(i, 'label', e.target.value)}
              className="w-full bg-transparent text-center text-xs text-white/60 border-none focus:outline-none mt-1"
              placeholder="Label"
            />
          </div>
        ))}
      </div>
      <StatsRow items={items} />
    </NodeViewWrapper>
  );
}

export function QuoteBlockView({ node, updateAttributes }) {
  return (
    <NodeViewWrapper className="my-6">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs text-white/40 uppercase tracking-wider">Quote Block</span>
      </div>
      <QuoteBlock
        text={node.attrs.text}
        author={node.attrs.author}
      />
      <div className="mt-2 space-y-2">
        <input
          value={node.attrs.text}
          onChange={(e) => updateAttributes({ text: e.target.value })}
          className="w-full bg-white/[0.04] text-white/90 text-lg border border-white/[0.08] rounded p-2 focus:border-cyan focus:outline-none"
          placeholder="Quote text..."
        />
        <input
          value={node.attrs.author}
          onChange={(e) => updateAttributes({ author: e.target.value })}
          className="w-full bg-white/[0.04] text-white/60 text-sm border border-white/[0.08] rounded p-2 focus:border-cyan focus:outline-none"
          placeholder="Author (optional)"
        />
      </div>
    </NodeViewWrapper>
  );
}

export function TechGridBlockView({ node, updateAttributes }) {
  const items = node.attrs.items || [];

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    updateAttributes({ items: newItems });
  };

  const addItem = () => {
    updateAttributes({ items: [...items, { icon: '📦', title: 'New Feature', description: 'Description' }] });
  };

  const removeItem = (index) => {
    updateAttributes({ items: items.filter((_, i) => i !== index) });
  };

  return (
    <NodeViewWrapper className="my-6 p-4 bg-white/[0.02] border border-white/[0.08] rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-white/40 uppercase tracking-wider">Tech Grid Block</span>
        <button onClick={addItem} className="text-xs text-cyan hover:underline">+ Add Card</button>
      </div>
      <TechGrid items={items} />
      <div className="grid md:grid-cols-3 gap-4 mt-4">
        {items.map((item, i) => (
          <div key={i} className="glass-card p-3 relative group">
            <button
              onClick={() => removeItem(i)}
              className="absolute top-1 right-1 text-white/30 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ×
            </button>
            <input
              value={item.icon}
              onChange={(e) => updateItem(i, 'icon', e.target.value)}
              className="w-full bg-transparent text-center text-2xl border-none focus:outline-none mb-2"
              placeholder="Icon"
            />
            <input
              value={item.title}
              onChange={(e) => updateItem(i, 'title', e.target.value)}
              className="w-full bg-transparent text-center text-white text-sm font-semibold border-none focus:outline-none mb-1"
              placeholder="Title"
            />
            <input
              value={item.description}
              onChange={(e) => updateItem(i, 'description', e.target.value)}
              className="w-full bg-transparent text-center text-white/60 text-xs border-none focus:outline-none"
              placeholder="Description"
            />
          </div>
        ))}
      </div>
    </NodeViewWrapper>
  );
}

export function CaseStudyBlockView({ node, updateAttributes }) {
  return (
    <NodeViewWrapper className="my-6">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs text-white/40 uppercase tracking-wider">Case Study Block</span>
      </div>
      <CaseCard
        title={node.attrs.title}
        body={node.attrs.body}
        verdict={node.attrs.verdict}
        verdictLabel={node.attrs.verdictLabel}
      />
      <div className="space-y-3 mt-4">
        <input
          value={node.attrs.title}
          onChange={(e) => updateAttributes({ title: e.target.value })}
          className="w-full bg-white/[0.04] text-white text-lg font-bold border border-white/[0.08] rounded p-2 focus:border-cyan focus:outline-none"
          placeholder="Case Study Title"
        />
        <textarea
          value={node.attrs.body}
          onChange={(e) => updateAttributes({ body: e.target.value })}
          className="w-full bg-white/[0.04] text-white/70 text-sm border border-white/[0.08] rounded p-2 focus:border-cyan focus:outline-none resize-none h-20"
          placeholder="Case study body..."
        />
        <div className="flex gap-2">
          <input
            value={node.attrs.verdict}
            onChange={(e) => updateAttributes({ verdict: e.target.value })}
            className="flex-1 bg-white/[0.04] text-white text-sm border border-white/[0.08] rounded p-2 focus:border-cyan focus:outline-none"
            placeholder="Verdict (e.g., Success)"
          />
          <input
            value={node.attrs.verdictLabel}
            onChange={(e) => updateAttributes({ verdictLabel: e.target.value })}
            className="w-32 bg-white/[0.04] text-white/60 text-sm border border-white/[0.08] rounded p-2 focus:border-cyan focus:outline-none"
            placeholder="Verdict Label"
          />
        </div>
      </div>
    </NodeViewWrapper>
  );
}

export function HighlightBlockView({ node, updateAttributes }) {
  return (
    <NodeViewWrapper className="my-6">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs text-white/40 uppercase tracking-wider">Highlight Block</span>
        <select
          value={node.attrs.style}
          onChange={(e) => updateAttributes({ style: e.target.value })}
          className="bg-white/[0.04] text-white/60 text-xs border border-white/[0.08] rounded px-2 py-1"
        >
          <option value="info">Info</option>
          <option value="warning">Warning</option>
          <option value="success">Success</option>
        </select>
      </div>
      <HighlightBox content={node.attrs.content} style={node.attrs.style} />
      <textarea
        value={node.attrs.content}
        onChange={(e) => updateAttributes({ content: e.target.value })}
        className="w-full mt-2 bg-white/[0.04] text-white/90 border border-white/[0.08] rounded p-2 focus:border-cyan focus:outline-none resize-none h-16"
        placeholder="Highlight content..."
      />
    </NodeViewWrapper>
  );
}

export function WorkflowBlockView({ node, updateAttributes }) {
  const steps = node.attrs.steps || [];
  const layout = node.attrs.layout || 'horizontal';

  const updateStep = (index, value) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    updateAttributes({ steps: newSteps });
  };

  const addStep = () => {
    updateAttributes({ steps: [...steps, 'New Step'] });
  };

  const removeStep = (index) => {
    updateAttributes({ steps: steps.filter((_, i) => i !== index) });
  };

  return (
    <NodeViewWrapper className="my-6 p-4 bg-white/[0.02] border border-white/[0.08] rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-white/40 uppercase tracking-wider">Workflow Block</span>
        <div className="flex gap-2">
          <select
            value={layout}
            onChange={(e) => updateAttributes({ layout: e.target.value })}
            className="bg-white/[0.04] text-white/60 text-xs border border-white/[0.08] rounded px-2 py-1"
          >
            <option value="horizontal">Horizontal</option>
            <option value="vertical">Vertical</option>
          </select>
          <button onClick={addStep} className="text-xs text-cyan hover:underline">+ Add Step</button>
        </div>
      </div>
      <Workflow steps={steps} layout={layout} />
      <div className="flex flex-wrap gap-2 mt-4">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-1">
            <input
              value={step}
              onChange={(e) => updateStep(i, e.target.value)}
              className="bg-white/[0.04] text-white text-sm border border-white/[0.08] rounded px-3 py-1 focus:border-cyan focus:outline-none"
              placeholder={`Step ${i + 1}`}
            />
            <button
              onClick={() => removeStep(i)}
              className="text-white/30 hover:text-red-400"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </NodeViewWrapper>
  );
}
