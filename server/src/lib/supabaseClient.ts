import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY; // Or SUPABASE_SERVICE_KEY if you choose to use it

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabase URL or anon key is missing. Make sure to set SUPABASE_URL and SUPABASE_ANON_KEY in your .env file.'
  );
}

// Note: For server-side operations, especially those requiring admin privileges
// or bypassing RLS (Row Level Security), you would typically use the service_role key.
// For simple token verification (auth.getUser(token)), the anon key is often sufficient
// if your RLS policies allow it or if you're not interacting with data that RLS protects.
// If you encounter permission issues with RLS, consider using the service_role key.
// const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
// export const supabase = createClient(supabaseUrl, supabaseServiceKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
