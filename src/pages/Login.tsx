import { supabase } from "../lib/supabase";

function Login() {
const handleGoogleLogin = async () => {
const { error } = await supabase.auth.signInWithOAuth({
provider: "google",
options: {
redirectTo: window.location.origin,
},
});


if (error) {
  console.error("GOOGLE LOGIN ERROR:", error);
  alert("Unable to sign in with Google.");
}


};

return (
<main
style={{
minHeight: "70vh",
display: "flex",
justifyContent: "center",
alignItems: "center",
padding: "60px 20px",
}}
>
<div
style={{
width: "100%",
maxWidth: "450px",
textAlign: "center",
border: "1px solid #ddd",
borderRadius: "10px",
padding: "40px",
boxSizing: "border-box",
}}
> <p>BEST COUTURE</p>


    <h1
      style={{
        fontSize: "36px",
        margin: "15px 0",
      }}
    >
      Welcome Back
    </h1>

    <p style={{ marginBottom: "30px" }}>
      Sign in to manage your orders and continue shopping.
    </p>

    <button
      type="button"
      onClick={handleGoogleLogin}
      style={{
        width: "100%",
        padding: "14px 20px",
        border: "1px solid #ccc",
        borderRadius: "6px",
        background: "#fff",
        cursor: "pointer",
        fontSize: "16px",
      }}
    >
      Continue with Google
    </button>
  </div>
</main>


);
}

export default Login;
