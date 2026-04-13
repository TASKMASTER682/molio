// app/admin/leads/page.js
"use client";

import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchLeads() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/leads`);
      const json = await res.json();
      setLeads(Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : []);
    } catch (e) {
      console.error(e);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLeads();
  }, []);

  const getStatusClass = (status) => {
    const classes = {
      New: "status-new",
      Contacted: "status-contacted",
      Converted: "status-converted",
      Lost: "status-lost",
    };
    return classes[status] || "";
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Leads</h1>
        <p>All website & partner inquiries.</p>
      </header>

      <div className="admin-table-container">
        <div className="admin-table-header">
          <span className="admin-table-title">
            {loading ? "Loading..." : `${leads.length} leads`}
          </span>
          <button onClick={fetchLeads} className="admin-refresh-btn">
            Refresh
          </button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Service</th>
                <th>Status</th>
                <th>Source</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead._id}>
                  <td>{lead.name}</td>
                  <td>{lead.email}</td>
                  <td>{lead.service}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(lead.status)}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td>{lead.source || "Website"}</td>
                  <td style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem" }}>
                    {lead.createdAt
                      ? new Date(lead.createdAt).toLocaleString()
                      : "-"}
                  </td>
                </tr>
              ))}
              {!loading && leads.length === 0 && (
                <tr>
                  <td colSpan={6} className="admin-empty">
                    No leads found yet. Submit the form on the homepage to test.
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
