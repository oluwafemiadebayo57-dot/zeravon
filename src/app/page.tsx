// src/app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { Service, SiteSettings } from "@/lib/types";
import LeadForm from "@/components/LeadForm";

export default function Home() {
  const [services, setServices] = useState<Service[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  
  // NEW: State to track which package the user clicked
  const [selectedService, setSelectedService] = useState(""); 

  const defaultSettings: SiteSettings = {
    heroHeading: "We Scale Brands with High-Converting Social Media.",
    heroSubheading: "Stop blending in. Our bold strategies and data-driven management turn your social presence into a revenue engine.",
    aboutText: "",
    contactEmail: "",
    contactPhone: "",
    calendlyLink: "",
  };

  const fallbackServices = [
    { name: "Full Account Management", description: "End-to-end strategy, posting, and community engagement to build a loyal following.", price: "From $2,500/mo", features: ["Daily Posting", "Community Mgmt", "Monthly Strategy"], imageUrl: "" },
    { name: "Content Creation", description: "High-end graphics, short-form video, and copywriting that stops the scroll.", price: "From $1,500/mo", features: ["10 Reels/mo", "Graphic Design", "Copywriting"], imageUrl: "" },
    { name: "Paid Ads", description: "Data-driven ad campaigns that turn followers into paying customers.", price: "From $1,000/mo", features: ["Meta Ads", "TikTok Ads", "A/B Testing"], imageUrl: "" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 3000));

        await Promise.race([
          (async () => {
            const servicesSnap = await getDocs(collection(db, "services"));
            const servicesData = servicesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Service[];
            
            if (servicesData.length > 0) {
              setServices(servicesData);
            } else {
              setServices(fallbackServices);
            }

            const settingsSnap = await getDoc(doc(db, "settings", "main"));
            if (settingsSnap.exists()) {
              setSettings(settingsSnap.data() as SiteSettings);
            } else {
              setSettings(defaultSettings);
            }
          })(),
          timeout
        ]);
      } catch (error) {
        console.warn("Using fallback data due to connection issue:", error);
        setServices(fallbackServices);
        setSettings(defaultSettings);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // NEW: Function to handle clicking a package
  const handleSelectService = (serviceName: string) => {
    setSelectedService(serviceName);
    // Smooth scroll to the form
    document.getElementById("audit")?.scrollIntoView({ behavior: "smooth" });
  };

  if (loading || !settings) return <div style={{ padding: "100px", textAlign: "center", fontFamily: "var(--font-heading)" }}>Loading...</div>;

  return (
    <>
      {/* --- HERO SECTION --- */}
      <section className="section-padding" style={{ backgroundColor: "var(--secondary)", color: "white", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-20%", right: "-10%", width: "400px", height: "400px", background: "var(--primary)", filter: "blur(120px)", opacity: 0.15, borderRadius: "50%" }}></div>
        
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div className="glass-dark hero-card">
            <h1 style={{ fontSize: "clamp(2rem, 6vw, 4.5rem)", marginBottom: "20px", lineHeight: 1.05, letterSpacing: "-0.03em" }}>
              {settings.heroHeading.split(" ").map((word, i) => (
                 <span key={i} className={i >= 2 && i <= 3 ? "text-primary" : ""}>{word} </span>
              ))}
            </h1>
            <p style={{ fontSize: "clamp(1rem, 2vw, 1.25rem)", color: "#D1D5DB", marginBottom: "40px", maxWidth: "600px", lineHeight: 1.6 }}>
              {settings.heroSubheading}
            </p>
            <div className="hero-buttons" style={{ display: "flex", gap: "20px" }}>
              <a href="#audit" className="btn-primary btn-mobile-full" style={{ padding: "16px 32px" }}>Book a Free Audit</a>
              <a href="#services" className="btn-secondary btn-mobile-full" style={{ color: "white", borderColor: "#374151", padding: "16px 32px" }}>View Services</a>
            </div>
          </div>
        </div>
      </section>

      {/* --- TRUST BANNER --- */}
      <section style={{ backgroundColor: "var(--primary)", padding: "16px 0", color: "var(--secondary)", fontWeight: 700, fontFamily: "var(--font-heading)", textAlign: "center", overflow: "hidden" }}>
        <p style={{ fontSize: "clamp(0.9rem, 2vw, 1.1rem)", letterSpacing: "0.05em" }}>TRUSTED BY 50+ HIGH-GROWTH BRANDS & FOUNDERS</p>
      </section>

      {/* --- SERVICES SECTION --- */}
      <section id="services" className="section-padding" style={{ backgroundColor: "var(--bg-light)" }}>
        <div className="container">
          <div style={{ marginBottom: "60px" }}>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "var(--secondary)", marginBottom: "16px", letterSpacing: "-0.02em" }}>Our Packages</h2>
            <p style={{ color: "#6B7280", fontSize: "1.1rem", maxWidth: "600px" }}>
              Tailored strategies to fit your brand's unique goals. No fluff, just measurable growth.
            </p>
          </div>

          <div className="services-grid">
            {services.map((service, index) => (
              <div key={index} className="glass" style={{ padding: "clamp(24px, 4vw, 40px)", borderRadius: "16px", display: "flex", flexDirection: "column", borderTop: "4px solid var(--primary)" }}>
                <h3 style={{ fontSize: "1.5rem", marginBottom: "12px", color: "var(--secondary)" }}>{service.name}</h3>
                <p style={{ color: "#6B7280", marginBottom: "24px", flexGrow: 1, fontSize: "0.95rem" }}>{service.description}</p>
                <div style={{ marginBottom: "24px" }}>
                  {service.features.map((feature, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px", fontSize: "0.95rem" }}>
                      <span style={{ color: "var(--primary)", fontWeight: "bold" }}>✓</span> {feature}
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: "1.5rem", fontWeight: 700, fontFamily: "var(--font-heading)", color: "var(--secondary)", marginBottom: "20px" }}>
                  {service.price}
                </div>
                {/* CHANGED: Button triggers handleSelectService */}
                <button 
                  onClick={() => handleSelectService(service.name)}
                  className="btn-secondary btn-mobile-full" 
                  style={{ textAlign: "center", width: "100%", cursor: "pointer" }}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- LEAD CAPTURE SECTION --- */}
      <section id="audit" className="section-padding" style={{ backgroundColor: "var(--secondary)", position: "relative" }}>
        <div className="container">
          <div className="lead-grid">
            
            <div style={{ flex: "1 1 400px", color: "white" }}>
              <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", marginBottom: "20px", letterSpacing: "-0.02em" }}>
                Let's Build Your <br /> <span className="text-primary">Empire.</span>
              </h2>
              <p style={{ fontSize: "1.1rem", color: "#D1D5DB", marginBottom: "30px", lineHeight: 1.7 }}>
                Ready to stop guessing and start scaling? Request a free, no-obligation audit of your current social media presence. We'll provide actionable insights and show you exactly how we can help.
              </p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "16px" }}>
                <li style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "1rem" }}>
                  <span style={{ color: "var(--primary)", fontSize: "1.2rem" }}>✦</span> Deep dive into your current metrics
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "1rem" }}>
                  <span style={{ color: "var(--primary)", fontSize: "1.2rem" }}>✦</span> Competitor analysis
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "1rem" }}>
                  <span style={{ color: "var(--primary)", fontSize: "1.2rem" }}>✦</span> Custom 30-day growth plan
                </li>
              </ul>
            </div>

            <div style={{ flex: "1 1 400px" }}>
              {/* CHANGED: Pass the selected service to the form */}
              <LeadForm selectedService={selectedService} />
            </div>

          </div>
        </div>
      </section>
    </>
  );
}