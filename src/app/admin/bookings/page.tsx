// src/app/admin/bookings/page.tsx
import BookingsClient from "./BookingsClient";

// This works perfectly now because this is a Server Component
export const instant = false;

export default function Page() {
  return <BookingsClient />;
}