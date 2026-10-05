import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function AuthCallback() {
  const navigate = useNavigate();
  const ranRef = useRef(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Make sure the one-time code is only used once
    if (ranRef.current) return;
    ranRef.current = true;

    const finishLogin = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const urlError = params.get("error_description") || params.get("error");

      console.log("CALLBACK URL:", window.location.href);
      console.log(
        "VERIFIER KEYS IN STORAGE:",
        Object.keys(localStorage).filter((key) => key.includes("code-verifier"))
      );

      if (urlError) {
        console.error("OAUTH ERROR IN URL:", urlError);
        setErrorMessage(urlError);
        return;
      }

      const { data: existing } = await supabase.auth.getSession();
      if (existing.session) {
        navigate("/", { replace: true });
        return;
      }

      if (!code) {
        setErrorMessage("No sign-in code was found in the URL.");
        return;
      }

      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("CODE EXCHANGE ERROR:", error.message, error);
        setErrorMessage(error.message);
        return;
      }

      console.log("LOGIN SUCCESSFUL");
      navigate("/", { replace: true });
    };

    finishLogin();
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

        {errorMessage ? (
          <>
            <h1>Sign in failed</h1>
            <p>{errorMessage}</p>
            <Link to="/login">Back to Sign In</Link>
          </>
        ) : (
          <>
            <h1>Signing you in...</h1>
            <p>Please wait a moment.</p>
          </>
        )}
      </div>
    </main>
  );
}

export default AuthCallback;