import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { getApiUrl } from '../config';

const NAV_LINKS = [
  { label: 'Home',    to: '/'        },
  { label: 'Menu',    to: '/menu'    },
  { label: 'About',   to: '/about'   },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Contact', to: '/contact' },
];

/* ── Logo SVG ──────────────────────────────────────────────── */
function LogoIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="18" cy="18" r="17" stroke="url(#logoGrad)" strokeWidth="1.5" />
      <path
        d="M10 22 C10 22 12 14 18 14 C24 14 26 22 26 22"
        stroke="url(#logoGrad)" strokeWidth="1.5" strokeLinecap="round"
      />
      <path d="M14 18 C14 18 16 13 18 11" stroke="url(#logoGrad)" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M22 18 C22 18 20 13 18 11" stroke="url(#logoGrad)" strokeWidth="1.2" strokeLinecap="round" />
      <ellipse cx="18" cy="23" rx="6" ry="2.5" stroke="url(#logoGrad)" strokeWidth="1.2" />
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#C68B4E" />
          <stop offset="0.5" stopColor="#D4A853" />
          <stop offset="1" stopColor="#E8B86D" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ── Hamburger ─────────────────────────────────────────────── */
function Hamburger({ open, toggle }) {
  return (
    <button
      id="navbar-hamburger"
      onClick={toggle}
      aria-label={open ? 'Close menu' : 'Open menu'}
      aria-expanded={open}
      className="relative flex flex-col justify-center items-center w-10 h-10 rounded-lg
                 border border-gold-subtle hover:border-gold-mid transition-colors duration-200
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-caramel lg:hidden"
    >
      <span className={`block w-5 h-0.5 bg-caramel rounded transition-all duration-300
                        ${open ? 'rotate-45 translate-y-1.5' : ''}`} />
      <span className={`block w-5 h-0.5 bg-caramel rounded my-1 transition-all duration-300
                        ${open ? 'opacity-0 scale-x-0' : ''}`} />
      <span className={`block w-5 h-0.5 bg-caramel rounded transition-all duration-300
                        ${open ? '-rotate-45 -translate-y-1.5' : ''}`} />
    </button>
  );
}

/* ── Navbar ────────────────────────────────────────────────── */
export default function Navbar({ cart = [], removeFromCart, clearCart }) {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [cartOpen, setCartOpen]   = useState(false);
  const [isOrdered, setIsOrdered] = useState(false);
  
  // States to ask for customer identity
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Bill to Table'); // 'Bill to Table' or 'Direct Pay'
  
  // Simulated Card Payment States
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  const [placedOrderDetails, setPlacedOrderDetails] = useState(null);

  const location                  = useLocation();
  const menuRef                   = useRef(null);

  /* Scroll detection */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Close mobile menu on route change */
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  /* Close on outside click */
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  /* Lock scroll when menu is open */
  useEffect(() => {
    document.body.style.overflow = (menuOpen || cartOpen) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen, cartOpen]);

  // Aggregate quantity
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);

  // Compute Total Cost
  const totalCost = cart.reduce((sum, item) => {
    const numericPrice = parseFloat(item.price.replace('$', '')) || 0;
    return sum + (numericPrice * item.qty);
  }, 0);

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !tableNumber) {
      alert('Please fill out all identity fields to submit your order.');
      return;
    }

    if (paymentMethod === 'Direct Pay' && (!cardNumber || !cardExpiry || !cardCvc)) {
      alert('Please fill out the card details to complete your direct payment.');
      return;
    }

    try {
      // Map cart to items schema format
      const orderData = {
        items: cart.map((i) => ({
          name: i.name,
          qty: i.qty,
          price: i.price,
        })),
        totalCost: totalCost,
        customerName: customerName,
        customerPhone: customerPhone,
        tableNumber: tableNumber,
        paymentMethod: paymentMethod,
      };

      const response = await axios.post(getApiUrl('/api/orders'), orderData);

      if (response.data && response.data.success) {
        setPlacedOrderDetails(response.data.data);
        setIsOrdered(true);
        if (clearCart) clearCart();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Could not complete checkout order.');
    }
  };

  const handleResetCartState = () => {
    setIsOrdered(false);
    setShowCheckoutForm(false);
    setPlacedOrderDetails(null);
    setCustomerName('');
    setCustomerPhone('');
    setTableNumber('');
    setPaymentMethod('Bill to Table');
    setCardNumber('');
    setCardExpiry('');
    setCardCvc('');
    setCartOpen(false);
  };

  return (
    <>
      <motion.header
        id="navbar"
        role="banner"
        ref={menuRef}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`
          fixed top-0 left-0 right-0 z-50
          transition-all duration-500 ease-in-out
          ${scrolled
            ? 'py-3 backdrop-blur-xl border-b'
            : 'py-5 border-b border-transparent'
          }
        `}
        style={{
          background: scrolled
            ? 'rgba(13, 8, 5, 0.92)'
            : 'linear-gradient(180deg, rgba(13,8,5,0.85) 0%, transparent 100%)',
          borderBottomColor: scrolled ? 'rgba(198,139,78,0.15)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
        }}
      >
        <nav
          className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 flex items-center justify-between"
          aria-label="Main navigation"
        >
          {/* ── Logo ── */}
          <Link
            to="/"
            id="navbar-logo"
            className="flex items-center gap-3 group focus:outline-none"
            aria-label="Noir & Brew Home"
          >
            <motion.div
              whileHover={{ rotate: 10, scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <LogoIcon />
            </motion.div>
            <div className="flex flex-col leading-none">
              <span className="font-display text-xl font-bold tracking-wide text-gold-gradient">
                Noir &amp; Brew
              </span>
              <span className="font-accent text-xs text-caramel/60 tracking-[0.15em] mt-0.5">
                est. 2018
              </span>
            </div>
          </Link>

          {/* ── Desktop nav links ── */}
          <ul className="hidden lg:flex items-center gap-1" role="list">
            {NAV_LINKS.map(({ label, to }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  id={`nav-link-${label.toLowerCase()}`}
                  className={({ isActive }) =>
                    `relative px-4 py-2 text-sm font-body font-medium tracking-wide rounded-lg
                     transition-colors duration-200 group
                     ${isActive ? 'text-caramel' : 'text-cream/70 hover:text-cream'}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {label}
                      <span
                        className={`
                          absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full
                          transition-all duration-300
                          ${isActive
                            ? 'w-4 bg-gold opacity-100'
                            : 'w-0 bg-caramel/50 group-hover:w-4 group-hover:opacity-100 opacity-0'
                          }
                        `}
                      />
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* ── Desktop CTA & Cart ── */}
          <div className="flex items-center gap-3">
            {/* Cart Icon Button */}
            <motion.button
              onClick={() => setCartOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2.5 rounded-full border border-gold-subtle/50 bg-charcoal-dark/30
                         hover:border-gold-mid transition-all duration-300 flex items-center justify-center"
            >
              <span className="text-lg">🛒</span>
              {totalQty > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gold text-espresso font-display font-bold
                                 text-[10px] w-5 h-5 rounded-full flex items-center justify-center animate-pulse glow-gold">
                  {totalQty}
                </span>
              )}
            </motion.button>

            <Link
              to="/contact"
              id="navbar-reserve-cta"
              className="hidden lg:inline-flex btn-primary text-xs px-6 py-2.5"
            >
              Reserve a Table
            </Link>

            {/* ── Mobile hamburger ── */}
            <Hamburger open={menuOpen} toggle={() => setMenuOpen(v => !v)} />
          </div>
        </nav>

        {/* ── Mobile menu dropdown ── */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              id="navbar-mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              key="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="lg:hidden overflow-hidden border-t border-gold-subtle"
              style={{ background: 'rgba(13,8,5,0.97)', backdropFilter: 'blur(24px)' }}
            >
              <ul className="flex flex-col px-6 py-6 gap-1" role="list">
                {NAV_LINKS.map(({ label, to }, i) => (
                  <motion.li
                    key={to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.3 }}
                  >
                    <NavLink
                      to={to}
                      id={`mobile-nav-${label.toLowerCase()}`}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-body font-medium
                         transition-all duration-200
                         ${isActive
                           ? 'text-caramel bg-caramel/10 border border-gold-subtle'
                           : 'text-cream/70 hover:text-cream hover:bg-white/5'
                         }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <span className={`w-1.5 h-1.5 rounded-full transition-all duration-200
                                            ${isActive ? 'bg-gold' : 'bg-cream/20'}`} />
                          {label}
                        </>
                      )}
                    </NavLink>
                  </motion.li>
                ))}

                {/* Mobile CTA */}
                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: NAV_LINKS.length * 0.06 + 0.05, duration: 0.3 }}
                  className="mt-4 pt-4 border-t border-gold-subtle"
                >
                  <Link
                    to="/contact"
                    id="mobile-reserve-cta"
                    className="btn-primary w-full justify-center text-xs"
                  >
                    Reserve a Table
                  </Link>
                </motion.li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* ── Cart Sliding Panel Drawer ── */}
      <AnimatePresence>
        {cartOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
              onClick={() => !isOrdered && handleResetCartState()}
            />

            {/* Panel */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-[#0C0704]/98
                         border-l border-gold-subtle/50 backdrop-blur-2xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto"
              style={{ boxShadow: '-10px 0 40px rgba(0,0,0,0.8)' }}
            >
              {isOrdered && placedOrderDetails ? (
                /* Gorgeous Interactive Customer Receipt */
                <div className="flex-1 flex flex-col justify-center py-6">
                  <div className="text-center mb-6">
                    <span className="text-5xl block mb-3 animate-bounce">☕✨</span>
                    <h3 className="font-display text-2xl font-bold text-gold-gradient">Order Dispatched!</h3>
                    <p className="font-body text-xs text-cream/70 mt-1 max-w-[280px] mx-auto font-semibold">
                      Our baristas and mixologists are currently preparing your artisanal selection.
                    </p>
                  </div>

                  {/* Glassmorphic Invoice Receipt Card */}
                  <div className="glass-card p-6 border border-gold-mid bg-white/[0.02] rounded-2xl flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b border-gold-subtle/30 pb-3">
                      <span className="font-body text-[10px] text-cream/60 uppercase tracking-widest font-bold">Order Reference</span>
                      <span className="font-body text-xs text-gold font-bold font-mono">{placedOrderDetails._id}</span>
                    </div>

                    <div className="flex justify-between text-xs">
                      <div>
                        <span className="block text-[10px] text-cream/60 uppercase tracking-widest font-bold mb-0.5">Guest Identity</span>
                        <span className="text-white font-bold text-sm">{placedOrderDetails.customerName}</span>
                      </div>
                      <div className="text-right">
                        <span className="block text-[10px] text-cream/60 uppercase tracking-widest font-bold mb-0.5">Location</span>
                        <span className="text-gold font-extrabold text-sm">{placedOrderDetails.tableNumber}</span>
                      </div>
                    </div>

                    <div className="flex justify-between text-xs border-t border-gold-subtle/20 pt-3">
                      <div>
                        <span className="block text-[10px] text-cream/60 uppercase tracking-widest font-bold mb-0.5">Payment Method</span>
                        <span className="text-white font-semibold text-xs flex items-center gap-1">
                          {placedOrderDetails.paymentMethod === 'Direct Pay' ? '💳 Paid Online (Direct)' : '💵 Bill to Table'}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="block text-[10px] text-cream/60 uppercase tracking-widest font-bold mb-0.5">Prep Alert</span>
                        <span className="text-green-400 font-bold text-xs uppercase">🟢 Kitchen Notified</span>
                      </div>
                    </div>

                    <div className="border-t border-gold-subtle/25 pt-3">
                      <span className="block text-[10px] text-cream/60 uppercase tracking-widest font-bold mb-2">Artisanal Selections</span>
                      <div className="flex flex-col gap-2 max-h-[140px] overflow-y-auto pr-1">
                        {placedOrderDetails.items.map((itm, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs font-semibold text-cream">
                            <span>{itm.name} <span className="text-caramel/90 font-bold">&times; {itm.qty}</span></span>
                            <span className="text-gold">{itm.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-gold-subtle/35 pt-4 flex items-center justify-between font-bold">
                      <span className="font-body text-xs text-cream/80 uppercase tracking-widest">Total Amount</span>
                      <span className="font-display text-lg text-gold-gradient">${Number(placedOrderDetails.totalCost).toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleResetCartState}
                    className="btn-primary w-full justify-center py-4 mt-6 text-xs font-bold tracking-widest"
                  >
                    Done &bull; Return to Site
                  </button>
                </div>
              ) : showCheckoutForm ? (
                /* Customer Details Collection Form */
                <div className="flex-1 flex flex-col justify-between py-4">
                  <div>
                    <div className="flex items-center justify-between border-b border-gold-subtle/40 pb-5 mb-6">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                        <h3 className="font-display text-lg font-bold text-cream">Order Details</h3>
                      </div>
                      <button
                        onClick={() => setShowCheckoutForm(false)}
                        className="text-cream/70 hover:text-cream text-xs uppercase font-body tracking-wider font-bold"
                      >
                        ← Back
                      </button>
                    </div>

                    <form onSubmit={handleCheckoutSubmit} className="flex flex-col gap-4">
                      <div>
                        <label className="block font-body text-[10px] text-caramel uppercase tracking-widest mb-1.5 font-bold">
                          Your Full Name
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Alexander Mercer"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full bg-[#130A05] border border-gold-mid rounded-xl px-4 py-2.5 text-white text-sm font-body font-semibold placeholder-cream/30 focus:outline-none focus:border-gold"
                        />
                      </div>

                      <div>
                        <label className="block font-body text-[10px] text-caramel uppercase tracking-widest mb-1.5 font-bold">
                          Contact Number
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="e.g. +1 (555) 019-2834"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          className="w-full bg-[#130A05] border border-gold-mid rounded-xl px-4 py-2.5 text-white text-sm font-body font-semibold placeholder-cream/30 focus:outline-none focus:border-gold"
                        />
                      </div>

                      <div>
                        <label className="block font-body text-[10px] text-caramel uppercase tracking-widest mb-1.5 font-bold">
                          Table Number / Seat Location
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Table 4 / Bar Seat B"
                          value={tableNumber}
                          onChange={(e) => setTableNumber(e.target.value)}
                          className="w-full bg-[#130A05] border border-gold-mid rounded-xl px-4 py-2.5 text-white text-sm font-body font-semibold placeholder-cream/30 focus:outline-none focus:border-gold"
                        />
                      </div>

                      {/* Payment Method Switcher */}
                      <div>
                        <label className="block font-body text-[10px] text-caramel uppercase tracking-widest mb-2 font-bold">
                          Select Payment Method
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setPaymentMethod('Bill to Table')}
                            className={`py-3 px-4 rounded-xl font-body text-xs font-bold border transition-all duration-300 flex items-center justify-center gap-1.5
                              ${paymentMethod === 'Bill to Table'
                                ? 'bg-gold/10 border-gold text-gold'
                                : 'bg-transparent border-gold-subtle/50 text-cream/70 hover:text-cream'}`}
                          >
                            💵 Bill to Table
                          </button>
                          <button
                            type="button"
                            onClick={() => setPaymentMethod('Direct Pay')}
                            className={`py-3 px-4 rounded-xl font-body text-xs font-bold border transition-all duration-300 flex items-center justify-center gap-1.5
                              ${paymentMethod === 'Direct Pay'
                                ? 'bg-gold/10 border-gold text-gold'
                                : 'bg-transparent border-gold-subtle/50 text-cream/70 hover:text-cream'}`}
                          >
                            💳 Pay Directly
                          </button>
                        </div>
                      </div>

                      {/* Simulated Card Inputs when Direct Pay is active */}
                      <AnimatePresence>
                        {paymentMethod === 'Direct Pay' && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="glass-card p-4 border border-gold-subtle/80 bg-white/[0.01] rounded-xl flex flex-col gap-3"
                          >
                            <div>
                              <label className="block font-body text-[9px] text-cream/50 uppercase tracking-widest mb-1 font-bold">Simulated Card Number</label>
                              <input
                                type="text"
                                required
                                maxLength="19"
                                placeholder="4111 2222 3333 4444"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                                className="w-full bg-[#0D0805] border border-gold-subtle/60 rounded-lg px-3 py-2 text-white text-xs font-body font-semibold focus:outline-none focus:border-gold"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block font-body text-[9px] text-cream/50 uppercase tracking-widest mb-1 font-bold">Expiry Date</label>
                                <input
                                  type="text"
                                  required
                                  maxLength="5"
                                  placeholder="MM/YY"
                                  value={cardExpiry}
                                  onChange={(e) => setCardExpiry(e.target.value)}
                                  className="w-full bg-[#0D0805] border border-gold-subtle/60 rounded-lg px-3 py-2 text-white text-xs font-body font-semibold focus:outline-none focus:border-gold"
                                />
                              </div>
                              <div>
                                <label className="block font-body text-[9px] text-cream/50 uppercase tracking-widest mb-1 font-bold">Security (CVC)</label>
                                <input
                                  type="password"
                                  required
                                  maxLength="3"
                                  placeholder="123"
                                  value={cardCvc}
                                  onChange={(e) => setCardCvc(e.target.value)}
                                  className="w-full bg-[#0D0805] border border-gold-subtle/60 rounded-lg px-3 py-2 text-white text-xs font-body font-semibold focus:outline-none focus:border-gold"
                                />
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="glass-card p-3 mt-1 border border-gold-subtle bg-white/[0.01] rounded-xl text-center">
                        <span className="block font-body text-[9px] text-cream/50 uppercase tracking-widest mb-0.5">Estimated Total</span>
                        <span className="font-display text-base font-bold text-gold-gradient">${totalCost.toFixed(2)}</span>
                      </div>

                      <button
                        type="submit"
                        className="btn-primary w-full justify-center py-3.5 mt-2 text-xs font-bold tracking-widest"
                      >
                        Confirm &amp; Place Order
                      </button>
                    </form>
                  </div>
                </div>
              ) : (
                /* Cart Items List Drawer State */
                <>
                  {/* Drawer Header */}
                  <div>
                    <div className="flex items-center justify-between border-b border-gold-subtle/40 pb-5 mb-6">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🛒</span>
                        <h3 className="font-display text-lg font-bold text-cream">Your Selection</h3>
                      </div>
                      <button
                        onClick={() => setCartOpen(false)}
                        className="text-cream/70 hover:text-cream text-xs uppercase font-body tracking-wider font-bold"
                      >
                        ✕ Close
                      </button>
                    </div>

                    {/* Cart Items List */}
                    {cart.length === 0 ? (
                      <div className="py-20 text-center flex flex-col items-center gap-3">
                        <svg className="w-10 h-10 text-caramel mb-2 opacity-85" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                        <h4 className="font-display text-sm font-semibold text-cream/70">Your cart is empty</h4>
                        <p className="font-body text-[11px] text-cream/60 max-w-[200px] font-medium leading-relaxed">
                          Explore our signature menus to add single-origin coffees and seasonal cocktails.
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4 overflow-y-auto max-h-[50vh] pr-2">
                        {cart.map((item) => (
                          <div
                            key={item.id}
                            className="glass-card p-4 flex items-center justify-between border border-gold-subtle/50 bg-white/[0.01]"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 rounded-lg object-cover border border-gold-subtle/30 shrink-0"
                              />
                              <div>
                                <h4 className="font-display text-xs font-semibold text-cream">{item.name}</h4>
                                <p className="font-body text-[10px] text-caramel/80 mt-0.5">
                                  {item.price} &bull; Qty: {item.qty}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => removeFromCart && removeFromCart(item.id)}
                              className="text-burgundy-light hover:text-burgundy text-[11px] uppercase font-bold tracking-wider"
                            >
                              ✕ Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Summary & Checkout */}
                  {cart.length > 0 && (
                    <div className="border-t border-gold-subtle/40 pt-6 mt-6">
                      <div className="flex items-center justify-between mb-6">
                        <span className="font-body text-xs text-cream/60 uppercase tracking-widest font-bold">Estimated Total</span>
                        <span className="font-display text-xl font-bold text-gold-gradient">${totalCost.toFixed(2)}</span>
                      </div>
                      <button
                        onClick={() => setShowCheckoutForm(true)}
                        className="btn-primary w-full justify-center py-4 text-xs font-bold tracking-widest"
                      >
                        Complete Order &bull; Place Request
                      </button>
                    </div>
                  )}
                </>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Backdrop for mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </>
  );
}
