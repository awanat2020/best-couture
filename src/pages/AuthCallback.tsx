import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function AuthCallback() {
const navigate = useNavigate();

useEffect(() => {
const finishLogin = async () => {
await supabase.auth.getSession();


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

```
    <h1>Signing you in...</h1>

    <p>Please wait a moment.</p>
  </div>
</main>


);
}

export default AuthCallback;
