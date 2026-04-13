// app/admin/payouts/page.js
"use client";

import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function PayoutsPage() {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchPayouts() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/payouts`);
      const json = await res.json();
      setPayouts(Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : []);
    } catch (e) {
      console.error(e);
      setPayouts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPayouts();
  }, []);

  const getStatusClass = (status) => {
    const classes = {
      Pending: "status-new",
      Completed: "status-converted",
      Failed: "status-lost",
    };
    return classes[status] || "";
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Payouts</h1>
        <p>Manage partner payouts.</p>
      </header>

      <div className="admin-table-container">
        <div className="admin-table-header">
          <span className="admin-table-title">
            {loading ? "Loading..." : `${payouts.length} payouts`}
          </span>
          <button onClick={fetchPayouts} className="admin-refresh-btn">
            Refresh
          </button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Partner</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Transaction ID</th>
                <th>Created</th>
                <th>Paid</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map((payout) => (
                <tr key={payout._id}>
                  <td>{payout.partnerId?.name || "N/A"}</td>
                  <td>₹{payout.amount}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(payout.status)}`}>
                      {payout.status}
                    </span>
                  </td>
                  <td style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem" }}>
                    {payout.transactionId || "-"}
                  </td>
                  <td style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem" }}>
                    {payout.createdAt ? new Date(payout.createdAt).toLocaleString() : "-"}
                  </td>
                  <td style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem" }}>
                    {payout.paidAt ? new Date(payout.paidAt).toLocaleString() : "-"}
                  </td>
                </tr>
              ))}
              {!loading && payouts.length === 0 && (
                <tr>
                  <td colSpan={6} className="admin-empty">
                    No payouts found yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}