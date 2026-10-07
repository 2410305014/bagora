import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PRODUCTS, CATEGORIES } from '../data/products';
import ProductCard from '../components/common/ProductCard';
import { useCart } from '../context/CartContext';
import { getProducts, getCategories, subscribeNewsletter } from '../services/api';

export default function HomePage() {
  const navigate = useNavigate();
  const { showToast } = useCart();
  const [email, setEmail] = useState('');
  const [bestsellers, setBestsellers] = useState(PRODUCTS.filter((p) => p.isBestseller).slice(0, 4));
  const [newArrivals, setNewArrivals] = useState(PRODUCTS.filter((p) => p.isNewArrival));
  const [categories, setCategories] = useState(CATEGORIES);

  useEffect(() => {
    // Fetch from backend, fallback to local data
    getProducts({ isBestseller: true })
      .then((res) => setBestsellers((res.data || []).slice(0, 4)))
      .catch(() => {});
    getProducts({ isNewArrival: true })
      .then((res) => setNewArrivals(res.data || []))
      .catch(() => {});
    getCategories()
      .then((res) => setCategories(res.data || CATEGORIES))
      .catch(() => {});
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    try {
      const res = await subscribeNewsletter(email);
      showToast(res.message || 'Thank you for joining the Bagora Inner Circle!', 'success');
    } catch {
      showToast('Thank you for joining the Bagora Inner Circle!', 'success');
    }
    setEmail('');
  };

  return (
    <main className="relative w-full pt-16 bg-background min-h-screen">
      <div className="flex flex-col w-full pb-safe">
        {/* Hero Section */}
        <section className="relative w-full h-[65vh] min-h-[520px] max-h-[720px]">
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url('/assets/hero-bag.png'), url('https://lh3.googleusercontent.com/aida-public/AB6AXuA0dGUT7xfatGx471r_W1ODrh2DbnjQC6WjNnYqjoK3qgDYaEYikmTPJHaJ05zCrC3WhvY5N65Frlo28JHyiJd7bPqAPrkal68isBVBWrBXInUWmSiqxYq1RV8dMPe_37o1oGeQVUeac2ZH2JXZ5EV3J85JAImLdL6qwm1R2KPeJOBUVPAnRCKT4aqSpbjXvP99hItt-ejo167_-DyZUkP7qdyAk01juzI5TPTjHODSyk9v0yAgwghs')`
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-tertiary/75 via-tertiary/30 to-transparent"></div>
          </div>
          <div className="relative h-full max-w-[1280px] mx-auto flex flex-col justify-end px-margin-mobile md:px-margin-desktop pb-section-gap text-center sm:text-left">
            <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-primary mb-stack-md leading-tight max-w-xl">
              Carry Your<br />Style Everywhere
            </h1>
            <p className="font-body-md text-body-md text-on-primary/90 mb-stack-lg max-w-md">
              Discover our latest collection of meticulously crafted leather goods designed for the modern lifestyle.
            </p>
            <div className="flex flex-col sm:flex-row gap-stack-sm w-full max-w-md">
              <button
                onClick={() => navigate('/handbags')}
                className="bg-on-primary-fixed-variant text-on-primary px-8 py-4 font-label-caps text-label-caps tracking-widest uppercase transition-colors hover:bg-secondary active:scale-98 shadow-md"
              >
                Shop Now
              </button>
              <button
                onClick={() => navigate('/product/luxe-leather-carryall')}
                className="bg-transparent border border-on-primary text-on-primary px-8 py-4 font-label-caps text-label-caps tracking-widest uppercase hover:bg-on-primary/10 transition-colors active:scale-98 backdrop-blur-xs"
              >
                Explore Collection
              </button>
            </div>
          </div>
        </section>

        {/* Featured Categories (Horizontal Scroll) */}
        <section className="py-section-gap px-0 max-w-[1280px] mx-auto w-full">
          <div className="px-margin-mobile md:px-margin-desktop mb-stack-md flex justify-between items-end">
            <h2 className="font-headline-md-mobile md:font-headline-md text-headline-md-mobile md:text-headline-md text-primary">
              Shop by Category
            </h2>
            <Link
              to="/handbags"
              className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors border-b border-transparent hover:border-primary"
            >
              View All
            </Link>
          </div>
          <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar px-margin-mobile md:px-margin-desktop gap-stack-md pb-stack-sm">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to="/handbags"
                className="snap-start shrink-0 w-32 flex flex-col items-center group"
              >
                <div className="w-24 h-24 rounded-full bg-surface-container overflow-hidden mb-stack-sm relative ring-2 ring-transparent group-hover:ring-secondary transition-all">
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors z-10"></div>
                  <img
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    src={cat.image}
                    alt={cat.name}
                    loading="lazy"
                  />
                </div>
                <span className="font-title-sm text-title-sm text-primary text-center group-hover:text-secondary transition-colors">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Best Selling Products Grid */}
        <section className="py-section-gap px-margin-mobile md:px-margin-desktop bg-surface-bright">
          <div className="max-w-[1280px] mx-auto">
            <div className="mb-stack-lg text-center">
              <h2 className="font-headline-md-mobile md:font-headline-md text-headline-md-mobile md:text-headline-md text-primary mb-stack-sm">
                Bestsellers
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Our most coveted pieces, chosen by you.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-stack-md gap-y-stack-lg">
              {bestsellers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="mt-stack-lg flex justify-center">
              <Link
                to="/handbags"
                className="bg-transparent border border-outline text-primary px-8 py-4 font-label-caps text-label-caps tracking-widest uppercase hover:bg-surface-container transition-colors"
              >
                Shop All Bestsellers
              </Link>
            </div>
          </div>
        </section>

        {/* Editorial Section / Trending Now */}
        <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-[1280px] mx-auto w-full">
          <div className="relative w-full aspect-[3/4] md:aspect-[21/9] rounded-2xl overflow-hidden mb-stack-md shadow-[0_15px_40px_rgba(0,0,0,0.06)]">
            <img
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCoReVFy70-gCtIUkijnZt6qR8-jJbUdBkVOKFyj8UYrCctXIZgepIjGCw0JAwIbXyIktd-O2PI_dfJdKqSLs10CxMv-fhXBolWJCHYWbMgiz3H2T2qcAUK04_tfSYRZ51-JBMaY-ZlVd68oetkbzXsVI0lpNRttepOQsVph0q5zMbyiHW_tKXdGg49T8FtzvWInxsIkDzFknLA2zHtCdXed17Hm-q3WXJkMGHNr5n9HENaSk55nTc0"
              alt="Editorial fashion shot"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/30 to-transparent flex flex-col justify-end p-stack-lg md:p-12">
              <span className="inline-block px-3 py-1 bg-surface-container-lowest text-primary font-label-caps text-label-caps uppercase tracking-widest w-fit mb-stack-sm rounded">
                Trending
              </span>
              <h2 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-primary mb-stack-sm max-w-xl">
                The Woven Collection
              </h2>
              <p className="font-body-md text-body-md text-on-primary/90 mb-stack-md max-w-lg">
                Intricate craftsmanship meets everyday versatility. Explore our new hand-woven leather pieces.
              </p>
              <Link
                to="/handbags"
                className="bg-on-primary-fixed-variant text-on-primary px-6 py-3 font-label-caps text-label-caps tracking-widest uppercase w-fit hover:bg-secondary transition-colors rounded"
              >
                Discover
              </Link>
            </div>
          </div>
        </section>

        {/* New Arrivals (Horizontal Scroll) */}
        <section className="py-section-gap bg-surface-container-low pl-margin-mobile md:pl-margin-desktop">
          <div className="max-w-[1280px] mx-auto">
            <div className="mb-stack-md pr-margin-mobile md:pr-margin-desktop flex justify-between items-end">
              <h2 className="font-headline-md-mobile md:font-headline-md text-headline-md-mobile md:text-headline-md text-primary">
                New Arrivals
              </h2>
            </div>
            <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-stack-md pb-stack-sm pr-margin-mobile md:pr-margin-desktop">
              {newArrivals.map((product) => (
                <div key={product.id} className="snap-start shrink-0 w-[240px]">
                  <ProductCard product={product} aspectRatio="aspect-square" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-section-gap px-margin-mobile md:px-margin-desktop text-center max-w-[1280px] mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-lg">
            <div className="flex flex-col items-center">
              <span
                className="material-symbols-outlined text-[36px] text-secondary mb-stack-sm"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                workspace_premium
              </span>
              <h3 className="font-title-sm text-title-sm text-primary mb-1">
                Premium Quality
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant max-w-[260px]">
                Ethically sourced, full-grain leathers crafted by master artisans in Italy.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <span
                className="material-symbols-outlined text-[36px] text-secondary mb-stack-sm"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                local_shipping
              </span>
              <h3 className="font-title-sm text-title-sm text-primary mb-1">
                Complimentary Shipping
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant max-w-[260px]">
                Enjoy free worldwide shipping and easy 30-day returns on all orders.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <span
                className="material-symbols-outlined text-[36px] text-secondary mb-stack-sm"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                support_agent
              </span>
              <h3 className="font-title-sm text-title-sm text-primary mb-1">
                Concierge Service
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant max-w-[260px]">
                Our dedicated styling team is available 24/7 to assist with your selection.
              </p>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-section-gap px-margin-mobile md:px-margin-desktop bg-on-primary-fixed-variant text-on-primary text-center">
          <div className="max-w-[1280px] mx-auto">
            <h2 className="font-headline-md-mobile md:font-headline-md text-headline-md-mobile md:text-headline-md mb-stack-sm">
              Join the Inner Circle
            </h2>
            <p className="font-body-md text-body-md text-on-primary/80 mb-stack-lg max-w-sm mx-auto">
              Subscribe for early access to new collections, private sales, and styling advice.
            </p>
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-stack-sm max-w-md mx-auto w-full"
            >
              <input
                className="w-full bg-transparent border-b-2 border-on-primary/30 px-4 py-3 text-on-primary placeholder:text-on-primary/50 focus:outline-none focus:border-secondary transition-colors font-body-md"
                placeholder="Your email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                className="bg-secondary text-on-secondary px-6 py-3 font-label-caps text-label-caps tracking-widest uppercase hover:bg-secondary-fixed hover:text-primary transition-colors mt-stack-sm sm:mt-0 whitespace-nowrap"
                type="submit"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
