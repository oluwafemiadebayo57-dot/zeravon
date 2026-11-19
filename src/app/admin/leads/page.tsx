// src/app/admin/leads/page.tsx
"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc, query, orderBy } from "firebase/firestore";
import { Lead } from "@/lib/types";
import Link from "next/link";

const statusStyles: Record<Lead["status"], { bg: string; color: string }> = {
  "New": { bg: "#FEF08A", color: "#854D0E" },
  "Audit Sent": { bg: "#DBEAFE", color: "#1E40AF" },
  "Call Booked": { bg: "#E0E7FF", color: "#3730A3" },
  "Proposal Sent": { bg: "#F3E8FF", color: "#6B21A8" },
  "Won": { bg: "#D1FAE5", color: "#065F46" },
  "Lost": { bg: "#F3F4F6", color: "#374151" }
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    try {
      const q = query(collection(db, "leads"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      
      const leadsData = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || "",
          email: data.email || "",
          company: data.company || "",
          website: data.website || "",
          message: data.message || "",
          serviceInterest: data.serviceInterest || "",
          status: data.status || "New",
          auditStatus: data.auditStatus || "Not Started",
          auditText: data.auditText || "",
          proposalLink: data.proposalLink || "",
          createdAt: data.createdAt,
        } as Lead;
      });
      
      setLeads(leadsData);
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const updateStatus = async (id: string | undefined, newStatus: Lead["status"]) => {
    if (!id) return;
    try {
      const leadRef = doc(db, "leads", id);
      await updateDoc(leadRef, { status: newStatus });
      setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus } : l));
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  if (loading) return <div style={{ padding: "20px", fontWeight: 600 }}>Loading leads...</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1 style={{ fontSize: "2rem", color: "var(--secondary)" }}>Manage Leads</h1>
        <button onClick={fetchLeads} className="btn-secondary" style={{ padding: "10px 20px", fontSize: "0.9rem" }}>
          Refresh Data
        </button>
      </div>
      
      <div style={{ backgroundColor: "white", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: "1000px" }}>
          <thead style={{ backgroundColor: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
            <tr>
              <th style={{ padding: "16px", fontWeight: 600, color: "#4B5563", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Name</th>
              <th style={{ padding: "16px", fontWeight: 600, color: "#4B5563", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Company</th>
              <th style={{ padding: "16px", fontWeight: 600, color: "#4B5563", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Contact</th>
              <th style={{ padding: "16px", fontWeight: 600, color: "#4B5563", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Service Interest</th>
              <th style={{ padding: "16px", fontWeight: 600, color: "#4B5563", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Pipeline Status</th>
              <th style={{ padding: "16px", fontWeight: 600, color: "#4B5563", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: "40px", textAlign: "center", color: "#6B7280" }}>
                  No leads found yet. Go get some!
                </td>
              </tr>
            ) : (
              leads.map((lead) => {
                const style = statusStyles[lead.status] || statusStyles["New"];
                return (
                  <tr key={lead.id} style={{ borderBottom: "1px solid #F3F4F6", transition: "background-color 0.2s" }}>
                    <td style={{ padding: "16px", fontWeight: 600, color: "var(--secondary)" }}>{lead.name}</td>
                    <td style={{ padding: "16px", color: "#4B5563" }}>{lead.company}</td>
                    <td style={{ padding: "16px" }}>
                      <div style={{ fontSize: "0.9rem", color: "#4B5563" }}>{lead.email}</div>
                      {lead.website && (
                        <a href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`} target="_blank" rel="noreferrer" style={{ fontSize: "0.85rem", color: "var(--primary)", fontWeight: 600 }}>
                          Visit Site ↗
                        </a>
                      )}
                    </td>
                    <td style={{ padding: "16px" }}>
                      {lead.serviceInterest ? (
                        <span style={{ backgroundColor: "#F3F4F6", padding: "4px 8px", borderRadius: "4px", fontSize: "0.85rem", fontWeight: 600, color: "#374151" }}>
                          {lead.serviceInterest}
                        </span>
                      ) : (
                        <span style={{ color: "#9CA3AF", fontSize: "0.85rem" }}>None</span>
                      )}
                    </td>
                    <td style={{ padding: "16px" }}>
                      <select 
                        value={lead.status} 
                        onChange={(e) => updateStatus(lead.id, e.target.value as Lead["status"])}
                        style={{
                          padding: "8px 12px", 
                          borderRadius: "6px", 
                          border: "1px solid #E5E7EB", 
                          fontWeight: 600,
                          cursor: "pointer",
                          outline: "none",
                          backgroundColor: style.bg,
                          color: style.color
                        }}
                      >
                        <option value="New">New</option>
                        <option value="Audit Sent">Audit Sent</option>
                        <option value="Call Booked">Call Booked</option>
                        <option value="Proposal Sent">Proposal Sent</option>
                        <option value="Won">Won 🎉</option>
                        <option value="Lost">Lost</option>
                      </select>
                    </td>
                    <td style={{ padding: "16px" }}>
                      <Link 
                        href={`/admin/leads/${lead.id}`}
                        style={{ 
                          padding: "8px 16px", 
                          backgroundColor: "var(--secondary)", 
                          color: "white", 
                          borderRadius: "6px", 
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          display: "inline-block",
                          textAlign: "center"
                        }}
                      >
                        Manage Deal
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}