// src/app/contact/page.tsx
"use client";

import LeadForm from "@/components/LeadForm";
import BookingForm from "@/components/BookingForm";

export default function ContactPage() {
  return (
    <div style={{ backgroundColor: "var(--secondary)", minHeight: "100vh", color: "white", padding: "80px 0", position: "relative", overflow: "hidden" }}>
      
      <div style={{ position: "absolute", top: "10%", left: "-10%", width: "500px", height: "500px", background: "var(--primary)", filter: "blur(150px)", opacity: 0.1, borderRadius: "50%", pointerEvents: "none" }}></div>

      <div className="container" style={{ position: "relative", zIndex: 10 }}>
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", marginBottom: "16px", fontFamily: "var(--font-heading)" }}>
            Let's Build Your <span className="text-primary">Empire.</span>
          </h1>
          <p style={{ color: "#9CA3AF", fontSize: "1.1rem", maxWidth: "600px", margin: "0 auto" }}>
            Book a call instantly, or send us a message.
          </p>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "40px", alignItems: "flex-start" }}>
          
          {/* LEFT COLUMN: Native Booking Form */}
          <div id="booking" style={{ flex: "1 1 400px", scrollMarginTop: "100px" }}>
            <BookingForm />
          </div>

          {/* RIGHT COLUMN: The Lead Form */}
          <div id="message" style={{ flex: "1 1 400px", scrollMarginTop: "100px" }}>
            <div style={{ marginBottom: "20px" }}>
              <h2 style={{ fontSize: "1.5rem", fontFamily: "var(--font-heading)" }}>Or send us a message</h2>
              <p style={{ color: "#9CA3AF", fontSize: "0.95rem", marginTop: "8px", marginBottom: "20px" }}>
                Fill out the form below and we'll get back to you within 24 hours.
              </p>
            </div>
            <LeadForm />
          </div>

        </div>
      </div>
    </div>
  );
}