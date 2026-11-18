// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import ClientLayoutWrapper from "./ClientLayoutWrapper";

export const metadata: Metadata = {
  title: "Zeravon | Social Media Management Agency",
  description: "High-end social media management for brands looking to scale. Bold strategies, real results.",
  icons: {
    icon: "https://res.cloudinary.com/psxqnwx2/image/upload/f_auto,q_auto/IMG_2208",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* 
        suppressHydrationWarning is added here to prevent errors 
        caused by browser extensions (like ColorZilla) injecting attributes 
        into the body tag before React loads.
      */}
      <body suppressHydrationWarning={true}>
        <ClientLayoutWrapper>
          {children}
        </ClientLayoutWrapper>
      </body>
    </html>
  );
}