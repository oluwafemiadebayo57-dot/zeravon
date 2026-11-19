// src/app/about/page.tsx
"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { SiteSettings } from "@/lib/types";
import Link from "next/link";

export default function AboutPage() {
  const [aboutText, setAboutText] = useState("Zeravon was founded on a simple principle: social media should drive revenue, not just likes. We are a collective of strategists, designers, and copywriters who are obsessed with scaling high-growth brands. We don't do 'fluff'—we do bold, data-driven campaigns that turn followers into paying customers.");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, "settings", "main");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as SiteSettings;
          if (data.aboutText) setAboutText(data.aboutText);
        }
      } catch (error) {
        console.warn("Using default about text due to connection issue.");
      }
    };
    fetchSettings();
  }, []);

  return (
    <>
      <section style={{ backgroundColor: "var(--secondary)", color: "white", padding: "80px 0", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-20%", left: "-10%", width: "400px", height: "400px", background: "var(--primary)", filter: "blur(150px)", opacity: 0.15, borderRadius: "50%", pointerEvents: "none" }}></div>
        
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div className="glass-dark" style={{ padding: "clamp(30px, 5vw, 60px)", borderRadius: "24px", maxWidth: "800px" }}>
            <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", marginBottom: "24px", fontFamily: "var(--font-heading)", lineHeight: 1.1 }}>
              We Don't Do <span className="text-primary">Average.</span>
            </h1>
            <p style={{ color: "#D1D5DB", fontSize: "1.1rem", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
              {aboutText}
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding" style={{ backgroundColor: "var(--bg-light)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2 style={{ fontSize: "2.5rem", color: "var(--secondary)", marginBottom: "16px" }}>The Zeravon Difference</h2>
            <p style={{ color: "#6B7280", fontSize: "1.1rem", maxWidth: "600px", margin: "0 auto" }}>
              We act as an extension of your team, not just an external vendor.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "30px" }}>
            <div className="glass" style={{ padding: "40px", borderRadius: "16px", textAlign: "center" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "16px" }}>📈</div>
              <h3 style={{ fontSize: "1.3rem", color: "var(--secondary)", marginBottom: "12px" }}>Data-Driven</h3>
              <p style={{ color: "#6B7280", fontSize: "0.95rem" }}>We don't guess. Every strategy is built on analytics, market research, and competitor audits.</p>
            </div>
            
            <div className="glass" style={{ padding: "40px", borderRadius: "16px", textAlign: "center" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "16px" }}>🎨</div>
              <h3 style={{ fontSize: "1.3rem", color: "var(--secondary)", marginBottom: "12px" }}>High-End Design</h3>
              <p style={{ color: "#6B7280", fontSize: "0.95rem" }}>Your brand will look premium. We combine striking visuals with copy that actually converts.</p>
            </div>

            <div className="glass" style={{ padding: "40px", borderRadius: "16px", textAlign: "center" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "16px" }}>🚀</div>
              <h3 style={{ fontSize: "1.3rem", color: "var(--secondary)", marginBottom: "12px" }}>Built to Scale</h3>
              <p style={{ color: "#6B7280", fontSize: "0.95rem" }}>We are obsessed with growth. From ad spend to organic reach, we optimize for maximum ROI.</p>
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: "80px" }}>
            <h2 style={{ fontSize: "2rem", color: "var(--secondary)", marginBottom: "20px" }}>Ready to scale your brand?</h2>
            <Link href="/contact" className="btn-primary" style={{ padding: "16px 40px", fontSize: "1.1rem" }}>
              Let's Talk
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}