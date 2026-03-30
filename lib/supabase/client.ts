import { createBrowserClient } from '@supabase/ssr';

// Create a singleton instance of the client.
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    global: {
      fetch: (url, options) =>
        fetch(url, { ...options, signal: AbortSignal.timeout(10_000) }),
    },
  }
);

export function createClient() {
  return supabase;
}
