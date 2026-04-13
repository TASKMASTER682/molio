"use client";

import { useState, useEffect } from "react";

export function BlockEditorModal({ isOpen, onClose, blockType, onInsert }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setData(null);
    }
  }, [isOpen, blockType]);

  if (!isOpen || !blockType) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onInsert(blockType, data);
    onClose();
  };

  const renderFields = () => {
    switch (blockType) {
      case "statsBlock":
        return (
          <StatsEditor data={data} onChange={setData} />
        );
      case "quoteBlock":
        return (
          <QuoteEditor data={data} onChange={setData} />
        );
      case "techGridBlock":
        return (
          <TechGridEditor data={data} onChange={setData} />
        );
      case "caseStudyBlock":
        return (
          <CaseStudyEditor data={data} onChange={setData} />
        );
      case "highlightBlock":
        return (
          <HighlightEditor data={data} onChange={setData} />
        );
      case "workflowBlock":
        return (
          <WorkflowEditor data={data} onChange={setData} />
        );
      default:
        return null;
    }
  };

  const blockLabels = {
    statsBlock: "Stats Row",
    quoteBlock: "Pull Quote",
    techGridBlock: "Tech Grid",
    caseStudyBlock: "Case Study",
    highlightBlock: "Highlight Box",
    workflowBlock: "Workflow",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#0a0a0a] border border-white/10 rounded-xl w-full max-w-lg mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h3 className="text-white font-semibold">Insert {blockLabels[blockType]}</h3>
          <button onClick={onClose} className="text-white/50 hover:text-white">
            ✕
          </button>
        </div>
        <div className="p-4">
          {renderFields()}
          <div className="flex gap-3 mt-6">
            <button 
              type="button" 
              onClick={handleSubmit} 
              className="flex-1 py-2.5 bg-cyan/20 text-cyan rounded-lg hover:bg-cyan/30 transition-colors"
            >
              Insert Block
            </button>
            <button type="button" onClick={onClose} className="flex-1 py-2.5 bg-white/5 text-white/60 rounded-lg hover:bg-white/10 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsEditor({ data, onChange }) {
  const currentData = data || { items: [
    { value: "", label: "", description: "" },
    { value: "", label: "", description: "" },
    { value: "", label: "", description: "" },
    { value: "", label: "", description: "" },
  ]};
  const items = currentData?.items || [];

  const updateItem = (index, field, value) => {
    const newItems = (currentData?.items || []).map((item, i) => i === index ? { ...item, [field]: value } : item);
    onChange({ items: newItems });
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <p className="text-white/50 text-sm">Add up to 4 stats</p>
        <button
          type="button"
          onClick={() => {
            if ((currentData?.items?.length || 0) < 4) {
              onChange({ items: [...(currentData?.items || []), { value: "", label: "", description: "" }] });
            }
          }}
          disabled={(currentData?.items?.length || 0) >= 4}
          className="text-xs text-cyan hover:text-cyan/80 disabled:text-white/30 disabled:cursor-not-allowed"
        >
          + Add
        </button>
      </div>
      {items.map((item, i) => (
        <div key={i} className="space-y-2 p-3 bg-white/5 rounded-lg">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Value (e.g. $20k)"
              value={item.value}
              onChange={(e) => updateItem(i, "value", e.target.value)}
              className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/20"
            />
            <input
              type="text"
              placeholder="Label"
              value={item.label}
              onChange={(e) => updateItem(i, "label", e.target.value)}
              className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/20"
            />
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Description (optional)"
              value={item.description}
              onChange={(e) => updateItem(i, "description", e.target.value)}
              className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/20"
            />
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => {
                  const newItems = items.filter((_, idx) => idx !== i);
                  onChange({ items: newItems });
                }}
                className="px-2 text-white/40 hover:text-red-400"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function QuoteEditor({ data, onChange }) {
  const currentData = data ? { text: data.text || "", author: data.author || "", style: data.style || "default" } : { text: "", author: "", style: "default" };
  const quoteStyles = [
    { value: "default", label: "Default" },
    { value: "glow", label: "Glow" },
    { value: "minimal", label: "Minimal" },
    { value: "boxed", label: "Boxed" },
  ];

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {quoteStyles.map((s) => (
          <button
            key={s.value}
            type="button"
            onClick={() => onChange({ text: currentData.text, author: currentData.author, style: s.value })}
            className={`flex-1 py-2 rounded-lg text-xs ${currentData.style === s.value ? "bg-cyan/20 text-cyan" : "bg-white/5 text-white/50"}`}
          >
            {s.label}
          </button>
        ))}
      </div>
      <textarea
        placeholder="Quote text..."
        value={currentData.text}
        onChange={(e) => onChange({ text: e.target.value, author: data?.author || "", style: data?.style || "default" })}
        rows={3}
        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/20 resize-none"
      />
      <input
        type="text"
        placeholder="Author name (optional)"
        value={data?.author || ""}
        onChange={(e) => onChange({ text: data?.text || "", author: e.target.value, style: data?.style || "default" })}
        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/20"
      />
    </div>
  );
}

function TechGridEditor({ data, onChange }) {
  const currentData = data ? { items: data.items || [] } : { items: [
    { icon: "", title: "", description: "" },
    { icon: "", title: "", description: "" },
    { icon: "", title: "", description: "" },
  ]};
  const items = currentData?.items || [];

  const updateItem = (index, field, value) => {
    const newItems = (currentData?.items || []).map((item, i) => i === index ? { ...item, [field]: value } : item);
    onChange({ items: newItems });
  };

  return (
    <div className="space-y-3">
      <p className="text-white/50 text-sm">Add up to 4 cards</p>
      {items.map((item, i) => (
        <div key={i} className="space-y-2 p-3 bg-white/5 rounded-lg">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Icon (e.g. 🚀)"
              value={item.icon}
              onChange={(e) => updateItem(i, "icon", e.target.value)}
              className="w-16 px-2 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
            />
            <input
              type="text"
              placeholder="Title"
              value={item.title}
              onChange={(e) => updateItem(i, "title", e.target.value)}
              className="flex-1 px-2 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
            />
          </div>
          <input
            type="text"
            placeholder="Description"
            value={item.description}
            onChange={(e) => updateItem(i, "description", e.target.value)}
            className="w-full px-2 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
          />
        </div>
      ))}
    </div>
  );
}

function CaseStudyEditor({ data, onChange }) {
  const currentData = data ? { title: data.title || "", body: data.body || "", verdict: data.verdict || "Success", verdictLabel: data.verdictLabel || "Verdict" } : { title: "", body: "", verdict: "Success", verdictLabel: "Verdict" };
  
  return (
    <div className="space-y-3">
      <input
        type="text"
        placeholder="Case Study Title"
        value={currentData.title}
        onChange={(e) => onChange({ title: e.target.value, body: currentData.body, verdict: currentData.verdict, verdictLabel: currentData.verdictLabel })}
        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/20"
      />
      <textarea
        placeholder="Description..."
        value={currentData.body}
        onChange={(e) => onChange({ title: currentData.title, body: e.target.value, verdict: currentData.verdict, verdictLabel: currentData.verdictLabel })}
        rows={3}
        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/20 resize-none"
      />
      <div className="flex gap-2">
        <select
          value={currentData.verdict}
          onChange={(e) => onChange({ title: currentData.title, body: currentData.body, verdict: e.target.value, verdictLabel: currentData.verdictLabel })}
          className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
        >
          <option value="Success">Success</option>
          <option value="Failure">Failure</option>
          <option value="Pending">Pending</option>
        </select>
        <input
          type="text"
          placeholder="Verdict Label"
          value={currentData.verdictLabel}
          onChange={(e) => onChange({ title: currentData.title, body: currentData.body, verdict: currentData.verdict, verdictLabel: e.target.value })}
          className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
        />
      </div>
    </div>
  );
}

function HighlightEditor({ data, onChange }) {
  const currentData = data ? { content: data.content || "", style: data.style || "info" } : { content: "", style: "info" };

  return (
    <div className="space-y-3">
      <select
        value={currentData.style}
        onChange={(e) => onChange({ content: currentData.content, style: e.target.value })}
        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
      >
        <option value="info">Info (Blue)</option>
        <option value="warning">Warning (Yellow)</option>
        <option value="success">Success (Green)</option>
      </select>
      <textarea
        placeholder="Content to highlight..."
        value={currentData.content}
        onChange={(e) => onChange({ content: e.target.value, style: currentData.style })}
        rows={3}
        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/20 resize-none"
      />
    </div>
  );
}

function WorkflowEditor({ data, onChange }) {
  const defaultSteps = ["Step 1", "Step 2", "Step 3"];
  const currentData = data ? { steps: data.steps || defaultSteps, layout: data.layout || "horizontal" } : { steps: defaultSteps, layout: "horizontal" };
  const steps = currentData.steps;
  const layout = currentData.layout;

  const updateStep = (index, value) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    onChange({ steps: newSteps, layout });
  };

  const setLayout = (newLayout) => {
    onChange({ steps, layout: newLayout });
  };

  const addStep = () => {
    if (steps.length < 8) {
      onChange({ steps: [...steps, `Step ${steps.length + 1}`], layout });
    }
  };

  const removeStep = (index) => {
    if (steps.length > 2) {
      const newSteps = steps.filter((_, i) => i !== index);
      onChange({ steps: newSteps, layout });
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setLayout("horizontal")}
          className={`flex-1 py-2 rounded-lg text-sm ${layout === "horizontal" ? "bg-cyan/20 text-cyan" : "bg-white/5 text-white/50"}`}
        >
          ↔ Horizontal
        </button>
        <button
          type="button"
          onClick={() => setLayout("vertical")}
          className={`flex-1 py-2 rounded-lg text-sm ${layout === "vertical" ? "bg-cyan/20 text-cyan" : "bg-white/5 text-white/50"}`}
        >
          ↕ Vertical
        </button>
      </div>
      <p className="text-white/50 text-sm">Add up to 8 steps</p>
      {steps.map((step, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-6 h-6 flex items-center justify-center bg-cyan/20 rounded-full text-cyan text-xs">{i + 1}</span>
          <input
            type="text"
            placeholder={`Step ${i + 1}`}
            value={step}
            onChange={(e) => updateStep(i, e.target.value)}
            className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
          />
          {steps.length > 2 && (
            <button
              type="button"
              onClick={() => removeStep(i)}
              className="p-2 text-white/40 hover:text-red-400"
            >
              ✕
            </button>
          )}
        </div>
      ))}
      {steps.length < 8 && (
        <button
          type="button"
          onClick={addStep}
          className="w-full py-2 border border-dashed border-white/20 rounded-lg text-white/50 text-sm hover:border-cyan/50 hover:text-cyan transition-colors"
        >
          + Add Step
        </button>
      )}
    </div>
  );
}
