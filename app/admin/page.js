// app/admin/page.js
import { StatCard } from "../components/StatCard";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getLeadStats() {
  try {
    const res = await fetch(`${API_URL}/api/leads/stats/summary`, {
      cache: "no-store",
    });
    const json = await res.json();
    return json?.data || null;
  } catch {
    return null;
  }
}

async function getPayoutStats() {
  try {
    const res = await fetch(`${API_URL}/api/payouts/stats/summary`, {
      cache: "no-store",
    });
    const json = await res.json();
    return json?.data || null;
  } catch {
    return null;
  }
}

export default async function AdminDashboardPage() {
  const leadStats = await getLeadStats();
  const payoutStats = await getPayoutStats();

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Dashboard</h1>
        <p>Quick overview of leads, partners, and payouts.</p>
      </header>

      <div className="admin-grid">
        <div className="admin-card">
          <div className="admin-card-label">Total Leads</div>
          <div className="admin-card-value">{leadStats?.total || 0}</div>
          <div className="admin-card-sub">Converted: {leadStats?.converted || 0}</div>
        </div>
        <div className="admin-card">
          <div className="admin-card-label">Open Leads</div>
          <div className="admin-card-value">{leadStats?.open || 0}</div>
          <div className="admin-card-sub">New + Contacted</div>
        </div>
        <div className="admin-card">
          <div className="admin-card-label">Total Payouts</div>
          <div className="admin-card-value">
            {payoutStats?.completedAmount ? `₹${payoutStats.completedAmount}` : "₹0"}
          </div>
          <div className="admin-card-sub">Completed: {payoutStats?.completed || 0}</div>
        </div>
      </div>
    </div>
  );
}
