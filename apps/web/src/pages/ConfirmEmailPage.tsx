import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import  Box  from "@mui/material/Box";
import { Typography } from "@mui/material";
import  TextField  from "@mui/material/TextField";
import { Button } from "../components/ui/Button";
import { Link, useNavigate }  from "react-router-dom";
import { resetlink } from "../service/auth.service";


export default function ConfirmEmailPage() {
    const [email,setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const theme = useTheme();
    const heroGradient = `linear-gradient(90deg, ${theme.custom.hero.from}, ${theme.custom.hero.to})`;

    const handleContinue = async () => {
            if(!email) {
                setError("Please enter your email");
                return;
            }
        

        setLoading(true);
        setError("");

        try {
            await resetlink(email);
            localStorage.setItem("resetEmail",email);
            localStorage.setItem("isRecovery","true");
            console.log("isRecovery set:", localStorage.getItem("isRecovery"));
            navigate("/confirmation-link");
        } catch(error) {
            const errorMessage = error instanceof Error? error.message : "Failed to resend message";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    return(
    <Box
        sx= {{
            flex: 1,
            width: "100%",
            minHeight: 0,
            display: "flex",
            background: heroGradient,
            flexDirection: { xs: "column", md: "row" },
            pl: { xs: 1, md: 40 },
        }}
    >
        <Box
          sx={{
            flex: { md: "0 0 50%" },
            p: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
            <Box
              sx={{
                width: "100%",
                maxWidth: 380,
                bgcolor: "background.paper",
                borderRadius: 2,
                border: "1px solid",
                borderColor: theme.palette.primary.dark,
                p: 3,
                boxShadow: 2,
              }}
            >
                <Typography
                    variant="body1"
                    component={Link}
                    to="/sign-in"
                    color="textSecondary"
                    sx = {{
                        textDecoration: "none",
                        "&:hover": {textDecoration: "underline"},
                    }}
                >
                    Back to sign in
                </Typography>
                <Typography
                    sx = {{
                        mt:1,
                    }}
                >
                    Enter your email to receive confirmation link
                </Typography>
                <TextField
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    fullWidth
                    sx = {{mt : 2}}
                    error={!!error}
                    helperText = {error}
                ></TextField>
                    <Button
                        type="submit"
                        fullWidth
                        onClick={handleContinue}
                        disabled = {loading || !email}
                        sx={{
                            mt:2,
                        }}
                    >
                        {loading? "Sending..." : "Continue"}
                    </Button>
            </Box>

        </Box>

    </Box>
    )
}
