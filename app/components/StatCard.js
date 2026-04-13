// components/StatCard.js
export function StatCard({ label, value, sub }) {
  return (
    <div className="admin-stat-card">
      <div className="admin-card-label">{label}</div>
      <div className="admin-card-value">{value}</div>
      {sub && <div className="admin-card-sub">{sub}</div>}
    </div>
  );
}
