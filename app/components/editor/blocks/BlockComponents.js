import React from 'react';

export function StatsBlockView({ items }) {
  const itemArray = Array.isArray(items) ? items : [];
  const visibleItems = itemArray.filter(item => item && (item.value || item.label || item.description));

  if (!visibleItems.length) {
    return null;
  }

  return (
    <div className="stats-row">
      {visibleItems.map((item, index) => (
        <div key={index} className="stat-item">
          <div className="stat-value">{item?.value || ''}</div>
          <div className="stat-label">{item?.label || ''}</div>
          {item?.description && <div className="stat-description">{item.description}</div>}
        </div>
      ))}
    </div>
  );
}

export function QuoteBlockView({ text, author, style = "default" }) {
  const styleClass = style ? `quote-${style}` : '';
  const textContent = text || '';
  const authorContent = author || '';
  
  return (
    <blockquote className={`pull-quote ${styleClass}`}>
      {style === "glow" && <span className="quote-icon">"</span>}
      <p>{textContent}</p>
      {authorContent && <cite>— {authorContent}</cite>}
    </blockquote>
  );
}

export function TechGridBlockView({ items }) {
  const itemArray = Array.isArray(items) ? items : [];
  
  return (
    <div className="tech-grid">
      {itemArray.map((item, index) => (
        <div key={index} className="tech-card">
          <span className="tech-icon">{item?.icon || ''}</span>
          <h4 className="tech-title">{item?.title || ''}</h4>
          <p className="tech-desc">{item?.description || ''}</p>
        </div>
      ))}
    </div>
  );
}

export function CaseStudyBlockView({ title, body, verdict, verdictLabel }) {
  const titleContent = title || '';
  const bodyContent = body || '';
  const verdictContent = verdict || '';
  const labelContent = verdictLabel || 'Verdict';
  
  return (
    <div className="case-study-card">
      <h3 className="case-title">{titleContent}</h3>
      <p className="case-body">{bodyContent}</p>
      {verdictContent && (
        <div className="case-verdict">
          <span className="verdict-label">{labelContent}</span>
          <span className={`verdict-value verdict-${verdictContent.toLowerCase()}`}>{verdictContent}</span>
        </div>
      )}
    </div>
  );
}

export function HighlightBlockView({ content, style }) {
  const contentContent = content || '';
  const styleValue = style || 'info';
  
  return (
    <div className={`highlight-box highlight-${styleValue}`}>
      <p>{contentContent}</p>
    </div>
  );
}

export function WorkflowBlockView({ steps, layout }) {
  const layoutClass = layout === 'vertical' ? 'workflow-vertical' : 'workflow-horizontal';
  const stepArray = Array.isArray(steps) ? steps : (typeof steps === 'string' ? [steps] : ['Step 1', 'Step 2', 'Step 3']);

  return (
    <div className={`workflow-block ${layoutClass}`}>
      {stepArray.map((step, index) => (
        <React.Fragment key={index}>
          <div className="workflow-step">
            <div className="step-number">{index + 1}</div>
            <div className="step-label">{String(step)}</div>
          </div>
          {index < stepArray.length - 1 && (
            <div className="step-arrow">→</div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
