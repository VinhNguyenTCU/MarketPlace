import { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Modal from "@mui/material/Modal";
import { useTheme } from "@mui/material/styles";
import { Button } from "../components/ui/Button";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../service/auth.service";

export default function SignUpPage() {
  const theme = useTheme();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  const heroGradient = `linear-gradient(90deg, ${theme.custom.hero.from}, ${theme.custom.hero.to})`;

  function validate() {
    if (!fullName.trim()) return "Full name is required.";
    if (!email.trim()) return "Email is required.";
    if (!password) return "Password is required.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    if (password !== confirmPassword) return "Passwords do not match.";
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    const v = validate();
    if (v) {
      setErrorMsg(v);
      return;
    }

    try {
      setLoading(true);

      // Calls your backend /auth/signup
      await signup(email.trim(), password, fullName.trim());

      // Show modal: "Please confirm your email"
      setOpenConfirmModal(true);
    } catch (err: any) {
      setErrorMsg(err?.message ?? "Sign up failed.");
    } finally {
      setLoading(false);
    }
  }

  function handleModalOk() {
    setOpenConfirmModal(false);
    navigate("/sign-in", { replace: true });
  }

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
      {/* Sign Up form — left */}
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
            Sign Up
          </Typography>

          {errorMsg && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMsg}
            </Alert>
          )}

          <Box
            component="form"
            display="flex"
            flexDirection="column"
            gap={2}
            onSubmit={handleSubmit}
          >
            <TextField
              fullWidth
              label="Full Name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              variant="outlined"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              disabled={loading}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              disabled={loading}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              disabled={loading}
            />
            <TextField
              fullWidth
              label="Confirm your password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              variant="outlined"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              disabled={loading}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
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
              {loading ? <CircularProgress size={22} /> : "Sign Up"}
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
          Welcome to MarketPlace!
        </Typography>
        <Link to="/sign-in" style={{ textDecoration: "none" }}>
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
            Already have an account? Sign In
          </Button>
        </Link>
      </Box>

      {/* Confirm Email Modal */}
      <Modal open={openConfirmModal} onClose={handleModalOk}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 360,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 3,
            outline: "none",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            Please confirm your email
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            We sent a confirmation link to your email. Please confirm your email to
            continue.
          </Typography>

          <Button
            fullWidth
            variant="contained"
            onClick={handleModalOk}
            sx={{
              py: 1.2,
              background: heroGradient,
              color: "#fff",
              "&:hover": { background: heroGradient, opacity: 0.95 },
            }}
          >
            OK
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}
