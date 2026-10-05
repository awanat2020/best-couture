import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "../lib/supabase";

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const LOCAL_KEY = "best-couture-cart";

const CartContext = createContext<CartContextType | undefined>(undefined);

function getSavedCart(): CartItem[] {
  try {
    const saved = localStorage.getItem(LOCAL_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToItem(row: any): CartItem {
  return {
    id: Number(row.product_id),
    name: row.product_name,
    price: Number(row.price),
    category: row.category ?? "",
    image: row.image ?? "",
    quantity: row.quantity,
  };
}

function itemToRow(userId: string, item: CartItem) {
  return {
    user_id: userId,
    product_id: String(item.id),
    product_name: item.name,
    price: item.price,
    quantity: item.quantity,
    category: item.category,
    image: item.image,
  };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(getSavedCart);
  const [userId, setUserId] = useState<string | null>(null);
  const prevUserId = useRef<string | null>(null);

  // Track who is signed in
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUserId(data.session?.user.id ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user.id ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Guests: keep the cart in localStorage
  useEffect(() => {
    if (!userId) {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(cart));
    }
  }, [cart, userId]);

  // On sign out: empty the cart so the next person doesn't see it
  useEffect(() => {
    if (prevUserId.current && !userId) {
      setCart([]);
      localStorage.removeItem(LOCAL_KEY);
    }
    prevUserId.current = userId;
  }, [userId]);

  const loadRemoteCart = useCallback(async (uid: string) => {
    const { data, error } = await supabase
      .from("cart_items")
      .select("*")
      .eq("user_id", uid)
      .order("product_name");

    if (error) {
      console.error("CART LOAD ERROR:", error);
      return;
    }

    setCart((data ?? []).map(rowToItem));
  }, []);

  // Signed in: merge any guest cart, load the cart, and listen for live changes
  useEffect(() => {
    if (!userId) return;

    let cancelled = false;

    const sync = async () => {
      const guestCart = getSavedCart();

      if (guestCart.length > 0) {
        // Remove first so a double run can't add the items twice
        localStorage.removeItem(LOCAL_KEY);

        const { data: existing } = await supabase
          .from("cart_items")
          .select("product_id, quantity")
          .eq("user_id", userId);

        const existingQty = new Map(
          (existing ?? []).map((row) => [row.product_id, row.quantity])
        );

        const rows = guestCart.map((item) =>
          itemToRow(userId, {
            ...item,
            quantity: (existingQty.get(String(item.id)) ?? 0) + item.quantity,
          })
        );

        const { error } = await supabase
          .from("cart_items")
          .upsert(rows, { onConflict: "user_id,product_id" });

        if (error) {
          console.error("CART MERGE ERROR:", error);
          localStorage.setItem(LOCAL_KEY, JSON.stringify(guestCart));
        }
      }

      if (!cancelled) await loadRemoteCart(userId);
    };

    sync();

    // Any change to this user's cart (from the website or the phone) reloads it
    const channel = supabase
      .channel(`cart-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "cart_items",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          loadRemoteCart(userId);
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [userId, loadRemoteCart]);

  const saveItem = async (item: CartItem) => {
    if (!userId) return;

    const { error } = await supabase
      .from("cart_items")
      .upsert(itemToRow(userId, item), { onConflict: "user_id,product_id" });

    if (error) console.error("CART SAVE ERROR:", error);
  };

  const addToCart = (product: Product) => {
    const existing = cart.find((item) => item.id === product.id);
    const updated: CartItem = {
      ...product,
      quantity: (existing?.quantity ?? 0) + 1,
    };

    setCart((current) =>
      existing
        ? current.map((item) => (item.id === product.id ? updated : item))
        : [...current, updated]
    );

    saveItem(updated);
  };

  const removeFromCart = (productId: number) => {
    setCart((current) => current.filter((item) => item.id !== productId));

    if (userId) {
      supabase
        .from("cart_items")
        .delete()
        .eq("user_id", userId)
        .eq("product_id", String(productId))
        .then(({ error }) => {
          if (error) console.error("CART REMOVE ERROR:", error);
        });
    }
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const existing = cart.find((item) => item.id === productId);
    if (!existing) return;

    const updated = { ...existing, quantity };

    setCart((current) =>
      current.map((item) => (item.id === productId ? updated : item))
    );

    saveItem(updated);
  };

  const clearCart = () => {
    setCart([]);

    if (userId) {
      supabase
        .from("cart_items")
        .delete()
        .eq("user_id", userId)
        .then(({ error }) => {
          if (error) console.error("CART CLEAR ERROR:", error);
        });
    }
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}