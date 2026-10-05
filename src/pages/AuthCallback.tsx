import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function AuthCallback() {
const navigate = useNavigate();

useEffect(() => {
const finishLogin = async () => {
const code = new URLSearchParams(
window.location.search
).get("code");


  if (!code) {
    console.error(
      "AUTH CALLBACK ERROR: No code found in URL"
    );

    navigate("/login", {
      replace: true,
    });

    return;
  }

  const { error } =
    await supabase.auth.exchangeCodeForSession(
      code
    );

  if (error) {
    console.error(
      "AUTH CODE EXCHANGE ERROR:",
      error
    );

    alert(
      "Unable to complete sign in. Please try again."
    );

    navigate("/login", {
      replace: true,
    });

    return;
  }

  console.log(
    "GOOGLE LOGIN SUCCESSFUL"
  );

  navigate("/", {
    replace: true,
  });
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
> <div> <p>BEST COUTURE</p>


    <h1>Signing you in...</h1>

    <p>Please wait a moment.</p>
  </div>
</main>


);
}

export default AuthCallback;
