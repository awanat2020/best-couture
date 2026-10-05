import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FeaturedProducts from "./components/FeaturedProducts";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import MyOrders from "./pages/MyOrders";
import AuthCallback from "./pages/AuthCallback";
import { CartProvider } from "./context/CartContext";

function Home() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
    </>
  );
}

function ComingSoon({ title }: { title: string }) {
  return (
    <main style={{ minHeight: "60vh", display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "60px 20px" }}>
      <div>
        <p>BEST COUTURE</p>
        <h1>{title}</h1>
        <p>This page is coming soon.</p>
        <Link to="/">Back to Home</Link>
      </div>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<ComingSoon title="Shop" />} />
          <Route path="/categories" element={<ComingSoon title="Categories" />} />
          <Route path="/about" element={<ComingSoon title="About" />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="*" element={<ComingSoon title="Page not found" />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;