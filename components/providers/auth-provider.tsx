'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import type {
  SupabaseClient,
  User,
  AuthChangeEvent,
  Session,
} from '@supabase/supabase-js';

/**
 * Perfil de usuario extendido con información adicional de Supabase.
 */
export type Profile = {
  id: string;
  full_name: string;
  address: string;
  role: string;
};

type SupabaseContext = {
  supabase: SupabaseClient;
  user: User | null;
  profile: Profile | null;
};

const Context = createContext<SupabaseContext | undefined>(undefined);

/**
 * Proveedor de autenticación de Supabase.
 * Gestiona la sesión del usuario y carga el perfil correspondiente.
 */
export default function SupabaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [supabase] = useState(() => createClient());
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setProfile(userProfile);
      }
    };

    fetchSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (_event: AuthChangeEvent, session: Session | null) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          const { data: userProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          setProfile(userProfile as Profile);
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <Context.Provider value={{ supabase, user, profile }}>
      {children}
    </Context.Provider>
  );
}

/**
 * Gancho para acceder a la instancia de Supabase, el usuario y su perfil.
 * @throws Error si se usa fuera de un SupabaseProvider.
 */
export const useSupabase = () => {
  const context = useContext(Context);

  if (context === undefined) {
    throw new Error('useSupabase debe ser usado dentro de un SupabaseProvider');
  }

  return context;
};
