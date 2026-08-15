import { createClient } from "@supabase/supabase-js";

// Afriframe booking backend (shared with the Afriframe CMS).
// URL + anon (publishable) key are safe in browser code — RLS protects the data.
const AFRIFRAME_SUPABASE_URL = "https://cylydjfpqmhzkcsipvmm.supabase.co";
const AFRIFRAME_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5bHlkamZwcW1oemtjc2lwdm1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU1ODUzODYsImV4cCI6MjEwMTE2MTM4Nn0.dZWZ78kuYcJowPq7IhJ6XRmdz0vnI50ywDiw6CAxejA";

export const afriframe = createClient(
  AFRIFRAME_SUPABASE_URL,
  AFRIFRAME_SUPABASE_ANON_KEY,
  {
    auth: { persistSession: false, autoRefreshToken: false },
  }
);

export type DbService = {
  id: string;
  name: string;
  category: string | null;
  description: string | null;
  short_description: string | null;
  cover_image_url: string | null;
  duration_minutes: number | null;
  price: number | null;
  display_order: number | null;
  featured: boolean | null;
  booking_enabled: boolean | null;
  active: boolean | null;
};

export type DbAvailability = {
  id: string;
  date: string;
  available: boolean;
  max_bookings: number | null;
  notes: string | null;
  time_slots: string[] | null;
};
