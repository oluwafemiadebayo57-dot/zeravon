// src/app/admin/login/page.tsx
"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin"); // Redirect to dashboard on success
    } catch (err: any) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "14px",
    borderRadius: "8px",
    border: "1px solid #E5E7EB",
    marginBottom: "20px",
    fontSize: "1rem",
    color: "#111",
    background: "#FFF"
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--bg-light)" }}>
      <div className="glass" style={{ padding: "40px", borderRadius: "16px", width: "100%", maxWidth: "400px" }}>
        <h1 style={{ textAlign: "center", marginBottom: "30px", color: "var(--secondary)" }}>
          Zeravon<span className="text-primary">.</span> Admin
        </h1>
        
        {error && <div style={{ backgroundColor: "#FEE2E2", color: "#B91C1C", padding: "12px", borderRadius: "8px", marginBottom: "20px", fontSize: "0.9rem" }}>{error}</div>}

        <form onSubmit={handleLogin}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={inputStyle} 
            placeholder="admin@zeravon.com"
          />
          
          <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={inputStyle} 
            placeholder="••••••••"
          />

          <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%", padding: "16px" }}>
            {loading ? "Authenticating..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
}