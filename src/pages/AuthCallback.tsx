import { supabase } from "../lib/supabase";

function Login() {
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("GOOGLE LOGIN ERROR:", error);
      alert("Could not start Google sign in. Please try again.");
    }
  };

  return (
    <main style={{ minHeight: "70vh", display: "flex", justifyContent: "center", alignItems: "center", padding: "60px 20px", textAlign: "center" }}>
      <div>
        <h1>Sign in</h1>
        <button onClick={handleGoogleLogin}>Continue with Google</button>
      </div>
    </main>
  );
}

export default Login;