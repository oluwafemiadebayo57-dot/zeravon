// src/app/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ leads: 0, services: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const leadsSnap = await getDocs(collection(db, "leads"));
        const servicesSnap = await getDocs(collection(db, "services"));
        setStats({
          leads: leadsSnap.size,
          services: servicesSnap.size,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: "2rem", color: "var(--secondary)", marginBottom: "30px" }}>Dashboard Overview</h1>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
        
        <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", borderTop: "4px solid var(--primary)" }}>
          <h3 style={{ color: "#6B7280", fontSize: "1rem", marginBottom: "10px" }}>Total Leads</h3>
          <p style={{ fontSize: "3rem", fontWeight: 700, color: "var(--secondary)" }}>{stats.leads}</p>
          <Link href="/admin/leads" style={{ color: "var(--primary)", fontWeight: 600, fontSize: "0.9rem" }}>View Leads →</Link>
        </div>

        <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", borderTop: "4px solid var(--secondary)" }}>
          <h3 style={{ color: "#6B7280", fontSize: "1rem", marginBottom: "10px" }}>Active Services</h3>
          <p style={{ fontSize: "3rem", fontWeight: 700, color: "var(--secondary)" }}>{stats.services}</p>
          <Link href="/admin/services" style={{ color: "var(--secondary)", fontWeight: 600, fontSize: "0.9rem" }}>Manage Services →</Link>
        </div>

      </div>
    </div>
  );
}