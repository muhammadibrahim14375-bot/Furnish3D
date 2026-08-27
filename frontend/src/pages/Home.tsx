import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import ProductCard from '../components/ProductCard';
import type { Product } from '../types';

export default function Home() {
  const [featured, setFeatured] = useState<Product[]>([]);

  useEffect(() => {
    api
      .get('/products', { params: { featured: true } })
      .then((res) => setFeatured(res.data.products.slice(0, 4)))
      .catch(() => setFeatured([]));
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero-media" aria-hidden />
        <div className="hero-content">
          <h1 className="brand-mark">
            Furnish<span>3D</span>
          </h1>
          <p>
            See every angle before you buy. Explore furniture in interactive 3D,
            then checkout with a secure full-stack storefront.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-accent" to="/shop">
              Browse collection
            </Link>
            <Link className="btn btn-secondary" to="/register">
              Create account
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>Featured pieces</h2>
              <p>Rotate, inspect, and shop with confidence.</p>
            </div>
            <Link to="/shop" className="btn btn-secondary btn-sm">
              View all
            </Link>
          </div>
          <div className="product-grid">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
