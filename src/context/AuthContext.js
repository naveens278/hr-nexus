import { createContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { getUserData } from "../firebase/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Basic state change listener
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // CRITICAL PERFORMANCE FIX: Move setLoading(false) here so the UI 
        // doesn't wait for Firestore profiles to render the dashboard
        setLoading(false);
        
        // Fetch extra data from Firestore in the background
        try {
          const result = await getUserData(currentUser.uid);
          if (result.success) {
            setUserData(result.data);
          }
        } catch (error) {
          console.error("Error fetching user data in background:", error);
        }
      } else {
        setUser(null);
        setUserData(null);
        setLoading(false);
      }
    });

    // Fallback: If for some reason Firebase doesn't respond in 10 seconds, 
    // stop the loading state so the user can at least try to login
    const timer = setTimeout(() => {
      setLoading(false);
    }, 10000);

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  const value = {
    user,
    userData,
    loading,
    setUserData,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};