// src/components/LeadForm.tsx
"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// Add the prop here
export default function LeadForm({ selectedService = "" }: { selectedService?: string }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    website: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const newLead = {
        ...formData,
        serviceInterest: selectedService, // Save the selected service
        status: "New",
        createdAt: serverTimestamp(),
      };

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Connection timed out. Please try again.")), 10000)
      );

      await Promise.race([
        addDoc(collection(db, "leads"), newLead),
        timeoutPromise
      ]);

      setStatus("success");
      
      try {
        const adminEmailsString = process.env.NEXT_PUBLIC_ADMIN_EMAILS || "zeravon607@gmail.com";
        const adminEmails = adminEmailsString.split(",").map(email => email.trim());

        await fetch('/api/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: adminEmails,
            subject: `🚨 New Lead: ${formData.name} from ${formData.company}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
                <h2 style="color: #FACC15; background: #111; padding: 20px; border-radius: 8px 8px 0 0; margin: 0;">New Audit Request</h2>
                <div style="background: #F9FAFB; padding: 20px; border: 1px solid #E5E7EB; border-top: none; border-radius: 0 0 8px 8px;">
                  <p><strong>Name:</strong> ${formData.name}</p>
                  <p><strong>Email:</strong> ${formData.email}</p>
                  <p><strong>Company:</strong> ${formData.company}</p>
                  <p><strong>Website:</strong> ${formData.website || 'N/A'}</p>
                  <p><strong>Interested In:</strong> <span style="background: #FACC15; padding: 2px 6px; border-radius: 4px; font-weight: bold;">${selectedService || 'Not Specified'}</span></p>
                  <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 20px 0;" />
                  <p><strong>Goals:</strong></p>
                  <p style="background: white; padding: 12px; border-radius: 6px; border: 1px solid #E5E7EB;">${formData.message}</p>
                  
                  <a href="${window.location.origin}/admin/leads" style="display: inline-block; background: #FACC15; color: #111; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px;">View Lead in Dashboard</a>
                </div>
              </div>
            `,
          }),
        });
      } catch (emailError) {
        console.error("Lead saved, but failed to send email notification:", emailError);
      }

      setFormData({ name: "", email: "", company: "", website: "", message: "" });
    } catch (error: any) {
      setErrorMsg(error.message || "Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  const inputStyle = {
    width: "100%", padding: "14px 16px", borderRadius: "8px",
    border: "1px solid #E5E7EB", backgroundColor: "#FFFFFF",
    color: "#111111", fontSize: "16px", fontFamily: "var(--font-body)",
    outline: "none", transition: "border-color 0.2s",
  };

  if (status === "success") {
    return (
      <div className="glass" style={{ padding: "40px", borderRadius: "16px", textAlign: "center" }}>
        <h3 style={{ fontSize: "1.8rem", marginBottom: "16px", color: "var(--secondary)" }}>Audit Requested!</h3>
        <p style={{ fontSize: "1.1rem", color: "var(--text-dark)" }}>
          We've received your details. Our team will reach out within 24 hours with your custom strategy.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass" style={{ padding: "40px", borderRadius: "16px", display: "flex", flexDirection: "column", gap: "20px" }}>
      
      {/* NEW: Show the selected service at the top of the form */}
      {selectedService && (
        <div style={{ backgroundColor: "var(--secondary)", color: "white", padding: "12px 16px", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "0.9rem", color: "#9CA3AF" }}>Selected Package:</span>
          <strong style={{ color: "var(--primary)", fontSize: "1rem" }}>{selectedService}</strong>
        </div>
      )}

      <div>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "var(--secondary)" }}>Name</label>
        <input required type="text" name="name" value={formData.name} onChange={handleChange} style={inputStyle} placeholder="John Doe" />
      </div>
      
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 200px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "var(--secondary)" }}>Email</label>
          <input required type="email" name="email" value={formData.email} onChange={handleChange} style={inputStyle} placeholder="john@brand.com" />
        </div>
        <div style={{ flex: "1 1 200px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "var(--secondary)" }}>Company</label>
          <input required type="text" name="company" value={formData.company} onChange={handleChange} style={inputStyle} placeholder="Brand Co." />
        </div>
      </div>

      <div>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "var(--secondary)" }}>Website (Optional)</label>
        <input type="text" name="website" value={formData.website} onChange={handleChange} style={inputStyle} placeholder="https://brand.com" />
      </div>

      <div>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "var(--secondary)" }}>What are your goals?</label>
        <textarea required name="message" value={formData.message} onChange={handleChange} rows={4} style={{ ...inputStyle, resize: "vertical" }} placeholder="We want to scale our reach and increase conversions..."></textarea>
      </div>

      {status === "error" && (
        <div style={{ color: "#B91C1C", backgroundColor: "#FEE2E2", padding: "12px", borderRadius: "8px", fontSize: "0.9rem" }}>
          {errorMsg}
        </div>
      )}

      <button type="submit" disabled={status === "loading"} className="btn-primary" style={{ marginTop: "10px", width: "100%", padding: "16px" }}>
        {status === "loading" ? "Submitting..." : "Request Free Audit"}
      </button>
    </form>
  );
}