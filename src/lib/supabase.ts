import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

// Ambil kredensial dari environment variable Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    !supabaseUrl.includes('your-project-ref')
  );
};

// Buat client Supabase singleton
// Jika environment belum diisi dengan benar, gunakan dummy URL yang valid agar tidak crash
export const supabase: SupabaseClient = createClient(
  isSupabaseConfigured() ? (supabaseUrl as string) : 'https://placeholder.supabase.co',
  isSupabaseConfigured() ? (supabaseAnonKey as string) : 'placeholder-key',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

// Helper untuk mengecek konektivitas database saat runtime
export const checkSupabaseConnection = async (): Promise<boolean> => {
  if (!isSupabaseConfigured()) {
    return false;
  }
  try {
    const { error } = await supabase.from('invoices').select('id').limit(1);
    // Jika tidak ada error atau error bukan masalah jaringan/offline
    if (!error) return true;
    console.warn('Supabase ping status:', error.message);
    return false;
  } catch (err) {
    console.warn('Supabase offline / unreachable, falling back to LocalStorage:', err);
    return false;
  }
};
