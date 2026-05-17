import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/* ── Star Rating Component ──────────────────────────────── */
function GoldStars({ count = 5 }) {
  return (
    <div className="flex gap-1">
      {[...Array(count)].map((_, i) => (
        <svg
          key={i}
          className="w-4 h-4 text-gold drop-shadow-[0_0_8px_rgba(212,168,83,0.5)]"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

/* ── Testimonial Card Component ─────────────────────────── */
function TestimonialCard({ item, idx }) {
  return (
    <motion.div
      id={`testimonial-card-${idx}`}
      variants={{
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
      }}
      className="glass-card p-8 flex flex-col relative overflow-hidden group hover:border-caramel/40 transition-all duration-300"
      style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)' }}
      whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.7), 0 0 30px rgba(198,139,78,0.08)' }}
    >
      {/* Decorative Quote Mark Background */}
      <span className="absolute -top-4 -right-2 text-9xl font-display text-caramel/5 select-none pointer-events-none group-hover:text-caramel/10 transition-colors duration-500">
        “
      </span>

      {/* Review Text */}
      <blockquote className="font-body text-sm text-cream/70 leading-relaxed italic mb-8 relative z-10">
        &ldquo;{item.text}&rdquo;
      </blockquote>

      {/* Star Rating */}
      <div className="mb-4">
        <GoldStars count={item.stars} />
      </div>

      {/* User Information Profile */}
      <div className="flex items-center gap-4 mt-auto pt-6 border-t border-gold-subtle/50">
        {/* Glowing Profile Avatar */}
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center font-display font-bold text-espresso text-base shrink-0 select-none relative group-hover:ring-1 group-hover:ring-gold-light transition-all duration-300"
          style={{ background: item.avatarBg }}
        >
          {item.initials}
          {/* Subtle Ring Glow */}
          <div className="absolute inset-0 rounded-full opacity-30 blur-[2px] border border-gold" />
        </div>

        <div>
          <cite className="not-italic font-display text-sm font-semibold text-cream block">
            {item.name}
          </cite>
          <span className="font-body text-[10px] text-caramel/70 uppercase tracking-widest block mt-0.5">
            {item.role}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Section Label ──────────────────────────────────────── */
function SectionLabel({ children }) {
  return (
    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs
                     font-body font-medium uppercase tracking-[0.2em] text-caramel
                     border border-gold-subtle mb-6"
      style={{ background: 'rgba(198,139,78,0.08)' }}>
      <span className="w-1.5 h-1.5 rounded-full bg-caramel" />
      {children}
    </span>
  );
}

/* ── Data ────────────────────────────────────────────────── */
const TESTIMONIALS_DATA = [
  {
    text: "The Smoked Old Fashioned is culinary art. The table service is immaculate, and the low-lit live jazz music creates an evening lounge atmosphere you simply cannot find anywhere else in the city.",
    stars: 5,
    name: "Dr. Adrian Vance",
    role: "Regular & Cocktail Critic",
    initials: "AV",
    avatarBg: "linear-gradient(135deg, #C68B4E 0%, #D4A853 100%)",
  },
  {
    text: "As a specialty coffee purist, their Ethiopian pour-over blew me away. Bright, floral, and perfectly extracted. The transition from active morning coffee bar to luxurious nightlife venue is seamless.",
    stars: 5,
    name: "Genevieve Roche",
    role: "Specialty Coffee Roaster",
    initials: "GR",
    avatarBg: "linear-gradient(135deg, #8B5A44 0%, #C68B4E 100%)",
  },
  {
    text: "Noir & Brew is my absolute sanctuary. Excellent Wi-Fi and ambient vibes during the day, and the most outstanding craft espresso martinis by night. The owners truly treat you like family.",
    stars: 5,
    name: "Julian Sterling",
    role: "Creative Director",
    initials: "JS",
    avatarBg: "linear-gradient(135deg, #4A0E1A 0%, #D4A853 100%)",
  },
];

/* ── Main Component ──────────────────────────────────────── */
export default function Testimonials() {
  const containerRef = useRef(null);
  const inView = useInView(containerRef, { once: true, margin: '-100px' });

  return (
    <section
      id="testimonials"
      ref={containerRef}
      aria-labelledby="testimonials-heading"
      className="relative py-24 lg:py-32 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0D0805 0%, #120906 50%, #0D0805 100%)' }}
    >
      {/* Background Accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(198,139,78,0.2), transparent)' }}/>
        <div className="absolute bottom-0 left-0 w-full h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(198,139,78,0.2), transparent)' }}/>
        <div className="absolute top-1/2 left-0 w-80 h-80 opacity-[0.04] rounded-full"
          style={{ background: 'radial-gradient(circle, #4A0E1A, transparent 70%)', filter: 'blur(75px)' }}/>
        <div className="absolute bottom-0 right-0 w-96 h-96 opacity-[0.04] rounded-full"
          style={{ background: 'radial-gradient(circle, #C68B4E, transparent 70%)', filter: 'blur(80px)' }}/>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        
        {/* Header Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex justify-center">
            <SectionLabel>Guest Stories</SectionLabel>
          </div>
          <h2 id="testimonials-heading"
            className="font-display text-4xl sm:text-5xl lg:text-[3.2rem] font-bold leading-[1.1] mb-4">
            <span className="text-ivory">Beloved By Our</span>{' '}
            <span className="text-gold-gradient">Regulars</span>
          </h2>
          <p className="font-body text-base text-cream/55 max-w-xl mx-auto leading-relaxed">
            Do not just take our word for it. Explore the experiences of those who call Noir &amp; Brew their second home.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } }
          }}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {TESTIMONIALS_DATA.map((testimonial, idx) => (
            <TestimonialCard key={idx} item={testimonial} idx={idx} />
          ))}
        </motion.div>

        {/* Bottom Flourish */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="divider-gold max-w-xs mx-auto">
            <span className="font-accent text-base text-caramel/50">Since 2012</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
