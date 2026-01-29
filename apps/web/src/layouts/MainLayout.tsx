import Box from "@mui/material/Box";
import { Outlet } from "react-router-dom";
import { Navbar } from "../components/common/Navbar";
import { Footer } from "../components/common/Footer";

export function MainLayout() {
  return (
    <Box minHeight="100vh" display="flex" flexDirection="column">
      <Navbar />

      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>

      <Footer />
    </Box>
  );
}
