import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("CALLBACK URL:", window.location.href);

    let done = false;

    const finish = (session: unknown) => {
      if (done) return;
      done = true;
      console.log("CALLBACK FINISHED, session:", !!session);
      navigate(session ? "/" : "/login", { replace: true });
    };

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("AUTH EVENT:", event, !!session);
        if (event === "SIGNED_IN" && session) finish(session);
      }
    );

    supabase.auth.getSession().then(({ data, error }) => {
      console.log("SESSION AT CALLBACK:", data.session, error);
      if (data.session) finish(data.session);
    });

    const timeout = setTimeout(() => finish(null), 8000);

    return () => {
      listener.subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <main
      style={{
        minHeight: "70vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "60px 20px",
        textAlign: "center",
      }}
    >
      <div>
        <p>BEST COUTURE</p>
        <h1>Signing you in...</h1>
        <p>Please wait a moment.</p>
      </div>
    </main>
  );
}

export default AuthCallback;