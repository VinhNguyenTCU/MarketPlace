import { BrowserRouter, Routes, Route } from "react-router-dom";

import { MainLayout } from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import SignInPage from "./pages/SignInPage";
import { AuthLayout } from "./layouts/AuthLayout";

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
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
