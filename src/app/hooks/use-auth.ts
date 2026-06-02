import { useEffect, useState } from "react";

export interface FakeUser {
  id: string;
  email: string;
  user_metadata: { name: string };
}

export function useAuth() {
  const [user, setUser] = useState<FakeUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("cuidamais_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData: FakeUser) => {
    localStorage.setItem("cuidamais_user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("cuidamais_user");
    setUser(null);
    window.location.href = "/";
  };

  return {
    session: user ? { user } : null,
    user,
    loading,
    login,
    logout,
  };
}