<<<<<<< HEAD
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { MainLayout } from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import SignInPage from "./pages/SignInPage";
import ConfirmEmailPage from "./pages/ConfirmEmailPage";
import ConfirmationCode from "./pages/ConfirmationCodePage";
import ChangePassWordPage from "./pages/ChangePasswordPage";
import { AuthLayout } from "./layouts/AuthLayout";
=======


function App() {
>>>>>>> 9858d09 (Restructing the code base from Modules folder --> Controller/Service/Repository folders)

export default function App() {
  return (
<<<<<<< HEAD
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
          <Route path="/forgot-password" element={<ConfirmEmailPage/>}/>
          <Route path="/confirmation-code" element={<ConfirmationCode/>}/>
          <Route path="/change-password" element={<ChangePassWordPage/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
=======
    <>
      <div>Hello, World!</div>
    </>
>>>>>>> 9858d09 (Restructing the code base from Modules folder --> Controller/Service/Repository folders)
  )
}
