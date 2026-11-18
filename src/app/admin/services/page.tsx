// src/app/admin/services/page.tsx
"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { Service } from "@/lib/types";

const DEFAULT_SERVICES: Service[] = [
  {
    name: "Full Account Management",
    description: "End-to-end strategy, posting, and community engagement to build a loyal following.",
    price: "From $2,500/mo",
    features: ["Daily Posting", "Community Mgmt", "Monthly Strategy"],
    imageUrl: ""
  },
  {
    name: "Content Creation",
    description: "High-end graphics, short-form video, and copywriting that stops the scroll.",
    price: "From $1,500/mo",
    features: ["10 Reels/mo", "Graphic Design", "Copywriting"],
    imageUrl: ""
  },
  {
    name: "Paid Ads",
    description: "Data-driven ad campaigns that turn followers into paying customers.",
    price: "From $1,000/mo",
    features: ["Meta Ads", "TikTok Ads", "A/B Testing"],
    imageUrl: ""
  }
];

export default function ServicesAdminPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  
  const [formData, setFormData] = useState<Service>({
    name: "",
    description: "",
    price: "",
    features: [],
    imageUrl: "",
  });
  const [featuresInput, setFeaturesInput] = useState(""); 
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const CLOUDINARY_CLOUD_NAME = "izxlyyn5";
  const CLOUDINARY_UPLOAD_PRESET = "qol_asaph_unsigned";

  const fetchServices = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "services"));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Service[];
      setServices(data);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const seedDefaultServices = async () => {
    if (!confirm("This will copy the 3 default packages into your database so you can edit them. Continue?")) return;
    
    setSeeding(true);
    try {
      for (const service of DEFAULT_SERVICES) {
        await addDoc(collection(db, "services"), service);
      }
      await fetchServices();
      alert("Default services added! You can now edit them below.");
    } catch (error) {
      console.error("Error seeding data:", error);
      alert("Failed to add default services.");
    } finally {
      setSeeding(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: data,
      });
      const json = await res.json();
      setFormData((prev) => ({ ...prev, imageUrl: json.secure_url }));
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const featuresArray = featuresInput.split(",").map(f => f.trim()).filter(f => f !== "");

    const payload = {
      ...formData,
      features: featuresArray,
    };

    try {
      if (editingId) {
        const docRef = doc(db, "services", editingId);
        await updateDoc(docRef, payload);
        alert("Service updated successfully!");
      } else {
        await addDoc(collection(db, "services"), payload);
        alert("Service added successfully!");
      }
      
      resetForm();
      fetchServices();
    } catch (error) {
      console.error("Error saving service:", error);
      alert("Failed to save service.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (service: Service) => {
    setFormData(service);
    setFeaturesInput(service.features.join(", "));
    setEditingId(service.id!);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service? This will remove it from the public site.")) return;
    
    try {
      await deleteDoc(doc(db, "services", id));
      setServices(services.filter(s => s.id !== id));
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  const resetForm = () => {
    setFormData({ name: "", description: "", price: "", features: [], imageUrl: "" });
    setFeaturesInput("");
    setEditingId(null);
  };

  const inputStyle = {
    width: "100%", padding: "12px", borderRadius: "8px", 
    border: "1px solid #E5E7EB", marginBottom: "16px",
    fontSize: "0.95rem", color: "#111", backgroundColor: "#FFF"
  };

  return (
    <div>
      <h1 style={{ fontSize: "2rem", color: "var(--secondary)", marginBottom: "30px" }}>Manage Services</h1>
      
      {!loading && services.length === 0 && (
        <div style={{ backgroundColor: "#FEF08A", border: "1px solid #FDE047", padding: "24px", borderRadius: "12px", marginBottom: "30px", textAlign: "center" }}>
          <h3 style={{ fontSize: "1.2rem", color: "#854D0E", marginBottom: "8px" }}>Your database is empty!</h3>
          <p style={{ color: "#A16207", marginBottom: "16px", fontSize: "0.95rem" }}>
            Your website is currently showing default placeholder packages. Click below to import them into your database so you can edit them.
          </p>
          <button 
            onClick={seedDefaultServices} 
            disabled={seeding}
            className="btn-primary" 
            style={{ padding: "10px 20px", fontSize: "0.95rem" }}
          >
            {seeding ? "Importing..." : "Import Default Packages"}
          </button>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "30px" }}>
        
        {/* --- FORM SECTION --- */}
        <div style={{ 
          backgroundColor: "white", padding: "30px", borderRadius: "12px", 
          border: editingId ? "3px solid #FACC15" : "1px solid transparent",
          boxShadow: editingId ? "0 4px 20px rgba(250, 204, 21, 0.2)" : "0 2px 10px rgba(0,0,0,0.05)",
          transition: "all 0.3s ease"
        }}>
          <h2 style={{ fontSize: "1.3rem", marginBottom: "20px", color: "var(--secondary)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {editingId ? "Edit Service" : "Add New Service"}
            {editingId && (
              <span style={{ fontSize: "0.85rem", color: "#111", backgroundColor: "#FACC15", padding: "4px 10px", borderRadius: "20px", fontWeight: 700 }}>
                ✎ Edit Mode Active
              </span>
            )}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
              <div style={{ flex: "1 1 300px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, fontSize: "0.9rem" }}>Service Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={inputStyle} placeholder="e.g. Full Account Management" />
              </div>
              <div style={{ flex: "1 1 300px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, fontSize: "0.9rem" }}>Price</label>
                <input required type="text" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} style={inputStyle} placeholder="e.g. From $2,500/mo" />
              </div>
            </div>

            <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, fontSize: "0.9rem" }}>Description</label>
            <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ ...inputStyle, resize: "vertical" }} rows={3} placeholder="Describe the value of this package..." />

            <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, fontSize: "0.9rem" }}>Features (Comma separated)</label>
            <input required type="text" value={featuresInput} onChange={e => setFeaturesInput(e.target.value)} style={inputStyle} placeholder="Daily Posting, Community Mgmt, Monthly Strategy" />

            <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, fontSize: "0.9rem" }}>Cover Image (Optional)</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ ...inputStyle, padding: "8px" }} />
            {uploading && <p style={{ fontSize: "0.9rem", color: "var(--primary-hover)", marginBottom: "16px" }}>Uploading image...</p>}
            {formData.imageUrl && (
              <img src={formData.imageUrl} alt="Preview" style={{ height: "80px", borderRadius: "8px", objectFit: "cover", marginBottom: "16px", border: "1px solid #E5E7EB" }} />
            )}

            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button type="submit" disabled={submitting || uploading} className="btn-primary" style={{ flex: 1 }}>
                {submitting ? "Saving..." : editingId ? "Update Service" : "Add Service"}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className="btn-secondary" style={{ flex: 1 }}>
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        {/* --- LIST SECTION --- */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
          {loading ? (
            <p>Loading services...</p>
          ) : services.length === 0 ? (
            <p style={{ color: "#6B7280" }}>No services added yet. Use the form above to create your first package.</p>
          ) : (
            services.map(service => (
              <div key={service.id} style={{ 
                backgroundColor: "white", borderRadius: "12px", padding: "20px", 
                boxShadow: editingId === service.id ? "0 4px 20px rgba(250, 204, 21, 0.4)" : "0 2px 10px rgba(0,0,0,0.05)", 
                display: "flex", flexDirection: "column", 
                border: editingId === service.id ? "2px solid #FACC15" : "2px solid transparent" 
              }}>
                {service.imageUrl && (
                  <img src={service.imageUrl} alt={service.name} style={{ width: "100%", height: "140px", objectFit: "cover", borderRadius: "8px", marginBottom: "16px" }} />
                )}
                <h3 style={{ fontSize: "1.2rem", color: "var(--secondary)", marginBottom: "8px" }}>{service.name}</h3>
                <p style={{ color: "var(--primary-hover)", fontWeight: 700, marginBottom: "12px", fontSize: "1.1rem" }}>{service.price}</p>
                <p style={{ color: "#6B7280", fontSize: "0.9rem", marginBottom: "16px", flexGrow: 1 }}>{service.description}</p>
                
                <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
                  {/* HARDCODED COLORS FOR MAXIMUM VISIBILITY */}
                  <button 
                    onClick={() => handleEdit(service)} 
                    style={{ 
                      flex: 1, padding: "10px", 
                      backgroundColor: "#FACC15", color: "#111111", 
                      border: "none", borderRadius: "6px", fontWeight: 700, 
                      cursor: "pointer", transition: "0.2s",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                    }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(service.id!)} 
                    style={{ 
                      flex: 1, padding: "10px", 
                      backgroundColor: "#FEE2E2", color: "#B91C1C", 
                      border: "none", borderRadius: "6px", fontWeight: 700, 
                      cursor: "pointer", transition: "0.2s" 
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}