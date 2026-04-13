import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import  Box  from "@mui/material/Box";
import { Typography } from "@mui/material";
import  TextField  from "@mui/material/TextField";
import { Button } from "../components/ui/Button";
import { useNavigate }  from "react-router-dom";
import { supabase } from "../lib/supabase";
import { updatepassword } from "../service/auth.service";

export default function ChangePassWordPage() {
    const [newpassword, setNewPassword] = useState("");
    const [confirmpassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const theme = useTheme();
    const heroGradient = `linear-gradient(90deg, ${theme.custom.hero.from}, ${theme.custom.hero.to})`;
    
    
      const handleChangePassword = async () => {
        // Validation
        if (newpassword !== confirmpassword) {
          setError("Passwords don't match");
          return;
        }
    
        if (newpassword.length < 8) {
          setError("Password must be at least 8 characters");
          return;
        }
    
        setLoading(true);
        setError("");
    
        try {
            await updatepassword(newpassword,confirmpassword);

            localStorage.removeItem("resetEmail");
            localStorage.removeItem("isRecovery");
        
            await supabase.auth.signOut();
            navigate("/sign-in", {state: { message: "Password updated successfully! Please sign in with your new password"}});
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to update password";
          setError(errorMessage);
        } finally {
          setLoading(false);
        }
      };

    
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
                        textAlign="center"
                        sx = {{
                            fontSize:25,
                            mb:2,
                            fontWeight:"bold",
                        }}
                    >
                        Change New Password
                    </Typography>
                    <TextField
                        fullWidth
                        label="New Password"
                        type="password"
                        value={newpassword}
                        onChange={(e)=>setNewPassword(e.target.value)}
                        placeholder="Enter New Password"
                        sx = {{
                            mb:2,
                        }}
                    ></TextField>
                    <TextField
                        fullWidth
                        label="Confirm New Password"
                        type="password"
                        value={confirmpassword}
                        onChange={(e)=>setConfirmPassword(e.target.value)}
                        placeholder="Confirm New Password"
                        error={!!error}
                        helperText={error}
                        sx = {{
                            mb:2,
                        }}
                    ></TextField>
                        <Button
                            fullWidth
                            onClick={handleChangePassword}
                            disabled={loading || !newpassword || !confirmpassword}
                        >
                            {loading ? "Updating..." : "Update Password"}
                        </Button>
                </Box>
            </Box>
        </Box>
        
    )
}
