function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <p className="hero-subtitle">
          WELCOME TO BEST COUTURE
        </p>

        <h1>
          Style that makes
          <br />
          you feel <span>beautiful.</span>
        </h1>

        <p className="hero-description">
          Discover elegant fashion pieces designed to bring
          confidence, comfort, and timeless style to your wardrobe.
        </p>

        <div className="hero-buttons">
          <button className="primary-button">
            Shop Collection
          </button>

          <button className="secondary-button">
            Explore Categories
          </button>
        </div>
      </div>

      <div className="hero-image">
        <div className="image-placeholder">
          Best Couture
        </div>
      </div>
    </section>
  );
}

export default Hero;