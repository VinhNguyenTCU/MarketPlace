import { useState } from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { Button } from "../components/ui/Button";

export default function SignInPage() {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const heroGradient = `linear-gradient(90deg, ${theme.custom.hero.from}, ${theme.custom.hero.to})`;

  return (
    <Box
      sx={{
        flex: 1,
        width: "100%",
        minHeight: 0,
        display: "flex",
        background: heroGradient,
        flexDirection: { xs: "column", md: "row" },
        pl: { xs: 1, md: 40 },
      }}
    >
        {/* Sign In form — left */}
        <Box
          sx={{
            flex: { md: "0 0 50%" },
            p: 4,
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
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 700,
                color: "text.primary",
                textAlign: "center",
                mb: 3,
              }}
            >
              Sign In
            </Typography>

            <Box component="form" display="flex" flexDirection="column" gap={2}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />

              <Typography
                component={Link}
                to="/forgot-password"
                variant="body2"
                color="text.secondary"
                textAlign="center"
                sx={{
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Forget your email/password
              </Typography>

              <Button
                fullWidth
                variant="contained"
                sx={{
                  mt: 1,
                  py: 1.5,
                  background: heroGradient,
                  color: "#fff",
                  "&:hover": {
                    background: heroGradient,
                    opacity: 0.95,
                  },
                }}
              >
                Sign In
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Sign Up promotion — right */}
        <Box
          sx={{
            flex: { md: "0 0 50%" },
            p: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: { xs: "center", md: "flex-start" },
            textAlign: { xs: "center", md: "left" },
          }}
        >
          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontWeight: 700,
              color: "white",
              mb: 1.5,
            }}
          >
            Hey There!
          </Typography>
          <Typography
            variant="body1"
            color="rgba(255,255,255,0.95)"
            sx={{ mb: 3, maxWidth: 320 }}
          >
            Let&apos;s create an account to explore our MarketPlace
          </Typography>
          <Link to="/sign-up" style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              sx={{
                py: 1.5,
                px: 3,
                background:
                  "linear-gradient(135deg, #E5E7EB 0%, #D1D5DB 50%, #E5E7EB 100%)",
                color: "#374151",
                fontWeight: 700,
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #D1D5DB 0%, #9CA3AF 50%, #D1D5DB 100%)",
                },
              }}
            >
              Sign Up
            </Button>
          </Link>
        </Box>
    </Box>
  );
}
