// src/app/admin/layout.tsx
"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setLoading(false);
      } else {
        setUser(null);
        if (pathname !== "/admin/login") {
          router.push("/admin/login");
        }
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router, pathname]);

  if (loading) return <div style={{ padding: "50px", textAlign: "center" }}>Loading Admin...</div>;
  if (!user && pathname === "/admin/login") return <>{children}</>;
  if (!user) return null;

  const handleLogout = () => {
    signOut(auth);
    router.push("/admin/login");
  };

  const navItems = [
    { name: "Overview", path: "/admin" },
    { name: "Leads", path: "/admin/leads" },
    { name: "Bookings", path: "/admin/bookings" },
    { name: "Availability", path: "/admin/availability" },
    { name: "Services", path: "/admin/services" },
    { name: "Settings", path: "/admin/settings" },
  ];

  return (
    // Changed to 100vh and overflow hidden to lock the screen
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", backgroundColor: "#F3F4F6" }}>
      
      {/* Sidebar - Fixed height, no scroll */}
      <aside style={{ width: "260px", backgroundColor: "var(--secondary)", color: "white", display: "flex", flexDirection: "column", height: "100%" }}>
        <div style={{ padding: "30px 20px", borderBottom: "1px solid #374151" }}>
          <h2 style={{ fontSize: "1.5rem", fontFamily: "var(--font-heading)" }}>Zeravon<span className="text-primary">.</span></h2>
          <p style={{ fontSize: "0.8rem", color: "#9CA3AF", marginTop: "4px" }}>Admin Portal</p>
        </div>

        <nav style={{ flex: 1, padding: "20px 0", overflowY: "auto" }}>
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link 
                key={item.path} 
                href={item.path}
                style={{
                  display: "block",
                  padding: "12px 24px",
                  color: isActive ? "var(--secondary)" : "#D1D5DB",
                  backgroundColor: isActive ? "var(--primary)" : "transparent",
                  fontWeight: isActive ? 700 : 500,
                  marginBottom: "4px",
                  borderLeft: isActive ? "4px solid white" : "4px solid transparent"
                }}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: "20px", borderTop: "1px solid #374151" }}>
          <button onClick={handleLogout} style={{ width: "100%", padding: "10px", backgroundColor: "transparent", color: "#F87171", border: "1px solid #F87171", borderRadius: "6px", cursor: "pointer", fontWeight: 600 }}>
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area - Scrolls independently */}
      <main style={{ flex: 1, padding: "40px", overflowY: "auto", height: "100%" }}>
        {children}
      </main>
    </div>
  );
}