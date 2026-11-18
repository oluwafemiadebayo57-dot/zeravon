// src/app/admin/availability/page.tsx
"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy, serverTimestamp } from "firebase/firestore";
import { BlockedSlot } from "@/lib/types";
import { TIME_SLOTS } from "@/lib/constants";

export default function AvailabilityPage() {
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [date, setDate] = useState("");
  const [time, setTime] = useState("All Day");
  const [saving, setSaving] = useState(false);

  const fetchBlockedSlots = async () => {
    try {
      const q = query(collection(db, "blocked_slots"), orderBy("date", "asc"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BlockedSlot[];
      setBlockedSlots(data);
    } catch (error) {
      console.error("Error fetching blocks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlockedSlots();
  }, []);

  const handleBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;
    
    setSaving(true);
    try {
      await addDoc(collection(db, "blocked_slots"), {
        date,
        time,
        createdAt: serverTimestamp()
      });
      setDate("");
      setTime("All Day");
      fetchBlockedSlots();
    } catch (error) {
      alert("Error blocking time.");
    } finally {
      setSaving(false);
    }
  };

  const handleUnblock = async (id: string) => {
    if (!confirm("Remove this block? Clients will be able to book this time again.")) return;
    try {
      await deleteDoc(doc(db, "blocked_slots", id));
      setBlockedSlots(blockedSlots.filter(b => b.id !== id));
    } catch (error) {
      alert("Error unblocking time.");
    }
  };

  const inputStyle = {
    width: "100%", padding: "12px", borderRadius: "8px", 
    border: "1px solid #E5E7EB", fontSize: "0.95rem", 
    color: "#111", backgroundColor: "#FFF"
  };

  return (
    <div>
      <h1 style={{ fontSize: "2rem", color: "var(--secondary)", marginBottom: "30px" }}>Manage Availability</h1>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", alignItems: "start" }}>
        
        {/* Form to Block */}
        <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
          <h2 style={{ fontSize: "1.2rem", marginBottom: "20px", color: "var(--secondary)" }}>Block a Date or Time</h2>
          <p style={{ fontSize: "0.9rem", color: "#6B7280", marginBottom: "20px" }}>
            Block out holidays, lunch breaks, or times you are already booked externally.
          </p>
          
          <form onSubmit={handleBlock} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, fontSize: "0.9rem" }}>Date</label>
              <input required type="date" value={date} onChange={e => setDate(e.target.value)} style={inputStyle} min={new Date().toISOString().split("T")[0]} />
            </div>
            
            <div>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, fontSize: "0.9rem" }}>Time</label>
              <select value={time} onChange={e => setTime(e.target.value)} style={inputStyle}>
                <option value="All Day">All Day (Entire Date)</option>
                {TIME_SLOTS.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <button type="submit" disabled={saving} className="btn-primary" style={{ marginTop: "10px" }}>
              {saving ? "Blocking..." : "Block Time"}
            </button>
          </form>
        </div>

        {/* List of Blocks */}
        <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
          <h2 style={{ fontSize: "1.2rem", marginBottom: "20px", color: "var(--secondary)" }}>Blocked Times</h2>
          
          {loading ? <p>Loading...</p> : blockedSlots.length === 0 ? (
            <p style={{ color: "#6B7280", fontSize: "0.9rem" }}>You haven't blocked any times yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "400px", overflowY: "auto" }}>
              {blockedSlots.map(slot => (
                <div key={slot.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", backgroundColor: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: "8px" }}>
                  <div>
                    <strong style={{ color: "var(--secondary)" }}>{slot.date}</strong>
                    <span style={{ color: "#6B7280", marginLeft: "10px", fontSize: "0.9rem" }}>{slot.time}</span>
                  </div>
                  <button onClick={() => handleUnblock(slot.id!)} style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem" }}>
                    Unblock
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}