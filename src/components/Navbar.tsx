import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import type { User } from "@supabase/supabase-js";

function Navbar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="navbar">
      <div className="logo">
        Best <span>Couture</span>
      </div>

      <nav>
        <Link to="/">Home</Link>
        <Link to="/shop">Shop</Link>
        <Link to="/categories">Categories</Link>
        <Link to="/about">About</Link>

        {user && <Link to="/my-orders">My Orders</Link>}
      </nav>

      <div className="nav-actions">
        <Link to="/cart" className="cart-button">
          🛒 Cart
        </Link>

        {user ? (
          <>
            <span style={{ marginRight: "10px", fontSize: "14px" }}>
              {user.email}
            </span>

            <button className="login-button" onClick={handleSignOut}>
              Sign Out
            </button>
          </>
        ) : (
          <Link to="/login" className="login-button">
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}

export default Navbar;