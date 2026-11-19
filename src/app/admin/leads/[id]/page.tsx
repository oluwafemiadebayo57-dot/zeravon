// src/app/admin/leads/[id]/page.tsx
"use client";

import { useEffect, useState, use } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Lead } from "@/lib/types";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AuditEditor({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const leadId = resolvedParams.id;

  const [lead, setLead] = useState<Lead | null>(null);
  const [auditText, setAuditText] = useState("");
  const [proposalLink, setProposalLink] = useState("");
  const [saving, setSaving] = useState(false);
  const [sendingProposal, setSendingProposal] = useState(false);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const docRef = doc(db, "leads", leadId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as Lead;
          setLead({ id: docSnap.id, ...data });
          setAuditText(data.auditText || "");
          setProposalLink(data.proposalLink || "");
        } else {
          alert("Lead not found");
          router.push("/admin/leads");
        }
      } catch (error) {
        console.error("Error fetching lead:", error);
      }
    };
    fetchLead();
  }, [leadId, router]);

  const handleSaveAudit = async (markAsSent: boolean) => {
    setSaving(true);
    try {
      const leadRef = doc(db, "leads", leadId);
      await updateDoc(leadRef, {
        auditText: auditText,
        auditStatus: markAsSent ? "Sent" : "Drafting",
        status: markAsSent && lead?.status === "New" ? "Audit Sent" : lead?.status
      });
      
      if (markAsSent) alert("Audit published! You can now copy the client link.");
      else alert("Draft saved.");
    } catch (error) {
      console.error(error);
      alert("Failed to save audit.");
    } finally {
      setSaving(false);
    }
  };

  const handleSendProposal = async () => {
    if (!proposalLink) {
      alert("Please paste a proposal link first.");
      return;
    }
    setSendingProposal(true);
    try {
      const leadRef = doc(db, "leads", leadId);
      await updateDoc(leadRef, { 
        proposalLink: proposalLink,
        status: "Proposal Sent"
      });

      await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: lead?.email,
          subject: `Your Proposal from Zeravon`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
              <h2 style="color: #FACC15; background: #111; padding: 20px; border-radius: 8px 8px 0 0; margin: 0;">Your Proposal is Ready</h2>
              <div style="background: #F9FAFB; padding: 20px; border: 1px solid #E5E7EB; border-top: none; border-radius: 0 0 8px 8px;">
                <p>Hi ${lead?.name},</p>
                <p>It was great speaking with you. As promised, here is the proposal for ${lead?.company}.</p>
                <p>You can view it here:</p>
                <a href="${proposalLink}" style="display: inline-block; background: #FACC15; color: #111; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0;">View Proposal</a>
                <p>Let me know if you have any questions!</p>
                <br/>
                <p>The Zeravon Team</p>
              </div>
            </div>
          `,
        }),
      });

      alert("Proposal sent successfully!");
      
      if (lead) {
        // Force TypeScript to accept the new object
        setLead({ ...lead, status: "Proposal Sent", proposalLink } as unknown as Lead);
      }
      
    } catch (error) {
      console.error("Error sending proposal:", error);
      alert("Failed to send proposal.");
    } finally {
      setSendingProposal(false);
    }
  };

  const copyAuditLink = () => {
    const url = `${window.location.origin}/audit/${leadId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!lead) return <div style={{ padding: "40px" }}>Loading lead data...</div>;

  return (
    <div style={{ maxWidth: "900px" }}>
      <Link href="/admin/leads" style={{ color: "#6B7280", fontWeight: 600, marginBottom: "20px", display: "inline-block" }}>
        ← Back to Leads
      </Link>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "30px", flexWrap: "wrap", gap: "20px" }}>
        <div>
          <h1 style={{ fontSize: "2rem", color: "var(--secondary)" }}>Manage Deal: {lead.company}</h1>
          <p style={{ color: "#6B7280" }}>Client: {lead.name} ({lead.email})</p>
        </div>
        
        {lead.auditStatus === "Sent" && (
          <button onClick={copyAuditLink} className="btn-primary" style={{ backgroundColor: copied ? "#10B981" : "var(--secondary)", color: "white" }}>
            {copied ? "Link Copied! ✓" : "Copy Client Audit Link 🔗"}
          </button>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
        
        <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
          <label style={{ display: "block", marginBottom: "10px", fontWeight: 600, color: "var(--secondary)", fontSize: "1.1rem" }}>
            1. Audit Document
          </label>
          <p style={{ color: "#6B7280", fontSize: "0.9rem", marginBottom: "20px" }}>
            Write or paste the audit here. The client will see exactly what you type.
          </p>
          
          <textarea
            value={auditText}
            onChange={(e) => setAuditText(e.target.value)}
            placeholder={`Hey ${lead.name},\n\nI took a look at ${lead.website || lead.company}...`}
            style={{
              width: "100%", height: "300px", padding: "20px", 
              borderRadius: "8px", border: "1px solid #E5E7EB",
              fontSize: "1rem", lineHeight: 1.6, color: "#111",
              outline: "none", resize: "vertical", fontFamily: "var(--font-body)"
            }}
          />

          <div style={{ display: "flex", gap: "16px", marginTop: "20px" }}>
            <button onClick={() => handleSaveAudit(false)} disabled={saving} className="btn-secondary" style={{ flex: 1 }}>
              {saving ? "Saving..." : "Save Draft"}
            </button>
            <button onClick={() => handleSaveAudit(true)} disabled={saving} className="btn-primary" style={{ flex: 1 }}>
              {saving ? "Saving..." : "Publish Audit to Client"}
            </button>
          </div>
        </div>

        <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
          <label style={{ display: "block", marginBottom: "10px", fontWeight: 600, color: "var(--secondary)", fontSize: "1.1rem" }}>
            2. Send Proposal
          </label>
          <p style={{ color: "#6B7280", fontSize: "0.9rem", marginBottom: "20px" }}>
            Paste a link to your Google Doc, Canva, or PandaDoc proposal. Clicking send will email this link to the client.
          </p>

          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <input 
              type="url"
              value={proposalLink}
              onChange={(e) => setProposalLink(e.target.value)}
              placeholder="https://docs.google.com/..."
              style={{ flex: "1 1 300px", padding: "14px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "1rem" }}
            />
            <button 
              onClick={handleSendProposal} 
              disabled={sendingProposal || !proposalLink} 
              className="btn-primary" 
              style={{ flex: "0 0 auto", padding: "14px 24px" }}
            >
              {sendingProposal ? "Sending..." : "Email Proposal"}
            </button>
          </div>
          
          {lead.proposalLink && (
             <p style={{ marginTop: "16px", fontSize: "0.9rem", color: "#10B981", fontWeight: 600 }}>
               ✓ Proposal sent previously.
             </p>
          )}
        </div>

      </div>
    </div>
  );
}