// app/admin/partners/page.js
"use client";

import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function PartnersPage() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchPartners() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/partners`);
      const json = await res.json();
      setPartners(Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : []);
    } catch (e) {
      console.error(e);
      setPartners([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPartners();
  }, []);

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Partners</h1>
        <p>Manage your referral partners.</p>
      </header>

      <div className="admin-table-container">
        <div className="admin-table-header">
          <span className="admin-table-title">
            {loading ? "Loading..." : `${partners.length} partners`}
          </span>
          <button onClick={fetchPartners} className="admin-refresh-btn">
            Refresh
          </button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Total Referrals</th>
                <th>Total Earned</th>
                <th>Outstanding</th>
              </tr>
            </thead>
            <tbody>
              {partners.map((partner) => (
                <tr key={partner._id}>
                  <td>{partner.name}</td>
                  <td>{partner.email}</td>
                  <td>{partner.phone || "-"}</td>
                  <td>{partner.totalReferrals || 0}</td>
                  <td>₹{partner.totalEarned || 0}</td>
                  <td>₹{partner.outstandingCommission || 0}</td>
                </tr>
              ))}
              {!loading && partners.length === 0 && (
                <tr>
                  <td colSpan={6} className="admin-empty">
                    No partners found yet.
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