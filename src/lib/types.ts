// src/lib/types.ts

export interface Service {
  id?: string;
  name: string;
  description: string;
  price: string;
  features: string[];
  imageUrl: string;
}

export interface Lead {
  id?: string;
  name: string;
  email: string;
  company: string;
  website?: string;
  message: string;
  status: "New" | "Contacted" | "Closed";
  createdAt?: any;
  
  // Audit Fields
  auditStatus?: "Not Started" | "Drafting" | "Sent";
  auditText?: string;
}

export interface CaseStudy {
  id?: string;
  clientName: string;
  metrics: string;
  description: string;
  imageUrl: string;
}

export interface SiteSettings {
  heroHeading: string;
  heroSubheading: string;
  aboutText: string;
  contactEmail: string;
  contactPhone: string;
  calendlyLink: string;
}

export interface Booking {
  id?: string;
  name: string;
  email: string;
  company?: string;
  date: string;
  time: string;
  status: "Pending" | "Confirmed" | "Cancelled";
  createdAt?: any;
}

// src/lib/types.ts

// ... existing interfaces ...

export interface Lead {
  id?: string;
  name: string;
  email: string;
  company: string;
  website?: string;
  message: string;
  serviceInterest?: string; // <-- ADD THIS
  status: "New" | "Contacted" | "Closed";
  createdAt?: any;
  auditStatus?: "Not Started" | "Drafting" | "Sent";
  auditText?: string;
}

// src/lib/types.ts
// ... (keep everything else)

export interface BlockedSlot {
  id?: string;
  date: string;
  time: string; // "All Day" or specific time like "10:00 AM"
  createdAt?: any;
}


export interface Lead {
  id?: string;
  name: string;
  email: string;
  company: string;
  website?: string;
  message: string;
  serviceInterest?: string;
  status: "New" | "Audit Sent" | "Call Booked" | "Proposal Sent" | "Won" | "Lost";
  createdAt?: any;
  
  auditStatus?: "Not Started" | "Drafting" | "Sent";
  auditText?: string;
  proposalLink?: string; // <-- NEW
}