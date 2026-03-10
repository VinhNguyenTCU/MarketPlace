import { useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function HomePage() {
    useEffect(() => {
        async function checkSession() {
          const { data } = await supabase.auth.getSession();
    
          console.log("data", data.session);
        }
    
        checkSession();
    }
)
    
    return <div>This is the Home Page. Users can browse products and search for items.</div>
}