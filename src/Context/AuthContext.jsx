import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

// Make sure "export" is written right here before function!
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedSession = localStorage.getItem("active_user_session");
    if (savedSession) {
      setUser(JSON.parse(savedSession));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const savedUserRaw = localStorage.getItem(`user_${email}`);
    if (!savedUserRaw) throw new Error("No account found with this email.");

    const savedUserData = JSON.parse(savedUserRaw);
    if (savedUserData.password !== password) throw new Error("Incorrect password.");

    const sessionData = { name: savedUserData.username, email: savedUserData.email };
    setUser(sessionData);
    localStorage.setItem("active_user_session", JSON.stringify(sessionData));
    return sessionData;
  };

  const signup = (username, email, password) => {
    const newUserData = { username, email, password };
    localStorage.setItem(`user_${email}`, JSON.stringify(newUserData));
    
    const sessionData = { name: username, email: email };
    setUser(sessionData);
    localStorage.setItem("active_user_session", JSON.stringify(sessionData));
    return sessionData;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("active_user_session");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
