import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';

/* ─── Animation variants ─────────────────────────────────── */
const fadeUp = {
  hidden:  { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

const scaleIn = {
  hidden:  { opacity: 0, scale: 0.85 },
  visible: (delay = 0) => ({
    opacity: 1, scale: 1,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

/* ─── Floating badge card ────────────────────────────────── */
function FloatingCard({ id, icon, label, value, className, delay = 0 }) {
  return (
    <motion.div
      id={id}
      variants={scaleIn}
      initial="hidden"
      animate="visible"
      custom={delay}
      className={`glass-card px-4 py-3 flex items-center gap-3 animate-float select-none ${className}`}
    >
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="text-[10px] text-cream/50 uppercase tracking-widest leading-none">{label}</p>
        <p className="text-sm font-display font-semibold text-caramel leading-snug">{value}</p>
      </div>
    </motion.div>
  );
}

/* ─── Coffee cup SVG illustration ───────────────────────── */
function CoffeeCupIllustration() {
  return (
    <svg
      viewBox="0 0 320 380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full drop-shadow-2xl"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="plateGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#5C3317" />
          <stop offset="100%" stopColor="#1C0D03" />
        </radialGradient>
        <radialGradient id="cupGrad" cx="30%" cy="20%" r="80%">
          <stop offset="0%" stopColor="#3D1F00" />
          <stop offset="60%" stopColor="#2D1500" />
          <stop offset="100%" stopColor="#1A0A00" />
        </radialGradient>
        <radialGradient id="coffeeGrad" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#6B3A2A" />
          <stop offset="100%" stopColor="#3B1F0A" />
        </radialGradient>
        <radialGradient id="foamGrad" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#DDB280" />
          <stop offset="100%" stopColor="#C68B4E" />
        </radialGradient>
        <linearGradient id="goldAccent" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#C68B4E" />
          <stop offset="100%" stopColor="#D4A853" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Ambient glow */}
      <ellipse cx="160" cy="340" rx="100" ry="18" fill="rgba(198,139,78,0.12)" />

      {/* Saucer */}
      <ellipse cx="160" cy="300" rx="110" ry="22" fill="url(#plateGrad)" />
      <ellipse cx="160" cy="298" rx="110" ry="22" fill="url(#plateGrad)" opacity="0.8" />
      <ellipse cx="160" cy="296" rx="100" ry="18" fill="#3D1F00" opacity="0.5" />
      {/* Saucer gold rim */}
      <ellipse cx="160" cy="300" rx="110" ry="22" stroke="url(#goldAccent)" strokeWidth="1.5" fill="none" />
      <ellipse cx="160" cy="296" rx="100" ry="18" stroke="url(#goldAccent)" strokeWidth="0.8" fill="none" opacity="0.5" />

      {/* Cup body */}
      <path
        d="M80 180 L65 295 Q65 300 75 300 L245 300 Q255 300 255 295 L240 180 Z"
        fill="url(#cupGrad)"
      />
      {/* Cup highlight */}
      <path
        d="M90 185 L77 280"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="12"
        strokeLinecap="round"
      />

      {/* Cup rim */}
      <ellipse cx="160" cy="180" rx="80" ry="16" fill="#3D1F00" />
      <ellipse cx="160" cy="178" rx="80" ry="16" fill="#2D1500" />
      <ellipse cx="160" cy="178" rx="80" ry="16" stroke="url(#goldAccent)" strokeWidth="1.5" fill="none" />

      {/* Coffee surface */}
      <ellipse cx="160" cy="178" rx="74" ry="14" fill="url(#coffeeGrad)" />

      {/* Latte art — leaf pattern */}
      <g opacity="0.7">
        <path d="M160 172 Q150 170 140 165" stroke="#DDB280" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M160 172 Q170 170 180 165" stroke="#DDB280" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M160 174 Q148 173 138 170" stroke="#DDB280" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        <path d="M160 174 Q172 173 182 170" stroke="#DDB280" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        <circle cx="160" cy="172" r="6" fill="url(#foamGrad)" opacity="0.6" />
      </g>

      {/* Handle */}
      <path
        d="M240 210 Q290 210 290 245 Q290 275 240 275"
        stroke="url(#cupGrad)"
        strokeWidth="18"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M240 210 Q290 210 290 245 Q290 275 240 275"
        stroke="url(#goldAccent)"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
        opacity="0.5"
      />

      {/* Steam wisps */}
      <g opacity="0.5">
        <path
          d="M130 160 Q125 140 130 120 Q135 100 130 80"
          stroke="url(#goldAccent)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        >
          <animate attributeName="opacity" values="0.3;0.7;0.3" dur="3s" repeatCount="indefinite" />
          <animateTransform attributeName="transform" type="translate" values="0,0;3,-5;0,0" dur="3s" repeatCount="indefinite" />
        </path>
        <path
          d="M160 155 Q155 130 160 108 Q165 86 160 64"
          stroke="url(#goldAccent)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        >
          <animate attributeName="opacity" values="0.5;0.8;0.5" dur="2.5s" repeatCount="indefinite" begin="0.5s" />
          <animateTransform attributeName="transform" type="translate" values="0,0;-3,-5;0,0" dur="2.5s" repeatCount="indefinite" begin="0.5s" />
        </path>
        <path
          d="M190 160 Q195 138 190 116 Q185 94 190 72"
          stroke="url(#goldAccent)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        >
          <animate attributeName="opacity" values="0.2;0.6;0.2" dur="3.5s" repeatCount="indefinite" begin="1s" />
          <animateTransform attributeName="transform" type="translate" values="0,0;4,-6;0,0" dur="3.5s" repeatCount="indefinite" begin="1s" />
        </path>
      </g>

      {/* Gold rim detail on cup base */}
      <path
        d="M65 295 Q65 300 75 300 L245 300 Q255 300 255 295"
        stroke="url(#goldAccent)"
        strokeWidth="1.2"
        fill="none"
        opacity="0.6"
      />
    </svg>
  );
}

/* ─── Decorative stars / particles ──────────────────────── */
function StarParticle({ style, delay }) {
  return (
    <motion.div
      className="absolute rounded-full bg-gold/30"
      style={style}
      animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.3, 1] }}
      transition={{ duration: 3 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
    />
  );
}

/* ─── Hero ───────────────────────────────────────────────── */
export default function Hero() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] });
  const bgY     = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const textY   = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const particles = [
    { w: 3, h: 3, top: '20%', left: '10%' },
    { w: 2, h: 2, top: '55%', left: '5%' },
    { w: 4, h: 4, top: '75%', left: '15%' },
    { w: 3, h: 3, top: '30%', left: '88%' },
    { w: 2, h: 2, top: '65%', left: '92%' },
    { w: 5, h: 5, top: '15%', left: '75%' },
  ];

  return (
    <section
      id="hero"
      ref={containerRef}
      aria-labelledby="hero-heading"
      className="relative min-h-screen flex items-center bg-bar-texture overflow-hidden"
    >
      {/* ── Parallax background layer ── */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ y: bgY }}>
        {/* Deep radial glow */}
        <div className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 70% at 20% 60%, rgba(198,139,78,0.07) 0%, transparent 70%), ' +
              'radial-gradient(ellipse 60% 50% at 80% 20%, rgba(74,14,26,0.25) 0%, transparent 60%), ' +
              'radial-gradient(ellipse 40% 40% at 60% 90%, rgba(45,51,25,0.15) 0%, transparent 50%)',
          }}
        />
        {/* Noise grain */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
      </motion.div>

      {/* Floating star particles */}
      {particles.map((p, i) => (
        <StarParticle
          key={i}
          style={{ width: p.w, height: p.h, top: p.top, left: p.left }}
          delay={i * 0.4}
        />
      ))}

      {/* ── Main content grid ── */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12
                   grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center
                   pt-32 pb-20 lg:pt-28 lg:pb-16"
        style={{ y: textY, opacity }}
      >

        {/* ────── LEFT: Coffee cup illustration ────── */}
        <motion.div
          className="relative flex items-center justify-center order-2 lg:order-1"
          variants={scaleIn}
          initial="hidden"
          animate="visible"
          custom={0.2}
        >
          {/* Large ambient glow behind cup */}
          <div
            className="absolute w-[420px] h-[420px] rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(198,139,78,0.12) 0%, transparent 70%)',
              filter: 'blur(40px)',
              transform: 'translate(-5%, 5%)',
            }}
          />

          {/* Rotating decorative ring */}
          <motion.div
            className="absolute w-[360px] h-[360px] rounded-full border border-gold/10 pointer-events-none"
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute w-[300px] h-[300px] rounded-full border border-caramel/10 pointer-events-none"
            animate={{ rotate: -360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            style={{ borderStyle: 'dashed' }}
          />

          {/* Cup illustration */}
          <div className="relative w-64 h-80 sm:w-72 sm:h-96 animate-float">
            <CoffeeCupIllustration />
          </div>

          {/* ── Floating info cards ── */}
          <FloatingCard
            id="hero-card-rating"
            icon="⭐"
            label="Customer Rating"
            value="4.9 / 5.0"
            className="absolute -top-4 -right-4 sm:top-4 sm:right-0 animate-float"
            delay={0.5}
          />
          <FloatingCard
            id="hero-card-drinks"
            icon="🍸"
            label="Signature Cocktails"
            value="40+ Creations"
            className="absolute -bottom-2 -left-4 sm:bottom-4 sm:left-0 animate-float-slow"
            delay={0.7}
          />
          <FloatingCard
            id="hero-card-hours"
            icon="🕯️"
            label="Open Hours"
            value="7 AM – 2 AM"
            className="absolute top-1/2 -left-8 sm:-left-12 -translate-y-1/2 animate-float"
            delay={0.9}
          />
        </motion.div>

        {/* ────── RIGHT: Text content ────── */}
        <div className="flex flex-col order-1 lg:order-2 text-center lg:text-left">

          {/* Eyebrow badge */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={0.1}
            className="flex justify-center lg:justify-start mb-6"
          >
            <span
              id="hero-badge"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs
                         font-body font-medium uppercase tracking-[0.2em] text-caramel
                         border border-gold-subtle"
              style={{ background: 'rgba(198,139,78,0.08)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-caramel animate-pulse" />
              Now Open · Downtown
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            id="hero-heading"
            variants={fadeUp} initial="hidden" animate="visible" custom={0.2}
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] text-balance mb-6"
          >
            <span className="text-ivory block">Where Coffee</span>
            <span className="text-gold-gradient block mt-1">Meets the Night</span>
          </motion.h1>

          {/* Decorative divider */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={0.3}
            className="divider-gold max-w-xs mx-auto lg:mx-0 my-2"
          >
            <span className="font-accent text-sm text-caramel/70">Noir &amp; Brew</span>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp} initial="hidden" animate="visible" custom={0.4}
            className="font-body text-base sm:text-lg text-cream/65 leading-relaxed max-w-md mx-auto lg:mx-0 mb-10"
          >
            Handcrafted single-origin coffees by day. Artisanal cocktails, curated wines, and
            live jazz by night. A sanctuary for those who savour every sip.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={0.5}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12"
          >
            <Link to="/contact" id="hero-cta-reserve" className="btn-primary">
              <span>Reserve a Table</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link to="/menu" id="hero-cta-menu" className="btn-ghost">
              <svg className="w-4 h-4 text-caramel" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13
                         C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13
                         C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13
                         C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>Explore Menu</span>
            </Link>
          </motion.div>

          {/* Stats strip */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={0.6}
            className="grid grid-cols-3 gap-4 pt-8 border-t border-gold-subtle max-w-sm mx-auto lg:mx-0"
          >
            {[
              { value: '12+', label: 'Years of Craft' },
              { value: '200+', label: 'Menu Items'    },
              { value: '50K+', label: 'Happy Guests'  },
            ].map(({ value, label }, i) => (
              <div key={i} className="text-center lg:text-left">
                <p className="font-display text-2xl font-bold text-gold-gradient leading-none">{value}</p>
                <p className="font-body text-xs text-cream/50 mt-1 leading-snug">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* ── Scroll indicator ── */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2
                   text-cream/30 text-xs font-body tracking-widest uppercase"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        style={{ opacity }}
      >
        <span>Scroll</span>
        <motion.div
          className="w-0.5 h-8 bg-gradient-to-b from-caramel/60 to-transparent rounded-full"
          animate={{ scaleY: [1, 0.4, 1], originY: 0 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  );
}
