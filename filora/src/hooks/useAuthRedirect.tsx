// src/hooks/useAuthRedirect.tsx
import { useEffect } from "react";
import localforage from "localforage";
import { useNavigate } from "react-router-dom";

/**
 * ✅ Custom hook to check login status from localForage.
 * Redirects to /welcome if not logged in.
 */
export default function useAuthRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const isLoggedIn = await localforage.getItem("is_login");

        // ⚠️ Agar "is_login" nahi mila ya false hai
        if (!isLoggedIn) {
          navigate("/welcome", { replace: true });
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        navigate("/welcome", { replace: true });
      }
    };

    checkLogin();
  }, [navigate]);
}
