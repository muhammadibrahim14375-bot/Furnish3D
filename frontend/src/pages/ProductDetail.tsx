import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/client';
import ProductViewer3D from '../components/ProductViewer3D';
import { useAuth } from '../context/AuthContext';
import type { Product, Review } from '../types';

export default function ProductDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  async function load() {
    const { data } = await api.get(`/products/${slug}`);
    setProduct(data.product);
    setReviews(data.reviews);
    setAvgRating(data.avgRating);
  }

  useEffect(() => {
    load().catch(() => setError('Product not found'));
  }, [slug]);

  async function addToCart() {
    if (!user) {
      navigate('/login', { state: { from: `/product/${slug}` } });
      return;
    }
    try {
      await api.post('/cart', { productId: product!.id, quantity: 1 });
      setMessage('Added to cart');
      setError('');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Could not add to cart';
      setError(msg);
    }
  }

  async function submitReview(e: FormEvent) {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await api.post('/reviews', {
        productId: product!.id,
        rating,
        comment,
      });
      setComment('');
      setMessage('Review submitted for moderation');
      setError('');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Could not submit review';
      setError(msg);
    }
  }

  if (error && !product) {
    return (
      <div className="container section">
        <p className="error">{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container section">
        <p className="muted">Loading product…</p>
      </div>
    );
  }

  return (
    <section className="section">
      <div className="container detail-layout">
        <ProductViewer3D product={product} />

        <div className="detail-panel">
          {product.featured && <span className="badge">Featured</span>}
          <h1>{product.name}</h1>
          <div className="price">${product.price.toFixed(2)}</div>
          <p className="muted">
            {product.category?.name || 'Furniture'} · Stock: {product.stock}
            {avgRating > 0 ? ` · ${avgRating}★` : ''}
          </p>
          <p>{product.description}</p>

          <div className="detail-actions">
            <button type="button" className="btn btn-primary" onClick={addToCart}>
              Add to cart
            </button>
          </div>

          {message && <p className="success">{message}</p>}
          {error && <p className="error">{error}</p>}

          <div className="reviews">
            <h2>Reviews</h2>
            {reviews.length === 0 && (
              <p className="muted">No approved reviews yet.</p>
            )}
            {reviews.map((review) => (
              <div key={review.id} className="review-item">
                <strong>
                  {review.user?.name || 'Customer'} · {review.rating}★
                </strong>
                <p>{review.comment}</p>
              </div>
            ))}

            <form className="form-stack" onSubmit={submitReview} style={{ marginTop: '1rem' }}>
              <h3>Write a review</h3>
              <label>
                Rating
                <select
                  className="select"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Comment
                <textarea
                  className="textarea"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="How does it look in your space?"
                />
              </label>
              <button type="submit" className="btn btn-secondary">
                Submit review
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
