import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const useAuth = (onAuthComplete: () => void) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = async () => {
      const authResult = !!Cookies.get("publicKeyPem");
      setIsAuthenticated(authResult);

      if (!authResult) {
        navigate("/logon");
      } else {
        onAuthComplete();
      }
    };

    checkAuth();
  }, [navigate, onAuthComplete]);

  return isAuthenticated;
};

export default useAuth;
