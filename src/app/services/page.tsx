// src/app/services/page.tsx
"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Service } from "@/lib/types";
import Link from "next/link";

const fallbackServices: Service[] = [
  { name: "Full Account Management", description: "End-to-end strategy, posting, and community engagement to build a loyal following.", price: "From $2,500/mo", features: ["Daily Posting", "Community Mgmt", "Monthly Strategy"], imageUrl: "" },
  { name: "Content Creation", description: "High-end graphics, short-form video, and copywriting that stops the scroll.", price: "From $1,500/mo", features: ["10 Reels/mo", "Graphic Design", "Copywriting"], imageUrl: "" },
  { name: "Paid Ads", description: "Data-driven ad campaigns that turn followers into paying customers.", price: "From $1,000/mo", features: ["Meta Ads", "TikTok Ads", "A/B Testing"], imageUrl: "" },
];

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>(fallbackServices);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "services"));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Service[];
        if (data.length > 0) setServices(data);
      } catch (error) {
        console.warn("Using fallback services due to connection issue.");
      }
    };
    fetchServices();
  }, []);

  return (
    <>
      <section style={{ backgroundColor: "var(--secondary)", color: "white", padding: "80px 0", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-20%", right: "-10%", width: "400px", height: "400px", background: "var(--primary)", filter: "blur(150px)", opacity: 0.15, borderRadius: "50%", pointerEvents: "none" }}></div>
        
        <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", marginBottom: "20px", fontFamily: "var(--font-heading)" }}>
            Our <span className="text-primary">Packages</span>
          </h1>
          <p style={{ color: "#9CA3AF", fontSize: "1.1rem", maxWidth: "600px", margin: "0 auto" }}>
            Tailored strategies to fit your brand's unique goals. No fluff, just measurable growth.
          </p>
        </div>
      </section>

      <section className="section-padding" style={{ backgroundColor: "var(--bg-light)" }}>
        <div className="container">
          <div className="services-grid">
            {services.map((service, index) => (
              <div key={index} className="glass" style={{ padding: "clamp(24px, 4vw, 40px)", borderRadius: "16px", display: "flex", flexDirection: "column", borderTop: "4px solid var(--primary)" }}>
                {service.imageUrl && (
                  <img src={service.imageUrl} alt={service.name} style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "8px", marginBottom: "20px" }} />
                )}
                <h3 style={{ fontSize: "1.5rem", marginBottom: "12px", color: "var(--secondary)" }}>{service.name}</h3>
                <p style={{ color: "#6B7280", marginBottom: "24px", flexGrow: 1, fontSize: "0.95rem" }}>{service.description}</p>
                
                <div style={{ marginBottom: "24px" }}>
                  {service.features.map((feature, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px", fontSize: "0.95rem", color: "var(--text-dark)" }}>
                      <span style={{ color: "var(--primary)", fontWeight: "bold" }}>✓</span> {feature}
                    </div>
                  ))}
                </div>
                
                <div style={{ fontSize: "1.5rem", fontWeight: 700, fontFamily: "var(--font-heading)", color: "var(--secondary)", marginBottom: "20px" }}>
                  {service.price}
                </div>
                
                <Link href="/contact" className="btn-secondary btn-mobile-full" style={{ textAlign: "center" }}>
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}