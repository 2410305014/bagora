import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PRODUCTS, ACCESSORIES } from '../data/products';
import { useCart } from '../context/CartContext';
import { getProductById, addReview } from '../services/api';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist, showToast } = useCart();

  // Find product by id, fallback to Luxe Carryall
  const [product, setProduct] = useState(PRODUCTS.find((p) => p.id === id) || PRODUCTS[0]);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState(
    product.colors?.[0]?.name || 'Tan'
  );
  const [activeTab, setActiveTab] = useState('description');

  // Review form state
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Fetch from backend
  useEffect(() => {
    getProductById(id)
      .then((res) => {
        if (res.data) {
          setProduct(res.data);
          if (res.data.related) setRelatedProducts(res.data.related);
          if (res.data.colors?.[0]?.name) setSelectedColor(res.data.colors[0].name);
        }
      })
      .catch(() => {});
  }, [id]);

  const gallery = product.gallery && product.gallery.length > 0
    ? product.gallery
    : [product.image];

  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedColor, 1);
  };

  const handleQuickPay = () => {
    addToCart(product, selectedColor, 1);
    navigate('/cart');
  };

  const handleAddAccessory = (accessory) => {
    addToCart(
      {
        id: accessory.id,
        name: accessory.name,
        price: accessory.price,
        image: accessory.image
      },
      'Standard',
      1
    );
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      showToast('Please write a comment.', 'error');
      return;
    }
    setSubmittingReview(true);
    try {
      const res = await addReview(product.id, {
        author: reviewAuthor || 'Verified Client',
        rating: reviewRating,
        comment: reviewComment
      });
      if (res.data?.product) {
        setProduct(res.data.product);
      }
      showToast('Review submitted! Thank you for your feedback.', 'success');
      setReviewAuthor('');
      setReviewComment('');
      setReviewRating(5);
    } catch {
      showToast('Could not submit review. Please try again.', 'error');
    }
    setSubmittingReview(false);
  };

  return (
    <div className="relative w-full pt-16 bg-background min-h-screen">
      {/* Product Detail Sub-Header */}
      <div className="sticky top-16 z-30 bg-surface/90 backdrop-blur-xl border-b border-surface-container/60 px-margin-mobile md:px-margin-desktop py-2.5">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors"
            aria-label="Go Back"
          >
            <span className="material-symbols-outlined text-on-surface text-[20px]">
              arrow_back_ios_new
            </span>
          </button>
          <span className="font-title-sm text-sm text-on-surface truncate font-medium">
            {product.name}
          </span>
          <div className="w-10 flex justify-end">
            <span className="font-label-caps text-[10px] text-secondary uppercase tracking-widest font-semibold">
              Atelier
            </span>
          </div>
        </div>
      </div>

      <main className="max-w-[1280px] mx-auto pb-safe">
        <div className="flex flex-col md:flex-row gap-8 md:p-8">
          {/* Left Column: Image Gallery */}
          <div className="w-full md:w-1/2">
            <div className="relative w-full h-[400px] md:h-[540px] bg-surface-container overflow-hidden md:rounded-2xl group">
              {/* Slides Container */}
              <div
                className="flex w-full h-full transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${activeImageIdx * 100}%)` }}
              >
                {gallery.map((imgUrl, idx) => (
                  <div key={idx} className="w-full h-full flex-shrink-0 relative">
                    <img
                      src={imgUrl}
                      alt={`${product.name} view ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                aria-label="Add to Wishlist"
                className="absolute top-4 right-4 w-10 h-10 bg-surface/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md z-10 transition-transform active:scale-90"
              >
                <span
                  className={`material-symbols-outlined text-title-sm transition-colors ${
                    isWishlisted ? "text-error" : "text-on-surface"
                  }`}
                  style={{ fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0" }}
                >
                  favorite
                </span>
              </button>

              {/* Gallery Indicator Dots */}
              {gallery.length > 1 && (
                <div className="absolute bottom-4 left-0 w-full flex justify-center gap-2 z-10">
                  {gallery.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIdx(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        activeImageIdx === idx
                          ? 'w-6 bg-primary'
                          : 'w-1.5 bg-primary/30 hover:bg-primary/60'
                      }`}
                      aria-label={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Desktop Thumbnail strip */}
            {gallery.length > 1 && (
              <div className="hidden md:flex gap-3 mt-4">
                {gallery.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImageIdx === idx
                        ? 'border-secondary shadow-md'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Info & Actions */}
          <div className="w-full md:w-1/2 flex flex-col justify-start">
            {/* Product Header */}
            <div className="px-margin-mobile md:px-0 pt-stack-md pb-stack-sm">
              <div className="flex justify-between items-start mb-2">
                <h1 className="font-headline-md-mobile md:font-headline-md text-headline-md-mobile md:text-headline-md text-on-surface tracking-tight">
                  {product.name}
                </h1>
              </div>

              {/* Star Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-secondary-fixed-dim">
                  <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined text-[16px]">star_half</span>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  ({product.reviewsCount || 128} reviews)
                </span>
              </div>

              {/* Pricing & Sale Tag */}
              <div className="flex items-end gap-3 pb-4 border-b border-surface-container">
                <span className="font-title-sm text-[28px] text-on-surface font-semibold">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="font-body-md text-body-md text-on-surface-variant line-through mb-1">
                    ${product.originalPrice}
                  </span>
                )}
                {product.badge && (
                  <span className="bg-error-container text-on-error-container font-label-caps text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider mb-1.5 ml-auto">
                    {product.badge}
                  </span>
                )}
              </div>
            </div>

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="px-margin-mobile md:px-0 py-stack-md">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-title-sm text-sm text-on-surface">
                    Color: <span className="font-body-sm text-on-surface-variant ml-1 font-normal">{selectedColor}</span>
                  </span>
                </div>
                <div className="flex gap-4">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setSelectedColor(c.name)}
                      aria-label={`Select ${c.name}`}
                      className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        selectedColor === c.name
                          ? 'ring-2 ring-primary ring-offset-2 scale-105'
                          : 'ring-2 ring-transparent ring-offset-2 hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    >
                      {selectedColor === c.name && (
                        <span className="w-8 h-8 rounded-full border border-white/40"></span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Information Tabs */}
            <div className="mt-2 border-t border-surface-container">
              <div className="flex w-full px-margin-mobile md:px-0 pt-4 relative">
                {[
                  { id: 'description', label: 'Description' },
                  { id: 'details', label: 'Details' },
                  { id: 'shipping', label: 'Shipping' },
                  { id: 'reviews', label: `Reviews (${product.reviews?.length || product.reviewsCount || 0})` }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 pb-3 font-title-sm text-xs md:text-sm text-center relative transition-colors ${
                      activeTab === tab.id ? 'text-primary font-semibold' : 'text-on-surface-variant hover:text-primary'
                    }`}
                  >
                    {tab.label}
                    <div
                      className={`absolute bottom-0 left-0 w-full h-[2px] bg-primary transition-opacity duration-300 ${
                        activeTab === tab.id ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  </button>
                ))}
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-surface-variant -z-10" />
              </div>

              {/* Tab Contents */}
              <div className="px-margin-mobile md:px-0 py-stack-md min-h-[140px]">
                {activeTab === 'description' && (
                  <div className="animate-fade-in">
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                      {product.description ||
                        'Crafted from full-grain Italian leather, this luxury bag is designed to age beautifully with a rich natural patina. Its structured silhouette offers an effortless transition from work to evening leisure.'}
                    </p>
                  </div>
                )}

                {activeTab === 'details' && (
                  <div className="animate-fade-in">
                    <ul className="font-body-sm text-body-sm text-on-surface-variant space-y-2">
                      {(product.details || [
                        'Dimensions: 14" H x 13" W x 6" D',
                        'Handle Drop: 9.5"',
                        'Material: 100% Full-grain bovine leather',
                        'Interior: Faux suede lining with zip pocket'
                      ]).map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-2 flex-shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeTab === 'shipping' && (
                  <div className="animate-fade-in space-y-4">
                    <div className="flex gap-3">
                      <span className="material-symbols-outlined text-secondary">local_shipping</span>
                      <div>
                        <p className="font-title-sm text-xs font-semibold text-on-surface">Free Standard Shipping</p>
                        <p className="font-body-sm text-[12px] text-on-surface-variant">Arrives in 3-5 business days across the globe</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <span className="material-symbols-outlined text-secondary">assignment_return</span>
                      <div>
                        <p className="font-title-sm text-xs font-semibold text-on-surface">30-Day Returns</p>
                        <p className="font-body-sm text-[12px] text-on-surface-variant">Return in original condition for a full refund</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="animate-fade-in space-y-6">
                    {/* Existing reviews */}
                    {product.reviews && product.reviews.length > 0 ? (
                      <div className="space-y-4">
                        {product.reviews.map((review) => (
                          <div key={review.id} className="bg-surface-container/40 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-title-sm text-xs font-semibold text-on-surface">{review.author}</span>
                              <span className="font-body-sm text-[11px] text-on-surface-variant">{review.date}</span>
                            </div>
                            <div className="flex items-center gap-0.5 mb-2">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <span key={i} className={`material-symbols-outlined text-[14px] ${i < review.rating ? 'text-secondary' : 'text-on-surface-variant/30'}`} style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                              ))}
                            </div>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="font-body-sm text-body-sm text-on-surface-variant">No reviews yet. Be the first to share your experience.</p>
                    )}

                    {/* Submit a review */}
                    <form onSubmit={handleSubmitReview} className="bg-surface-container/30 rounded-xl p-4 space-y-3 mt-4 border border-surface-container">
                      <h4 className="font-title-sm text-xs font-semibold text-on-surface">Write a Review</h4>
                      <input
                        className="w-full bg-transparent border-b border-surface-dim text-primary font-body-sm text-sm py-1.5 px-0 outline-none placeholder:text-on-surface-variant"
                        placeholder="Your name (optional)"
                        value={reviewAuthor}
                        onChange={(e) => setReviewAuthor(e.target.value)}
                      />
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <button key={i} type="button" onClick={() => setReviewRating(i + 1)}>
                            <span className={`material-symbols-outlined text-[20px] cursor-pointer ${i < reviewRating ? 'text-secondary' : 'text-on-surface-variant/30'}`} style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                          </button>
                        ))}
                      </div>
                      <textarea
                        className="w-full bg-transparent border border-surface-dim rounded-lg text-primary font-body-sm text-sm p-2 outline-none placeholder:text-on-surface-variant resize-none h-20"
                        placeholder="Share your experience with this product..."
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        required
                      />
                      <button
                        type="submit"
                        disabled={submittingReview}
                        className="bg-primary text-on-primary font-label-caps text-label-caps px-5 py-2 rounded-full hover:bg-secondary transition-colors text-xs"
                      >
                        {submittingReview ? 'Submitting...' : 'Submit Review'}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Action Buttons */}
            <div className="hidden md:flex gap-4 mt-6 pt-4 border-t border-surface-container">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-4 rounded-full bg-primary text-on-primary font-title-sm text-sm hover:bg-secondary transition-all active:scale-98 shadow-md"
              >
                Add to Cart
              </button>
              <button
                onClick={handleQuickPay}
                aria-label="Instant Checkout"
                className="px-6 py-4 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface flex items-center justify-center transition-all active:scale-98"
              >
                <span className="material-symbols-outlined mr-2">payments</span>
                Instant Pay
              </button>
            </div>
          </div>
        </div>

        {/* Complete the Look Cross-Sell Section */}
        <div className="mt-12 px-margin-mobile md:px-margin-desktop mb-32">
          <h2 className="font-headline-md-mobile md:font-headline-md text-[22px] text-on-surface mb-stack-md">
            Complete the Look
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {ACCESSORIES.map((acc) => (
              <div key={acc.id} className="flex flex-col gap-2 group">
                <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-surface-container">
                  <img
                    src={acc.image}
                    alt={acc.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <button
                    onClick={() => handleAddAccessory(acc)}
                    aria-label={`Add ${acc.name}`}
                    className="absolute bottom-2 right-2 w-8 h-8 bg-surface/90 rounded-full flex items-center justify-center text-on-surface shadow-md hover:bg-primary hover:text-on-primary transition-all active:scale-90"
                  >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                  </button>
                </div>
                <div>
                  <h3 className="font-title-sm text-xs text-on-surface truncate">{acc.name}</h3>
                  <p className="font-body-sm text-xs text-on-surface-variant">${acc.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fixed Mobile Bottom Action Bar */}
        <div className="md:hidden fixed bottom-0 left-0 w-full bg-surface/95 backdrop-blur-xl px-margin-mobile py-3.5 pb-safe shadow-[0_-4px_24px_rgba(0,0,0,0.06)] z-40 border-t border-surface-container">
          <div className="flex gap-3 max-w-md mx-auto">
            <button
              onClick={handleAddToCart}
              className="flex-1 py-3.5 rounded-full bg-primary text-on-primary font-title-sm text-body-md transition-transform active:scale-98 shadow-sm hover:bg-secondary"
            >
              Add to Cart
            </button>
            <button
              onClick={handleQuickPay}
              aria-label="Quick Pay"
              className="w-14 h-14 rounded-full bg-surface-container-high flex items-center justify-center transition-transform active:scale-98"
            >
              <span className="material-symbols-outlined text-on-surface">payments</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
