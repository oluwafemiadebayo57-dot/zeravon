// src/components/BookingForm.tsx
"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { TIME_SLOTS } from "@/lib/constants";

export default function BookingForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    date: "",
    time: "",
  });
  
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // 1. Check Availability when Date Changes
  useEffect(() => {
    if (!formData.date) {
      setAvailableTimes([]);
      return;
    }

    const checkAvailability = async () => {
      setIsChecking(true);
      try {
        // Fetch all confirmed/pending bookings for this date
        const bookingsQuery = query(
          collection(db, "bookings"), 
          where("date", "==", formData.date),
          where("status", "!=", "Cancelled")
        );
        const bookingsSnap = await getDocs(bookingsQuery);
        const bookedTimes = bookingsSnap.docs.map(doc => doc.data().time);

        // Fetch admin blocked slots for this date
        const blockedQuery = query(collection(db, "blocked_slots"), where("date", "==", formData.date));
        const blockedSnap = await getDocs(blockedQuery);
        const blockedData = blockedSnap.docs.map(doc => doc.data().time);

        // If "All Day" is blocked, clear all times
        if (blockedData.includes("All Day")) {
          setAvailableTimes([]);
        } else {
          // Filter out booked and blocked times
          const available = TIME_SLOTS.filter(
            time => !bookedTimes.includes(time) && !blockedData.includes(time)
          );
          setAvailableTimes(available);
        }
      } catch (error) {
        console.error("Error checking availability:", error);
        // Fallback to all times if query fails
        setAvailableTimes(TIME_SLOTS); 
      } finally {
        setIsChecking(false);
      }
    };

    checkAvailability();
  }, [formData.date]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.time) {
      setErrorMsg("Please select an available time.");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Connection timed out. Please try again.")), 10000)
      );

      // Save to Database
      await Promise.race([
        addDoc(collection(db, "bookings"), {
          ...formData,
          status: "Pending",
          createdAt: serverTimestamp(),
        }),
        timeoutPromise
      ]);

      setStatus("success");
      
      // Send Emails
      try {
        const adminEmailsString = process.env.NEXT_PUBLIC_ADMIN_EMAILS || "zeravon607@gmail.com";
        const adminEmails = adminEmailsString.split(",").map(email => email.trim());

        // 1. Email to Admin
        await fetch('/api/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: adminEmails,
            subject: `📅 New Call Booked: ${formData.name} (${formData.date})`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
                <h2 style="color: #FACC15; background: #111; padding: 20px; border-radius: 8px 8px 0 0; margin: 0;">New Strategy Call Booked</h2>
                <div style="background: #F9FAFB; padding: 20px; border: 1px solid #E5E7EB; border-top: none; border-radius: 0 0 8px 8px;">
                  <p><strong>Name:</strong> ${formData.name}</p>
                  <p><strong>Email:</strong> ${formData.email}</p>
                  <p><strong>Company:</strong> ${formData.company || 'N/A'}</p>
                  <p><strong>Date:</strong> ${formData.date}</p>
                  <p><strong>Time:</strong> ${formData.time}</p>
                </div>
              </div>
            `,
          }),
        });

        // 2. Email to Client
        await fetch('/api/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: formData.email,
            subject: `Confirmed: Strategy Call with Zeravon`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
                <h2 style="color: #FACC15; background: #111; padding: 20px; border-radius: 8px 8px 0 0; margin: 0;">You're Booked!</h2>
                <div style="background: #F9FAFB; padding: 20px; border: 1px solid #E5E7EB; border-top: none; border-radius: 0 0 8px 8px;">
                  <p>Hi ${formData.name},</p>
                  <p>We've reserved your spot for <strong>${formData.date} at ${formData.time}</strong>.</p>
                  <p>We will send you a calendar invite with the Google Meet link shortly.</p>
                  <p>Talk soon,<br/>The Zeravon Team</p>
                </div>
              </div>
            `,
          }),
        });
      } catch (emailError) {
        console.error("Booking saved, but failed to send email:", emailError);
      }

    } catch (error: any) {
      setErrorMsg(error.message || "Failed to book call.");
      setStatus("error");
    }
  };

  const inputStyle = {
    width: "100%", padding: "14px 16px", borderRadius: "8px", 
    border: "1px solid #E5E7EB", backgroundColor: "#FFFFFF",
    color: "#111111", fontSize: "16px", fontFamily: "var(--font-body)",
    outline: "none", marginBottom: "16px"
  };

  if (status === "success") {
    return (
      <div className="glass" style={{ padding: "40px", borderRadius: "16px", textAlign: "center", borderTop: "4px solid var(--primary)" }}>
        <h3 style={{ fontSize: "1.8rem", marginBottom: "16px", color: "var(--secondary)" }}>Call Booked!</h3>
        <p style={{ fontSize: "1.1rem", color: "var(--text-dark)" }}>
          We've reserved your spot for {formData.date} at {formData.time}. Check your email for details.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass" style={{ padding: "30px", borderRadius: "16px", display: "flex", flexDirection: "column" }}>
      <h3 style={{ fontSize: "1.5rem", marginBottom: "20px", color: "var(--secondary)", fontFamily: "var(--font-heading)" }}>Book a Strategy Call</h3>
      
      <label style={{ fontWeight: 600, marginBottom: "6px", fontSize: "0.9rem", color: "var(--secondary)" }}>Name</label>
      <input required type="text" name="name" value={formData.name} onChange={handleChange} style={inputStyle} placeholder="John Doe" />

      <label style={{ fontWeight: 600, marginBottom: "6px", fontSize: "0.9rem", color: "var(--secondary)" }}>Email</label>
      <input required type="email" name="email" value={formData.email} onChange={handleChange} style={inputStyle} placeholder="john@brand.com" />

      <label style={{ fontWeight: 600, marginBottom: "6px", fontSize: "0.9rem", color: "var(--secondary)" }}>Company (Optional)</label>
      <input type="text" name="company" value={formData.company} onChange={handleChange} style={inputStyle} placeholder="Brand Co." />

      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "16px" }}>
        <div style={{ flex: "1 1 150px" }}>
          <label style={{ fontWeight: 600, marginBottom: "6px", fontSize: "0.9rem", color: "var(--secondary)", display: "block" }}>Date</label>
          <input 
            required 
            type="date" 
            name="date" 
            value={formData.date} 
            onChange={handleChange} 
            style={{ ...inputStyle, marginBottom: 0 }} 
            min={new Date().toISOString().split("T")[0]} 
          />
        </div>
        <div style={{ flex: "1 1 150px" }}>
          <label style={{ fontWeight: 600, marginBottom: "6px", fontSize: "0.9rem", color: "var(--secondary)", display: "block" }}>Time</label>
          <select 
            required 
            name="time" 
            value={formData.time} 
            onChange={handleChange} 
            disabled={!formData.date || isChecking || availableTimes.length === 0}
            style={{ ...inputStyle, marginBottom: 0, opacity: (!formData.date || availableTimes.length === 0) ? 0.5 : 1 }}
          >
            <option value="" disabled>
              {!formData.date ? "Select a date first" : isChecking ? "Checking..." : availableTimes.length === 0 ? "No times available" : "Select time"}
            </option>
            {availableTimes.map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>
      </div>

      {status === "error" && (
        <div style={{ color: "#B91C1C", backgroundColor: "#FEE2E2", padding: "12px", borderRadius: "8px", fontSize: "0.9rem", marginBottom: "16px" }}>
          {errorMsg}
        </div>
      )}

      <button type="submit" disabled={status === "loading" || !formData.time} className="btn-primary" style={{ width: "100%", padding: "16px" }}>
        {status === "loading" ? "Booking..." : "Confirm Booking"}
      </button>
    </form>
  );
}