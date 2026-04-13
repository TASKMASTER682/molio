export function renderStatsBlock(items) {
  if (!items || !Array.isArray(items)) return '';
  return items.map(item => `
    <div class="stat-item">
      <div class="stat-value">${item.value || ''}</div>
      <div class="stat-label">${item.label || ''}</div>
      ${item.description ? `<div class="stat-description">${item.description}</div>` : ''}
    </div>
  `).join('');
}

export function renderQuoteBlock(text, author, style = 'default') {
  const styleClass = style !== 'default' ? `quote-${style}` : '';
  const icon = style === 'glow' ? '<span class="quote-icon">"</span>' : '';
  return `
    <blockquote class="pull-quote ${styleClass}">
      ${icon}
      <p>${text || ''}</p>
      ${author ? `<cite>— ${author}</cite>` : ''}
    </blockquote>
  `;
}

export function renderTechGridBlock(items) {
  if (!items || !Array.isArray(items)) return '';
  return items.map(item => `
    <div class="tech-card">
      <span class="tech-icon">${item.icon || ''}</span>
      <h4 class="tech-title">${item.title || ''}</h4>
      <p class="tech-desc">${item.description || ''}</p>
    </div>
  `).join('');
}

export function renderCaseStudyBlock(title, body, verdict, verdictLabel) {
  return `
    <div class="case-study-card">
      <h3 class="case-title">${title || ''}</h3>
      <p class="case-body">${body || ''}</p>
      ${verdict ? `
        <div class="case-verdict">
          <span class="verdict-label">${verdictLabel || 'Verdict'}</span>
          <span class="verdict-value verdict-${verdict.toLowerCase()}">${verdict}</span>
        </div>
      ` : ''}
    </div>
  `;
}

export function renderHighlightBlock(content, style = 'info') {
  return `
    <div class="highlight-box highlight-${style}">
      <p>${content || ''}</p>
    </div>
  `;
}

export function renderWorkflowBlock(steps, layout = 'horizontal') {
  const layoutClass = layout === 'vertical' ? 'workflow-vertical' : 'workflow-horizontal';
  if (!steps || !Array.isArray(steps)) return '';
  return steps.map((step, index) => `
    <div class="workflow-step">
      <div class="step-number">${index + 1}</div>
      <div class="step-label">${step}</div>
      ${index < steps.length - 1 ? '<div class="step-arrow">→</div>' : ''}
    </div>
  `).join('');
}

function parseJsonSafe(str) {
  try {
    return JSON.parse(str.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&apos;/g, "'"));
  } catch (e) {
    return null;
  }
}

export function renderCustomBlocks(html) {
  if (!html) return html;
  
  let result = html;
  
  const blockParsers = {
    statsBlock: (inner) => {
      const data = parseJsonSafe(inner);
      if (data?.items) return `<div class="stats-row">${renderStatsBlock(data.items)}</div>`;
      return null;
    },
    quoteBlock: (inner) => {
      const data = parseJsonSafe(inner);
      if (data) return renderQuoteBlock(data.text, data.author, data.style);
      return null;
    },
    highlightBlock: (inner) => {
      const data = parseJsonSafe(inner);
      if (data) return renderHighlightBlock(data.content, data.style);
      return null;
    },
    caseStudyBlock: (inner) => {
      const data = parseJsonSafe(inner);
      if (data) return renderCaseStudyBlock(data.title, data.body, data.verdict, data.verdictLabel);
      return null;
    },
    workflowBlock: (inner) => {
      const data = parseJsonSafe(inner);
      if (data?.steps) return `<div class="workflow-block ${data.layout === 'vertical' ? 'workflow-vertical' : 'workflow-horizontal'}">${renderWorkflowBlock(data.steps, data.layout)}</div>`;
      return null;
    },
    techGridBlock: (inner) => {
      const data = parseJsonSafe(inner);
      if (data?.items) return `<div class="tech-grid">${renderTechGridBlock(data.items)}</div>`;
      return null;
    },
  };
  
  Object.keys(blockParsers).forEach(blockName => {
    const regex = new RegExp(`<${blockName}[^>]*>([\\s\\S]*?)</${blockName}>`, 'g');
    result = result.replace(regex, (match, inner) => {
      const rendered = blockParsers[blockName](inner);
      return rendered || match;
    });
  });
  
  return result;
}