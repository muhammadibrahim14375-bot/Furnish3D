import { Link } from 'react-router-dom';
import type { Product } from '../types';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link to={`/product/${product.slug}`} className="product-card">
      <img src={product.imageUrl} alt={product.name} loading="lazy" />
      <div className="body">
        <div style={{ marginBottom: '0.4rem' }}>
          {product.featured && <span className="badge">Featured</span>}
        </div>
        <h3>{product.name}</h3>
        <div className="meta">
          <span>{product.category?.name || 'Furniture'}</span>
          <span className="price">${product.price.toFixed(2)}</span>
        </div>
      </div>
    </Link>
  );
}
