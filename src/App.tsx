import { BrowserRouter, Routes, Route } from "react-router-dom";
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
<> <Hero /> <FeaturedProducts />
</>
);
}

function App() {
return ( <BrowserRouter> <CartProvider> <Navbar />

```
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/login" element={<Login />} />
      <Route path="/my-orders" element={<MyOrders />} />
      <Route
        path="/auth/callback"
        element={<AuthCallback />}
      />
    </Routes>
  </CartProvider>
</BrowserRouter>


);
}

export default App;
