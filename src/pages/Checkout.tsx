import { useState } from "react";
import { useCart } from "../context/CartContext";
import { supabase } from "../lib/supabase";

function Checkout() {
const { cart, cartTotal, clearCart } = useCart();

const [fullName, setFullName] = useState("");
const [email, setEmail] = useState("");
const [phone, setPhone] = useState("");
const [address, setAddress] = useState("");
const [loading, setLoading] = useState(false);

const handleSubmit = async (
event: React.FormEvent<HTMLFormElement>
) => {
event.preventDefault();


if (cart.length === 0) {
  alert("Your cart is empty.");
  return;
}

setLoading(true);

const {
  data: { user },
} = await supabase.auth.getUser();

if (!user) {
  setLoading(false);
  alert("Please sign in before placing an order.");
  return;
}

// Save the main order
const { data: order, error: orderError } = await supabase
  .from("orders")
  .insert({
    user_id: user.id,
    customer_name: fullName,
    customer_email: email,
    phone,
    address,
    total: cartTotal,
    status: "pending",
  })
  .select()
  .single();

if (orderError) {
  console.error("ORDER ERROR:", orderError);
  setLoading(false);
  alert("There was a problem saving your order.");
  return;
}

// Save the products in the order
const orderItems = cart.map((item) => ({
  order_id: order.id,
  product_id: item.id,
  product_name: item.name,
  price: item.price,
  quantity: item.quantity,
}));

console.log("ORDER ITEMS BEING SENT:", orderItems);

const { error: itemsError } = await supabase
  .from("order_items")
  .insert(orderItems);

console.log("ORDER ITEMS INSERT RESULT:", itemsError);

if (itemsError) {
  console.error("ORDER ITEMS ERROR:", itemsError);
  setLoading(false);

  alert(
    "Your order was created, but the products could not be saved."
  );

  return;
}

console.log("ORDER AND ITEMS SAVED SUCCESSFULLY");

// Send confirmation email through Resend
try {
  const emailResponse = await fetch("/api/send-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      customerEmail: email,
      customerName: fullName,
      orderId: order.id,
      total: cartTotal,
    }),
  });

  const emailResult = await emailResponse.json();

  if (!emailResponse.ok) {
    console.error(
      "EMAIL ERROR:",
      emailResult
    );

    setLoading(false);

    alert(
      "Your order was saved, but the confirmation email could not be sent."
    );

    return;
  }

  console.log(
    "CONFIRMATION EMAIL SENT:",
    emailResult
  );
} catch (emailError) {
  console.error(
    "EMAIL REQUEST ERROR:",
    emailError
  );

  setLoading(false);

  alert(
    "Your order was saved, but the confirmation email could not be sent."
  );

  return;
}

// Everything succeeded
setLoading(false);
clearCart();

setFullName("");
setEmail("");
setPhone("");
setAddress("");

alert(
  "Order placed successfully! A confirmation email has been sent."
);


};

return (
<main
style={{
maxWidth: "1100px",
margin: "0 auto",
padding: "60px 20px",
color: "#222",
}}
>
<div style={{ marginBottom: "40px" }}> <p>BEST COUTURE</p>

```
    <h1
      style={{
        fontSize: "40px",
        margin: "10px 0",
      }}
    >
      Checkout
    </h1>

    <p>Complete your order details below.</p>
  </div>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "2fr 1fr",
      gap: "40px",
    }}
  >
    <form
      onSubmit={handleSubmit}
      style={{
        border: "1px solid #ddd",
        padding: "30px",
        borderRadius: "8px",
      }}
    >
      <h2>Delivery Information</h2>

      <label
        style={{
          display: "block",
          marginTop: "20px",
        }}
      >
        Full Name

        <input
          type="text"
          value={fullName}
          onChange={(event) =>
            setFullName(event.target.value)
          }
          placeholder="Enter your full name"
          required
          style={{
            display: "block",
            width: "100%",
            padding: "12px",
            marginTop: "8px",
            boxSizing: "border-box",
          }}
        />
      </label>

      <label
        style={{
          display: "block",
          marginTop: "20px",
        }}
      >
        Email Address

        <input
          type="email"
          value={email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
          placeholder="Enter your email"
          required
          style={{
            display: "block",
            width: "100%",
            padding: "12px",
            marginTop: "8px",
            boxSizing: "border-box",
          }}
        />
      </label>

      <label
        style={{
          display: "block",
          marginTop: "20px",
        }}
      >
        Phone Number

        <input
          type="tel"
          value={phone}
          onChange={(event) =>
            setPhone(event.target.value)
          }
          placeholder="Enter your phone number"
          required
          style={{
            display: "block",
            width: "100%",
            padding: "12px",
            marginTop: "8px",
            boxSizing: "border-box",
          }}
        />
      </label>

      <label
        style={{
          display: "block",
          marginTop: "20px",
        }}
      >
        Delivery Address

        <textarea
          value={address}
          onChange={(event) =>
            setAddress(event.target.value)
          }
          placeholder="Enter your complete delivery address"
          rows={5}
          required
          style={{
            display: "block",
            width: "100%",
            padding: "12px",
            marginTop: "8px",
            boxSizing: "border-box",
            resize: "vertical",
          }}
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        style={{
          marginTop: "25px",
          padding: "14px 25px",
          border: "none",
          borderRadius: "5px",
          cursor: loading
            ? "not-allowed"
            : "pointer",
          fontSize: "16px",
        }}
      >
        {loading
          ? "Processing Order..."
          : "Place Order"}
      </button>
    </form>

    <aside
      style={{
        border: "1px solid #ddd",
        padding: "30px",
        borderRadius: "8px",
        height: "fit-content",
      }}
    >
      <h2>Order Summary</h2>

      {cart.length === 0 ? (
        <p>Your cart is currently empty.</p>
      ) : (
        <>
          {cart.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "20px",
                marginTop: "20px",
              }}
            >
              <div>
                <strong>{item.name}</strong>

                <p>
                  Quantity: {item.quantity}
                </p>
              </div>

              <span>
                ₦
                {(
                  item.price * item.quantity
                ).toLocaleString()}
              </span>
            </div>
          ))}

          <hr />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "20px",
              fontSize: "20px",
            }}
          >
            <strong>Total</strong>

            <strong>
              ₦{cartTotal.toLocaleString()}
            </strong>
          </div>
        </>
      )}
    </aside>
  </div>
</main>


);
}

export default Checkout;
