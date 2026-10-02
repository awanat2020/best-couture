import {
createContext,
useContext,
useEffect,
useState,
type ReactNode,
} from "react";

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
updateQuantity: (
productId: number,
quantity: number
) => void;
clearCart: () => void;
cartCount: number;
cartTotal: number;
}

const CartContext =
createContext<CartContextType | undefined>(
undefined
);

function getSavedCart(): CartItem[] {
try {
const savedCart = localStorage.getItem(
"best-couture-cart"
);


if (!savedCart) {
  return [];
}

return JSON.parse(savedCart);


} catch {
return [];
}
}

export function CartProvider({
children,
}: {
children: ReactNode;
}) {
const [cart, setCart] =
useState<CartItem[]>(getSavedCart);

useEffect(() => {
localStorage.setItem(
"best-couture-cart",
JSON.stringify(cart)
);
}, [cart]);

const addToCart = (product: Product) => {
setCart((currentCart) => {
const existingItem = currentCart.find(
(item) => item.id === product.id
);


  if (existingItem) {
    return currentCart.map((item) =>
      item.id === product.id
        ? {
            ...item,
            quantity: item.quantity + 1,
          }
        : item
    );
  }

  return [
    ...currentCart,
    {
      ...product,
      quantity: 1,
    },
  ];
});


};

const removeFromCart = (productId: number) => {
setCart((currentCart) =>
currentCart.filter(
(item) => item.id !== productId
)
);
};

const updateQuantity = (
productId: number,
quantity: number
) => {
if (quantity <= 0) {
removeFromCart(productId);
return;
}


setCart((currentCart) =>
  currentCart.map((item) =>
    item.id === productId
      ? {
          ...item,
          quantity,
        }
      : item
  )
);


};

const clearCart = () => {
setCart([]);
};

const cartCount = cart.reduce(
(total, item) => total + item.quantity,
0
);

const cartTotal = cart.reduce(
(total, item) =>
total + item.price * item.quantity,
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
throw new Error(
"useCart must be used inside CartProvider"
);
}

return context;
}
