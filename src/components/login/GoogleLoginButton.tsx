import Button from "@mui/material/Button";
import {GoogleIcon} from "../../theme/CustomIcons.js";

const GOOGLE_OAUTH_URL = "http://localhost:8080/oauth2/authorization/google";


function GoogleLoginButton() {
    return <>
        <Button
            fullWidth
            variant="outlined"
            onClick={() => window.location.href = GOOGLE_OAUTH_URL}
            startIcon={<GoogleIcon/>}
        >
            Kyçu me Google
        </Button>
    </>
}

export default GoogleLoginButton;