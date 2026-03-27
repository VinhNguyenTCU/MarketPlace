import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export default function GuestOnlyRoute() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function checkSession() {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        setIsAuthenticated(true);
      }

      setLoading(false);
    }

    checkSession();

    // Also listen for changes (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <div />;   // loading spinner (in the future)
  }

  // If logged in → redirect them to the home page
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Otherwise allow access to the page
  return <Outlet />;
}
