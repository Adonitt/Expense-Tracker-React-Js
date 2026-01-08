import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

function OAuthSuccess() {
    const navigate = useNavigate()

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const token = params.get("token")
        if (token) {
            localStorage.setItem("token", token)
            navigate("/")
        } else {
            navigate("/login")
        }
    }, [])

    return <p>Logging in...</p>
}

export default OAuthSuccess;