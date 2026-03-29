// src/components/routes/RecoveryOnlyRoute.tsx
import { Navigate, Outlet } from "react-router-dom";

export default function UserOnlyRoute() {

    const hash = window.location.hash;
    const params = new URLSearchParams(hash.replace("#", ""));
    const type = params.get("type");

    const isRecovery = 
        type === "recovery" || 
        localStorage.getItem("isRecovery") === "true";

    console.log("RecoveryOnlyRoute isRecovery:", isRecovery);

    if(!isRecovery) return <Navigate to="/confirm-email"/>
    return <Outlet />;
}