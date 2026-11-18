// src/app/ClientLayoutWrapper.tsx
"use client";

import { useState, useEffect, Suspense } from "react"; 
import Link from "next/link";
import { usePathname } from "next/navigation";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [year, setYear] = useState<number | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const isAdminRoute = pathname?.startsWith("/admin");
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const logoUrl = "https://res.cloudinary.com/psxqnwx2/image/upload/f_auto,q_auto/IMG_2208";

  return (
    <>
      {!isAdminRoute && (
        <header className="glass" style={{ position: "sticky", top: 0, zIndex: 100, width: "100%" }}>
          <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: "80px" }}>
            
            <Link href="/" style={{ display: "flex", alignItems: "center", zIndex: 110 }}>
              <img src={logoUrl} alt="Zeravon" style={{ height: "40px", width: "auto" }} />
            </Link>

            <nav style={{ display: "none", gap: "2rem", alignItems: "center" }} className="desktop-nav">
              <Link href="/services" style={{ fontWeight: 600 }}>Services</Link>
              <Link href="/about" style={{ fontWeight: 600 }}>About</Link>
              <Link href="/contact" style={{ fontWeight: 600 }}>Contact</Link>
              <Link href="/contact" className="btn-primary" style={{ padding: "10px 20px" }}>Get Started</Link>
            </nav>

            <button 
              onClick={toggleMenu} 
              style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", width: "40px", height: "40px", cursor: "pointer", zIndex: 110 }}
              className="mobile-toggle"
              aria-label="Toggle Menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d={isMenuOpen ? "M6 18L18 6M6 6L18 18" : "M4 6H20M4 12H20M4 18H20"} stroke="var(--secondary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {isMenuOpen && (
            <div style={{
              position: "fixed", top: "80px", left: 0, width: "100%", height: "calc(100vh - 80px)",
              backgroundColor: "var(--bg-light)", display: "flex", flexDirection: "column", 
              padding: "40px 24px", gap: "24px", zIndex: 90
            }}>
              <Link href="/services" style={{ fontSize: "2rem", fontFamily: "var(--font-heading)", fontWeight: 700, borderBottom: "2px solid #E5E7EB", paddingBottom: "16px" }}>Services</Link>
              <Link href="/about" style={{ fontSize: "2rem", fontFamily: "var(--font-heading)", fontWeight: 700, borderBottom: "2px solid #E5E7EB", paddingBottom: "16px" }}>About</Link>
              <Link href="/contact" style={{ fontSize: "2rem", fontFamily: "var(--font-heading)", fontWeight: 700, borderBottom: "2px solid #E5E7EB", paddingBottom: "16px" }}>Contact</Link>
              
              <div style={{ marginTop: "auto", paddingBottom: "40px" }}>
                <Link href="/contact" className="btn-primary btn-mobile-full" style={{ padding: "20px", fontSize: "1.2rem" }}>
                  Get Started
                </Link>
              </div>
            </div>
          )}
        </header>
      )}

      <main style={{ minHeight: "calc(100vh - 80px)" }}>
        {children}
      </main>

      {!isAdminRoute && (
        <footer className="footer-wrapper">
          <div style={{ 
            position: "absolute", bottom: "-20%", left: "50%", transform: "translateX(-50%)", 
            width: "600px", height: "300px", background: "var(--primary)", 
            filter: "blur(150px)", opacity: 0.15, borderRadius: "50%", pointerEvents: "none" 
          }}></div>

          <div className="container">
            
            {/* HIDE FOOTER CTA ON CONTACT PAGE */}
            {pathname !== "/contact" && (
              <div className="footer-cta">
                <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontFamily: "var(--font-heading)", lineHeight: 1.1, marginBottom: "12px", letterSpacing: "-0.03em" }}>
                  Ready to stop blending in?
                </h2>
                <p style={{ color: "#9CA3AF", fontSize: "0.95rem", maxWidth: "400px", margin: "0 auto 20px" }}>
                  Let's turn your social media into a revenue engine.
                </p>
                <Link href="/contact" className="btn-primary" style={{ padding: "12px 28px", fontSize: "0.95rem" }}>
                  Let's Talk
                </Link>
              </div>
            )}

            <div className="footer-grid" style={{ paddingTop: pathname === "/contact" ? "60px" : "40px" }}>
              <div className="footer-brand-col">
                <div style={{ backgroundColor: "white", padding: "6px 12px", borderRadius: "6px", display: "inline-block", marginBottom: "12px" }}>
                  <img src={logoUrl} alt="Zeravon Logo" style={{ height: "28px", width: "auto", objectFit: "contain" }} />
                </div>
                <p style={{ color: "#9CA3AF", fontSize: "0.85rem", lineHeight: 1.5, maxWidth: "280px" }}>
                  High-end social media management for brands looking to scale. Bold strategies, real results.
                </p>
              </div>
              
              <div className="footer-col">
                <h4 style={{ color: "white", fontSize: "0.95rem", fontFamily: "var(--font-heading)", marginBottom: "4px" }}>Explore</h4>
                <Link href="/" className="footer-link">Home</Link>
                <Link href="/services" className="footer-link">Services</Link>
                <Link href="/about" className="footer-link">About</Link>
                <Link href="/contact" className="footer-link">Contact</Link>
              </div>

              <div className="footer-col">
                <h4 style={{ color: "white", fontSize: "0.95rem", fontFamily: "var(--font-heading)", marginBottom: "4px" }}>Connect</h4>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="footer-link">Instagram ↗</a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="footer-link">LinkedIn ↗</a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="footer-link">Twitter / X ↗</a>
                <a href="mailto:info@zeravon.org" className="footer-link text-primary" style={{ fontWeight: 600 }}>info@zeravon.org</a>
              </div>
            </div>

            <div className="footer-bottom">
              <p>© {year || 2024} Zeravon Agency.</p>
              <div style={{ display: "flex", gap: "16px" }}>
                <Link href="#" className="footer-link">Privacy</Link>
                <Link href="#" className="footer-link">Terms</Link>
              </div>
            </div>
          </div>
        </footer>
      )}

      <style jsx global>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </>
  );
}

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", backgroundColor: "var(--bg-light)" }}></div>}>
      <LayoutContent>{children}</LayoutContent>
    </Suspense>
  );
}