import { BrowserRouter, Routes, Route } from "react-router-dom";

import { MainLayout } from "./layouts/MainLayout";
import { AuthLayout } from "./layouts/AuthLayout";

import HomePage from "./pages/HomePage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import GuestOnlyRoute from "./components/common/GuestOnlyRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main app page */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
        </Route>
        
        {/* Auth pages */}
        <Route element={<AuthLayout />}>
        <Route element={<GuestOnlyRoute />}>
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="/sign-up" element={<SignUpPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
