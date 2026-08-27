import { useEffect, useState } from 'react';
import api from '../api/client';
import ProductCard from '../components/ProductCard';
import type { Category, Product } from '../types';

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products/categories').then((res) => setCategories(res.data.categories));
  }, []);

  useEffect(() => {
    setLoading(true);
    api
      .get('/products', {
        params: {
          search: search || undefined,
          category: category || undefined,
        },
      })
      .then((res) => setProducts(res.data.products))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [search, category]);

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <h2>Shop</h2>
            <p>Search and filter the Furnish3D collection.</p>
          </div>
        </div>

        <div className="toolbar">
          <input
            className="input"
            placeholder="Search furniture…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className="muted">Loading products…</p>
        ) : products.length === 0 ? (
          <div className="empty">No products match your filters.</div>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
