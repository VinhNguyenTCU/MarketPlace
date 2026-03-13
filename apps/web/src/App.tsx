import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import { AuthLayout } from "./layouts/AuthLayout";

import HomePage from "./pages/HomePage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import LandingPage from "./pages/LandingPage";
import GuestOnlyRoute from "./components/common/GuestOnlyRoute";
import ConfirmationLink from "./pages/ConfirmationLinkPage";
import ChangePassWordPage from "./pages/ChangePasswordPage";
import ConfirmEmailPage from "./pages/ConfirmEmailPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/landing" element={<LandingPage />} />
        </Route>
        
        {/* Auth pages */}
        <Route element={<AuthLayout />}>
        <Route element={<GuestOnlyRoute />}>
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/confirm-email" element={<ConfirmEmailPage />}/>
          <Route path="/confirmation-link" element={<ConfirmationLink />}/>
          <Route path="/change-password" element={<ChangePassWordPage />}/>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
