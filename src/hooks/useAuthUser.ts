import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export function useAuthUser() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // İlk yüklemede mevcut session'ı al
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    // Login/logout dinle
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return user;
}
