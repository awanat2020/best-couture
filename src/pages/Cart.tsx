import { useCart } from "../context/CartContext";

function Cart() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    cartTotal,
  } = useCart();

  if (cart.length === 0) {
    return (
      <main className="cart-page">
        <div className="cart-empty">
          <h1>Your Cart</h1>
          <p>Your cart is currently empty.</p>

          <a href="/">Continue Shopping</a>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <p>YOUR SHOPPING BAG</p>
          <h1>Your Cart</h1>
        </div>

        <div className="cart-layout">
          <div className="cart-items">
            {cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-item-image"
                />

                <div className="cart-item-details">
                  <p className="cart-item-category">
                    {item.category}
                  </p>

                  <h3>{item.name}</h3>

                  <p>
                    ₦{item.price.toLocaleString()}
                  </p>

                  <div className="quantity-controls">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.quantity - 1
                        )
                      }
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.quantity + 1
                        )
                      }
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="remove-button"
                    onClick={() =>
                      removeFromCart(item.id)
                    }
                  >
                    Remove
                  </button>
                </div>

                <p className="cart-item-total">
                  ₦
                  {(
                    item.price * item.quantity
                  ).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          <aside className="cart-summary">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>
                ₦{cartTotal.toLocaleString()}
              </span>
            </div>

            <div className="summary-row">
              <span>Delivery</span>
              <span>Calculated at checkout</span>
            </div>

            <div className="summary-total">
              <span>Total</span>
              <span>
                ₦{cartTotal.toLocaleString()}
              </span>
            </div>

            <a href="/checkout" className="checkout-button">
  Proceed to Checkout
</a>

            <a
              href="/"
              className="continue-shopping"
            >
              Continue Shopping
            </a>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default Cart;