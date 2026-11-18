// src/app/audit/[id]/page.tsx
"use client";

import { useEffect, useState, use } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Lead } from "@/lib/types";
import Link from "next/link";

export default function PublicAuditPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const leadId = resolvedParams.id;

  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const leadSnap = await getDoc(doc(db, "leads", leadId));
        if (leadSnap.exists()) {
          setLead({ id: leadSnap.id, ...leadSnap.data() } as Lead);
        }
      } catch (error) {
        console.error("Error fetching audit:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [leadId]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "var(--secondary)", color: "white", fontFamily: "var(--font-heading)", fontSize: "1.5rem" }}>
        Loading your audit...
      </div>
    );
  }
  
  if (!lead || !lead.auditText || lead.auditStatus !== "Sent") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "var(--secondary)", color: "white", padding: "20px", textAlign: "center" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "16px", fontFamily: "var(--font-heading)" }}>Audit Not Found</h1>
        <p style={{ color: "#9CA3AF", maxWidth: "400px", marginBottom: "24px" }}>
          This link is invalid or your audit hasn't been published yet. Please check back later or contact us.
        </p>
        <Link href="/" className="btn-primary">Return Home</Link>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "var(--secondary)", minHeight: "100vh", padding: "80px 20px", position: "relative", overflow: "hidden" }}>
      
      <div style={{ position: "absolute", top: "-10%", right: "-10%", width: "500px", height: "500px", background: "var(--primary)", filter: "blur(150px)", opacity: 0.1, borderRadius: "50%", pointerEvents: "none" }}></div>

      <div className="container" style={{ maxWidth: "850px", position: "relative", zIndex: 10 }}>
        
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <img 
            src="https://res.cloudinary.com/psxqnwx2/image/upload/f_auto,q_auto/IMG_2208" 
            alt="Zeravon" 
            style={{ height: "50px", margin: "0 auto", backgroundColor: "white", padding: "8px 16px", borderRadius: "8px" }} 
          />
        </div>

        <div className="glass-dark" style={{ padding: "clamp(24px, 5vw, 60px)", borderRadius: "24px" }}>
          
          <div style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "24px", marginBottom: "32px" }}>
            <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", marginBottom: "8px", fontFamily: "var(--font-heading)" }}>
              Your Custom Audit
            </h1>
            <p style={{ color: "var(--primary)", fontSize: "1.2rem", fontWeight: 600 }}>
              Prepared exclusively for: {lead.company}
            </p>
          </div>

          <div style={{ 
            whiteSpace: "pre-wrap", 
            color: "#E5E7EB", 
            lineHeight: 1.8, 
            fontSize: "1.05rem",
            fontFamily: "var(--font-body)"
          }}>
            {lead.auditText}
          </div>

          {/* UPDATED: Native Booking CTA */}
          <div style={{ marginTop: "60px", paddingTop: "40px", borderTop: "1px solid rgba(255,255,255,0.1)", textAlign: "center" }}>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "16px", fontFamily: "var(--font-heading)" }}>Ready to implement this?</h3>
            <p style={{ color: "#9CA3AF", marginBottom: "24px", maxWidth: "500px", margin: "0 auto 24px" }}>
              Let's get on a quick call to map out how we can execute this strategy for you.
            </p>
            <Link href="/contact" className="btn-primary" style={{ padding: "16px 32px", fontSize: "1.1rem" }}>
              Book a Strategy Call ↗
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}