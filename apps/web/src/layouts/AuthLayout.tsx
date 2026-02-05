import Box from "@mui/material/Box";
import { Link, Outlet } from "react-router-dom";
import { AuthNavbar } from '../components/common/AuthNavbar';

export function AuthLayout() {
  return (
    <Box minHeight="100vh" display="flex" flexDirection="column">
        <AuthNavbar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          paddingTop: 3,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
