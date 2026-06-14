import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { auth, loginWithGoogle, logoutGoogle } from "../_core/firebase";
import { trpc } from "@/lib/trpc";
import { TRPCClientError } from "@trpc/client";

interface AuthContextType {
  user: any;
  loading: boolean;
  error: any;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const utils = trpc.useUtils();
  const syncFirebaseUserMutation = trpc.auth.syncFirebaseUser.useMutation();

  const meQuery = trpc.auth.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      utils.auth.me.setData(undefined, null);
    },
  });

  useEffect(() => {
    return auth.onAuthStateChanged(async (user) => {
      setFirebaseUser(user);
      if (user) {
        await syncFirebaseUserMutation.mutateAsync({
          token: await user.getIdToken(),
          email: user.email,
          name: user.displayName,
          avatarUrl: user.photoURL,
        });
        utils.auth.me.invalidate();
      }
    });
  }, [utils]);

  const logout = async () => {
    try {
      await logoutGoogle();
      await logoutMutation.mutateAsync();
    } catch (error) {
      if (error instanceof TRPCClientError && error.data?.code === "UNAUTHORIZED") {
        return;
      }
      throw error;
    } finally {
      utils.auth.me.setData(undefined, null);
      await utils.auth.me.invalidate();
    }
  };

  const login = async () => {
    try {
      await loginWithGoogle();
    } catch (e) {
      console.error(e);
    }
  };

  const combinedUser = meQuery.data ?? null;
  const loading = meQuery.isLoading || logoutMutation.isPending || syncFirebaseUserMutation.isPending;

  return (
    <AuthContext.Provider value={{
      user: combinedUser,
      loading,
      error: meQuery.error ?? logoutMutation.error ?? null,
      isAuthenticated: Boolean(combinedUser),
      login,
      logout,
      refresh: () => meQuery.refetch(),
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthContext must be used within an AuthProvider");
  return context;
};
