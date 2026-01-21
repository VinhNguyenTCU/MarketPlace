import { supabase } from "../lib/supabaseClient";
import type { VerifyCallbackResult } from "../auth/types";

function readableError(err: unknown): string {
    if (err && typeof err === "object" && "message" in err) {
        return String((err as any).message);
    }
    return "Unknown error";
}

export async function signInWithPassword(args: { email: string; password: string}) {
    const { email, password } = args;
    const { error } = await supabase.auth.signInWithPassword({ email, password});
    if (error) throw new Error(error.message);
}

export async function signUpWithPassword(args: { email: string; password: string}) {
    const { email, password} = args;
    const { error} = await supabase.auth.signUp({ email, password, options: {emailRedirectTo: window.location.origin + "/verify"}});
    if (error) throw new Error(error.message);
}

export async function signOut() {
    const {error} = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
}

export async function verifyFromUrlParams(): Promise<VerifyCallbackResult> {
    const params = new URLSearchParams(window.location.search);
    const token_hash = params.get("token_hash");
    const type = params.get("type");

    if (!token_hash) {
        return { ok: false, message: "Missing token_hash in URL" };
    }

    const { error } = await supabase.auth.verifyOtp({
        token_hash,
        type: (type as any) || "email",
    });

    if (error) return { ok: false, message: readableError(error) };


    // Clear URL params
    window.history.replaceState({}, document.title, "/verify");

    return { ok: true };
}