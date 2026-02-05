import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import  Box  from "@mui/material/Box";
import { Typography } from "@mui/material";
import  TextField  from "@mui/material/TextField";
import { Button } from "../components/ui/Button";
import { Link }  from "react-router-dom";


export default function ConfirmEmailPage() {
    const [email,setEmail] = useState("");
    const theme = useTheme();

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
                    Enter your email to receive confirmation code
                </Typography>
                <TextField
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    fullWidth
                ></TextField>
                <Link to="/confirmation-code">
                    <Button
                        fullWidth
                        sx={{
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