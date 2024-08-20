import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const isAuthenticated = (): boolean => {
    return !!localStorage.getItem("isLoggedIn")
}

const useAuth = () => {
    const navigate = useNavigate()

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate("/logon", { replace: true })
        }
    }, [navigate])

    return isAuthenticated()
}

export default useAuth