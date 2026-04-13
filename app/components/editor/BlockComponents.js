export function StatsRow({ items = [] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-8">
      {items.map((item, i) => (
        <div key={i} className="stat-card glass-card p-4 text-center">
          <div className="text-2xl md:text-3xl font-bold text-cyan">{item.value}</div>
          <div className="text-sm text-white/60 mt-1">{item.label}</div>
        </div>
      ))}
    </div>
  );
}

export function QuoteBlock({ text, author }) {
  return (
    <blockquote className="my-8 border-l-4 border-cyan pl-6 py-2 bg-white/[0.02] rounded-r-lg">
      <p className="text-lg text-white/90 italic">{text}</p>
      {author && <cite className="block text-sm text-cyan mt-2">— {author}</cite>}
    </blockquote>
  );
}

export function TechGrid({ items = [] }) {
  return (
    <div className="grid md:grid-cols-3 gap-4 my-8">
      {items.map((item, i) => (
        <div key={i} className="glass-card p-6">
          <div className="text-3xl mb-3">{item.icon}</div>
          <h4 className="text-lg font-semibold text-white mb-2">{item.title}</h4>
          <p className="text-sm text-white/60">{item.description}</p>
        </div>
      ))}
    </div>
  );
}

export function CaseCard({ title, body, verdict, verdictLabel = 'Verdict' }) {
  return (
    <div className="glass-card my-8 overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-white/70">{body}</p>
      </div>
      <div className="border-t border-white/[0.08] p-4 bg-white/[0.02]">
        <span className="text-xs text-white/40 uppercase mr-2">{verdictLabel}:</span>
        <span className={`text-sm font-semibold ${verdict === 'Success' ? 'text-green-400' : 'text-red-400'}`}>
          {verdict}
        </span>
      </div>
    </div>
  );
}

export function HighlightBox({ content, style = 'info' }) {
  const colors = {
    info: 'border-cyan bg-cyan/5',
    warning: 'border-yellow-400 bg-yellow-400/5',
    success: 'border-green-400 bg-green-400/5',
  };
  return (
    <div className={`my-6 p-5 border-l-4 rounded-r-lg ${colors[style] || colors.info}`}>
      <p className="text-white/90">{content}</p>
    </div>
  );
}

export function Workflow({ steps = [], layout = 'horizontal' }) {
  const isHorizontal = layout === 'horizontal';
  return (
    <div className={`my-8 ${isHorizontal ? 'flex flex-wrap items-center justify-center gap-4' : 'flex flex-col gap-4'}`}>
      {steps.map((step, i) => (
        <div key={i} className="flex items-center">
          <div className="glass-card px-6 py-3 min-w-[120px] text-center">
            <span className="text-white/90">{step}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`text-cyan ${isHorizontal ? 'mx-2' : 'my-2 rotate-90'}`}>
              →
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
