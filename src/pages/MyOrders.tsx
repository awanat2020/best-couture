import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

interface Order {
id: number;
customer_name: string;
customer_email: string;
phone: string;
address: string;
total: number;
status: string;
user_id: string;
}

function MyOrders() {
const [orders, setOrders] = useState<Order[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
const loadOrders = async () => {
const {
data: { user },
} = await supabase.auth.getUser();


  if (!user) {
    setError("Please sign in to view your orders.");
    setLoading(false);
    return;
  }

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("id", { ascending: false });

  if (error) {
    console.error("ORDERS ERROR:", error);
    setError("Unable to load your orders.");
    setLoading(false);
    return;
  }

  setOrders(data || []);
  setLoading(false);
};

loadOrders();


}, []);

if (loading) {
return ( <main className="orders-page"> <div className="orders-container"> <div className="orders-heading"> <p>BEST COUTURE</p> <h1>My Orders</h1> <span>Loading your orders...</span> </div> </div> </main>
);
}

if (error) {
return ( <main className="orders-page"> <div className="orders-container"> <div className="orders-heading"> <p>BEST COUTURE</p> <h1>My Orders</h1> <span>{error}</span> </div>

```
      <div className="orders-empty">
        <Link to="/login" className="orders-button">
          Sign In
        </Link>
      </div>
    </div>
  </main>
);


}

return ( <main className="orders-page"> <div className="orders-container"> <div className="orders-heading"> <p>BEST COUTURE</p>

```
      <h1>My Orders</h1>

      <span>
        Keep track of your Best Couture purchases.
      </span>
    </div>

    {orders.length === 0 ? (
      <div className="orders-empty">
        <div className="orders-empty-icon">🛍️</div>

        <h2>No orders yet</h2>

        <p>
          You haven't placed an order yet.
          <br />
          Discover something beautiful from our collection.
        </p>

        <Link to="/" className="orders-button">
          Start Shopping
        </Link>
      </div>
    ) : (
      <div className="orders-list">
        {orders.map((order) => (
          <article
            className="order-card"
            key={order.id}
          >
            <div className="order-card-top">
              <div>
                <span className="order-label">
                  ORDER
                </span>

                <h2>
                  #{order.id}
                </h2>
              </div>

              <span
                className={`order-status ${order.status.toLowerCase()}`}
              >
                {order.status}
              </span>
            </div>

            <div className="order-divider" />

            <div className="order-details">
              <div className="order-detail">
                <span>Customer</span>
                <strong>
                  {order.customer_name}
                </strong>
              </div>

              <div className="order-detail">
                <span>Email</span>
                <strong>
                  {order.customer_email}
                </strong>
              </div>

              <div className="order-detail">
                <span>Phone</span>
                <strong>
                  {order.phone}
                </strong>
              </div>

              <div className="order-detail address">
                <span>Delivery Address</span>
                <strong>
                  {order.address}
                </strong>
              </div>
            </div>

            <div className="order-divider" />

            <div className="order-total">
              <span>Order Total</span>

              <strong>
                ₦{Number(order.total).toLocaleString()}
              </strong>
            </div>
          </article>
        ))}
      </div>
    )}
  </div>
</main>


);
}

export default MyOrders;
