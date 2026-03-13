import { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import  Box  from "@mui/material/Box";
import { Typography } from "@mui/material";
import { Button } from "../components/ui/Button";
import { Link, useNavigate }  from "react-router-dom";
import { supabase } from "../lib/supabase";

const maskEmail = (email:string) => {
    const[username,domain] = email.split('@');
    const visiblePart = email.slice(0,3);
    const maskedpart = '*'.repeat(username.length-3);
    return `${visiblePart}${maskedpart}@${domain}`;
}

export default function ConfirmationLink() {
    const theme = useTheme();
    const [countdown, setCountDown] = useState(60);
    const navigate = useNavigate();
    const email = localStorage.getItem("resetEmail");
    const heroGradient = `linear-gradient(90deg, ${theme.custom.hero.from}, ${theme.custom.hero.to})`;
    useEffect(() => {
        if(!email) {
            navigate("/confirm-email");
        }
    },[email,navigate]);
    
    useEffect(() => {
        if(countdown > 0) {
            const timer = setTimeout(()=>setCountDown(countdown-1),1000);
            return() => clearTimeout(timer);
        }
    },[countdown]);

    const handleResend = async () => {
        if(!email) {
            console.error("No email found");
            return;
        }
        setCountDown(60);
            
        try {
            await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/change-password`,
            });
        } catch (error) {
            console.error("Failed to resend email:",error);
        }
    };

    if(!email) {
        return null;
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
                        variant="body2"
                        component={Link}
                        to="/sign-in"
                        color="textSecondary"
                        sx = {{
                            textDecoration:"none",
                            "&:hover":{textDecoration:"underline"},      
                        }}
                    >
                        Back to sign in
                    </Typography>
                    <Typography
                        textAlign={"center"}
                        sx = {{
                            mt:1,
                            opacity:0.8,
                        }}
                    >
                        Check your email
                    </Typography>
                    <Typography
                        variant="body2"
                        textAlign={"center"}
                        sx = {{
                            mt:1,
                            opacity:0.8,
                        }}
                    >
                        {`A link has been sent to ${maskEmail(email)}`}
                    </Typography>
                    <Typography
                        textAlign={"center"}
                    >
                        Link expires in {countdown}
                    </Typography>
                    <Typography
                        textAlign="center"
                        sx = {{
                            
                        }}
                    >
                        Didn't receive the link?
                    </Typography>
                    <Button
                        fullWidth
                        onClick={handleResend}
                        style = {{
                        textDecoration:"none",
                        color:"white", 
                        }}
                    >
                        Resend code
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}
