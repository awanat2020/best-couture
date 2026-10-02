import { useCart } from "../context/CartContext";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
}

function ProductCard({
  id,
  name,
  price,
  category,
  image,
}: ProductCardProps) {
  const { addToCart } = useCart();

  const product = {
    id,
    name,
    price,
    category,
    image,
  };

  return (
    <article className="product-card">
      <div className="product-image">
        <img src={image} alt={name} />
      </div>

      <div className="product-info">
        <p className="product-category">{category}</p>

        <h3>{name}</h3>

        <p className="product-price">
          ₦{price.toLocaleString()}
        </p>

        <button
          className="add-to-cart"
          onClick={() => addToCart(product)}
        >
          Add to Cart
        </button>
      </div>
    </article>
  );
}

export default ProductCard;