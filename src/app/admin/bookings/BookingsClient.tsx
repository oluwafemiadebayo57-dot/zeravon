// src/app/admin/bookings/BookingsClient.tsx
"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, doc, updateDoc } from "firebase/firestore";
import { Booking } from "@/lib/types";

export default function BookingsClient() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Booking[];
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id: string, newStatus: "Pending" | "Confirmed" | "Cancelled") => {
    try {
      await updateDoc(doc(db, "bookings", id), { status: newStatus });
      setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
    } catch (error) {
      alert("Error updating status.");
    }
  };

  if (loading) return <div style={{ padding: "20px" }}>Loading bookings...</div>;

  return (
    <div>
      <h1 style={{ fontSize: "2rem", color: "var(--secondary)", marginBottom: "30px" }}>Booked Calls</h1>
      
      <div style={{ backgroundColor: "white", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: "800px" }}>
          <thead style={{ backgroundColor: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
            <tr>
              <th style={{ padding: "16px", fontWeight: 600, color: "#4B5563" }}>Date & Time</th>
              <th style={{ padding: "16px", fontWeight: 600, color: "#4B5563" }}>Client</th>
              <th style={{ padding: "16px", fontWeight: 600, color: "#4B5563" }}>Contact</th>
              <th style={{ padding: "16px", fontWeight: 600, color: "#4B5563" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: "40px", textAlign: "center", color: "#6B7280" }}>No calls booked yet.</td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr key={b.id} style={{ borderBottom: "1px solid #F3F4F6" }}>
                  <td style={{ padding: "16px", fontWeight: 600, color: "var(--secondary)" }}>
                    {b.date} <br/><span style={{ color: "var(--primary-hover)", fontSize: "0.9rem" }}>{b.time}</span>
                  </td>
                  <td style={{ padding: "16px" }}>
                    <div style={{ fontWeight: 600 }}>{b.name}</div>
                    <div style={{ color: "#6B7280", fontSize: "0.9rem" }}>{b.company || "N/A"}</div>
                  </td>
                  <td style={{ padding: "16px", color: "#4B5563" }}>{b.email}</td>
                  <td style={{ padding: "16px" }}>
                    <select 
                      value={b.status} 
                      onChange={(e) => updateStatus(b.id!, e.target.value as any)}
                      style={{
                        padding: "8px", borderRadius: "6px", border: "1px solid #E5E7EB", fontWeight: 600,
                        backgroundColor: b.status === "Pending" ? "#FEF08A" : b.status === "Confirmed" ? "#D1FAE5" : "#FEE2E2",
                        color: b.status === "Pending" ? "#854D0E" : b.status === "Confirmed" ? "#065F46" : "#B91C1C"
                      }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}