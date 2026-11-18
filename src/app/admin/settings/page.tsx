// src/app/admin/settings/page.tsx
"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { SiteSettings } from "@/lib/types";

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>({
    heroHeading: "",
    heroSubheading: "",
    aboutText: "",
    contactEmail: "",
    contactPhone: "",
    calendlyLink: "",
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, "settings", "main");
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setSettings(docSnap.data() as SiteSettings);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");

    try {
      // setDoc with merge:true will create the doc if it doesn't exist, or update fields if it does
      await setDoc(doc(db, "settings", "main"), settings, { merge: true });
      setSuccessMsg("Settings saved successfully!");
      
      // Clear message after 3 seconds
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "12px", borderRadius: "8px", 
    border: "1px solid #E5E7EB", marginBottom: "20px",
    fontSize: "0.95rem", color: "#111", backgroundColor: "#FFF",
    fontFamily: "var(--font-body)"
  };

  const labelStyle = {
    display: "block", marginBottom: "6px", fontWeight: 600, fontSize: "0.9rem", color: "var(--secondary)"
  };

  if (loading) return <div>Loading settings...</div>;

  return (
    <div>
      <h1 style={{ fontSize: "2rem", color: "var(--secondary)", marginBottom: "30px" }}>Site Settings</h1>
      
      <div style={{ backgroundColor: "white", padding: "40px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", maxWidth: "800px" }}>
        
        {successMsg && (
          <div style={{ backgroundColor: "#D1FAE5", color: "#065F46", padding: "12px", borderRadius: "8px", marginBottom: "20px", fontWeight: 600 }}>
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSave}>
          <h2 style={{ fontSize: "1.2rem", marginBottom: "16px", borderBottom: "1px solid #E5E7EB", paddingBottom: "10px" }}>Homepage Text</h2>
          
          <label style={labelStyle}>Hero Heading</label>
          <input required type="text" name="heroHeading" value={settings.heroHeading} onChange={handleChange} style={inputStyle} placeholder="We Scale Brands with High-Converting Social Media." />
          
          <label style={labelStyle}>Hero Subheading</label>
          <textarea required name="heroSubheading" value={settings.heroSubheading} onChange={handleChange} style={{ ...inputStyle, resize: "vertical" }} rows={3} placeholder="Stop blending in. Our bold strategies..." />

          <label style={labelStyle}>About Us Text (Used on the About page)</label>
          <textarea required name="aboutText" value={settings.aboutText} onChange={handleChange} style={{ ...inputStyle, resize: "vertical" }} rows={5} placeholder="Founded in 2024, Zeravon is..." />

          <h2 style={{ fontSize: "1.2rem", margin: "30px 0 16px 0", borderBottom: "1px solid #E5E7EB", paddingBottom: "10px" }}>Contact & Links</h2>

          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 300px" }}>
              <label style={labelStyle}>Contact Email</label>
              <input required type="email" name="contactEmail" value={settings.contactEmail} onChange={handleChange} style={inputStyle} placeholder="hello@zeravon.com" />
            </div>
            <div style={{ flex: "1 1 300px" }}>
              <label style={labelStyle}>Contact Phone</label>
              <input type="text" name="contactPhone" value={settings.contactPhone} onChange={handleChange} style={inputStyle} placeholder="+1 (555) 123-4567" />
            </div>
          </div>

          <label style={labelStyle}>Calendly / Booking Link</label>
          <input type="url" name="calendlyLink" value={settings.calendlyLink} onChange={handleChange} style={inputStyle} placeholder="https://calendly.com/your-name/30min" />

          <button type="submit" disabled={saving} className="btn-primary" style={{ width: "100%", padding: "16px", marginTop: "10px" }}>
            {saving ? "Saving Changes..." : "Save All Settings"}
          </button>
        </form>
      </div>
    </div>
  );
}