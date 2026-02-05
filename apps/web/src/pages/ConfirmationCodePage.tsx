import { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import  Box  from "@mui/material/Box";
import { Typography } from "@mui/material";
import  TextField  from "@mui/material/TextField";
import { Button } from "../components/ui/Button";
import { Link }  from "react-router-dom";
export default function ConfirmationCode() {
    const theme = useTheme();
    const [countdown, setCountDown] = useState(60);
    useEffect(() => {
        if(countdown > 0) {
            const timer = setTimeout(()=>setCountDown(countdown-1),1000);
            return() => clearTimeout(timer);
        }
    },[countdown])

    const handleResend = () => {
        setCountDown(60);
        
    }

    const heroGradient = `linear-gradient(90deg, ${theme.custom.hero.from}, ${theme.custom.hero.to})`;
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
                        sx = {{
                            mt:1,
                            opacity:0.8,
                        }}
                    >
                        A code has been sent
                    </Typography>
                    <TextField
                        placeholder="Confirmation Code"
                        fullWidth
                        sx = {{
                            mb:2,
                        }}
                    ></TextField>
                    <Typography
                        textAlign="center"
                    >
                        Code expires in {countdown}
                    </Typography>
                    <Typography
                        textAlign="center"
                        sx = {{
                            
                        }}
                    >
                        Didn't receive the code?
                        <Link to=""
                              onClick={handleResend}
                              style = {{
                                textDecoration:"none",
                                color:"white",
                                
                              }}
                        >Resend code
                        </Link>
                    </Typography>
                    <Link to="/change-password">
                    <Button
                        fullWidth
                        sx = {{
                            mt:2,
                        }}
                    >
                        Continue
                    </Button>
                    </Link>
                </Box>
            </Box>
        </Box>
    )
}