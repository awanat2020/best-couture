import ProductCard from "./ProductCard";;

const products = [
  {
    id: 1,
    name: "Elegant Maxi Dress",
    price: 45000,
    category: "Dresses",
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    name: "Classic Two-Piece Set",
    price: 38000,
    category: "Two-Piece",
    image:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    name: "Elegant Handbag",
    price: 32000,
    category: "Accessories",
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    name: "Luxury Abaya",
    price: 55000,
    category: "Abayas",
    image:
      "https://images.unsplash.com/photo-1585488439301-7f4f9f2a4c7a?auto=format&fit=crop&w=800&q=80",
  },
];

function FeaturedProducts() {
  return (
    <section className="featured-products">
      <div className="section-heading">
        <p>OUR COLLECTION</p>

        <h2>Featured Pieces</h2>

        <span>
          Discover some of our most loved fashion pieces.
        </span>
      </div>

      <div className="products-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            category={product.category}
            image={product.image}
          />
        ))}
      </div>
    </section>
  );
}

export default FeaturedProducts;