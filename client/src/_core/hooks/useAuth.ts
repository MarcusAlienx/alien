import { useEffect } from "react";
import { useAuthContext } from "@/contexts/AuthContext";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

export function useAuth(options?: UseAuthOptions) {
  const { redirectOnUnauthenticated = false, redirectPath = "/" } = options ?? {};
  const auth = useAuthContext();

  useEffect(() => {
    if (!redirectOnUnauthenticated) return;
    if (auth.loading) return;
    if (auth.user) return;
    if (typeof window === "undefined") return;
    if (window.location.pathname === redirectPath) return;

    window.location.href = redirectPath;
  }, [
    redirectOnUnauthenticated,
    redirectPath,
    auth.loading,
    auth.user,
  ]);

  return auth;
}
