import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/* ── Animation helpers ──────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay } },
});
const fadeLeft = (delay = 0) => ({
  hidden:  { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0,  transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay } },
});
const fadeRight = (delay = 0) => ({
  hidden:  { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0,  transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay } },
});

/* ── Animated counter ───────────────────────────────────── */
function StatCard({ icon, value, label, delay }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      variants={fadeUp(delay)}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      id={`about-stat-${label.toLowerCase().replace(/\s+/g, '-')}`}
      className="glass-card p-6 flex flex-col items-center text-center gap-2 group
                 hover:border-caramel/40 transition-colors duration-300"
    >
      <span className="text-3xl mb-1">{icon}</span>
      <p className="font-display text-3xl font-bold text-gold-gradient leading-none">{value}</p>
      <p className="font-body text-xs text-cream/50 uppercase tracking-widest">{label}</p>
    </motion.div>
  );
}

/* ── Interior SVG illustration ──────────────────────────── */
function CafeInteriorIllustration() {
  return (
    <svg viewBox="0 0 480 520" fill="none" xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full drop-shadow-2xl" aria-hidden="true">
      <defs>
        <linearGradient id="wallGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1A0A00" />
          <stop offset="100%" stopColor="#0D0805" />
        </linearGradient>
        <linearGradient id="woodGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5C3317" />
          <stop offset="100%" stopColor="#3B1F0A" />
        </linearGradient>
        <linearGradient id="goldLine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#C68B4E" />
          <stop offset="50%" stopColor="#E8B86D" />
          <stop offset="100%" stopColor="#C68B4E" />
        </linearGradient>
        <linearGradient id="lightGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E8B86D" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#E8B86D" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="lampGlow" cx="50%" cy="0%" r="60%">
          <stop offset="0%" stopColor="#E8B86D" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#E8B86D" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="tableGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#C68B4E" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#C68B4E" stopOpacity="0" />
        </radialGradient>
        <filter id="softBlur"><feGaussianBlur stdDeviation="3"/></filter>
        <filter id="glow"><feGaussianBlur stdDeviation="6" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/></filter>
      </defs>

      {/* Room background */}
      <rect width="480" height="520" fill="url(#wallGrad)" rx="20"/>

      {/* Back wall panel lines */}
      {[80,160,240,320,400].map(x => (
        <line key={x} x1={x} y1="0" x2={x} y2="340" stroke="rgba(198,139,78,0.06)" strokeWidth="1"/>
      ))}
      {[80,160,240].map(y => (
        <line key={y} x1="0" y1={y} x2="480" y2={y} stroke="rgba(198,139,78,0.05)" strokeWidth="1"/>
      ))}

      {/* Hanging pendant lamp */}
      <line x1="240" y1="0" x2="240" y2="80" stroke="rgba(198,139,78,0.5)" strokeWidth="1.5"/>
      <ellipse cx="240" cy="88" rx="28" ry="10" fill="#1A0A00" stroke="url(#goldLine)" strokeWidth="1.5"/>
      <path d="M212 88 Q220 110 240 115 Q260 110 268 88 Z" fill="#2D1500" stroke="url(#goldLine)" strokeWidth="1"/>
      {/* Light cone */}
      <path d="M220 112 L160 280 L320 280 L260 112 Z" fill="url(#lightGrad)" opacity="0.25"/>
      <ellipse cx="240" cy="90" rx="8" ry="3" fill="#E8B86D" opacity="0.9" filter="url(#glow)"/>
      <ellipse cx="240" cy="200" rx="70" ry="20" fill="url(#lampGlow)"/>

      {/* Back shelf */}
      <rect x="30" y="150" width="420" height="12" fill="url(#woodGrad)" rx="2"/>
      <rect x="30" y="148" width="420" height="3" fill="url(#goldLine)" opacity="0.6" rx="1"/>

      {/* Shelf items */}
      {/* Bottles */}
      {[
        { x: 60,  h: 55, w: 16, col: '#4A0E1A' },
        { x: 90,  h: 65, w: 14, col: '#2D3319' },
        { x: 115, h: 50, w: 18, col: '#3B1F0A' },
        { x: 340, h: 60, w: 15, col: '#4A0E1A' },
        { x: 365, h: 52, w: 17, col: '#2D3319' },
        { x: 393, h: 68, w: 13, col: '#3B1F0A' },
      ].map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={162 - b.h} width={b.w} height={b.h} fill={b.col} rx="2"/>
          <rect x={b.x} y={162 - b.h} width={b.w} height={b.h} stroke="rgba(198,139,78,0.2)" strokeWidth="1" fill="none" rx="2"/>
          <rect x={b.x + 3} y={162 - b.h + 5} width={b.w - 6} height={8} fill="rgba(198,139,78,0.15)" rx="1"/>
        </g>
      ))}

      {/* Coffee machine center shelf */}
      <rect x="190" y="100" width="100" height="60" fill="#1C0D03" rx="6" stroke="url(#goldLine)" strokeWidth="1.2"/>
      <rect x="200" y="108" width="80" height="35" fill="#0D0805" rx="4"/>
      <circle cx="220" cy="138" r="5" fill="#C68B4E" opacity="0.8"/>
      <circle cx="240" cy="138" r="5" fill="#C68B4E" opacity="0.6"/>
      <circle cx="260" cy="138" r="5" fill="#C68B4E" opacity="0.4"/>
      <rect x="210" y="112" width="60" height="18" fill="#1A0A00" rx="2"/>
      <text x="240" y="124" textAnchor="middle" fill="#D4A853" fontSize="7" fontFamily="serif">NOIR &amp; BREW</text>

      {/* Floor */}
      <rect x="0" y="400" width="480" height="120" fill="#0D0805" rx="0"/>
      <rect x="0" y="398" width="480" height="4" fill="url(#goldLine)" opacity="0.3"/>
      {/* Floor tiles */}
      {[0,1,2,3].map(row => [0,1,2,3,4,5].map(col => (
        <rect key={`${row}-${col}`}
          x={col * 80} y={402 + row * 30}
          width="79" height="29"
          fill="none" stroke="rgba(198,139,78,0.05)" strokeWidth="0.8"/>
      )))}

      {/* Bar counter */}
      <rect x="0" y="340" width="480" height="60" fill="url(#woodGrad)" rx="0"/>
      <rect x="0" y="338" width="480" height="5" fill="url(#goldLine)" opacity="0.8"/>
      <rect x="0" y="395" width="480" height="5" fill="url(#goldLine)" opacity="0.4"/>
      {/* Counter front detail */}
      {[80,160,240,320,400].map(x => (
        <rect key={x} x={x - 2} y="345" width="4" height="50" fill="rgba(198,139,78,0.15)" rx="2" key={x}/>
      ))}

      {/* Bar stools */}
      {[80, 200, 300, 400].map((x, i) => (
        <g key={i}>
          <ellipse cx={x} cy={420} rx={22} ry={6} fill="#3B1F0A" stroke="url(#goldLine)" strokeWidth="1"/>
          <line x1={x} y1={426} x2={x} y2={510} stroke="#2D1500" strokeWidth="8"/>
          <line x1={x-14} y1={490} x2={x+14} y2={490} stroke="#2D1500" strokeWidth="4" strokeLinecap="round"/>
        </g>
      ))}

      {/* Coffee cups on counter */}
      {[130, 340].map((x, i) => (
        <g key={i}>
          <ellipse cx={x} cy={342} rx={14} ry={4} fill="#3B1F0A" stroke="url(#goldLine)" strokeWidth="0.8"/>
          <path d={`M${x-12} 340 L${x-9} 355 Q${x-9} 358 ${x} 358 Q${x+9} 358 ${x+9} 355 L${x+12} 340 Z`} fill="#1A0A00" stroke="url(#goldLine)" strokeWidth="0.8"/>
          <ellipse cx={x} cy={340} rx={12} ry={3.5} fill="#3B1F0A"/>
          <ellipse cx={x} cy={339} rx={10} ry={2.8} fill="#6B3A2A" opacity="0.8"/>
          {/* Steam */}
          <path d={`M${x-3} 333 Q${x-1} 326 ${x-3} 319`} stroke="rgba(198,139,78,0.4)" strokeWidth="1.2" strokeLinecap="round" fill="none">
            <animate attributeName="opacity" values="0.2;0.7;0.2" dur="2.5s" repeatCount="indefinite"/>
          </path>
          <path d={`M${x+3} 332 Q${x+5} 325 ${x+3} 318`} stroke="rgba(198,139,78,0.4)" strokeWidth="1.2" strokeLinecap="round" fill="none">
            <animate attributeName="opacity" values="0.5;0.2;0.5" dur="2s" repeatCount="indefinite"/>
          </path>
        </g>
      ))}

      {/* Ambient floor glow */}
      <ellipse cx="240" cy="410" rx="200" ry="30" fill="url(#tableGlow)" filter="url(#softBlur)"/>

      {/* Side sconces */}
      {[40, 440].map((x, i) => (
        <g key={i}>
          <rect x={i === 0 ? x : x - 20} y="200" width="20" height="30" fill="#2D1500" stroke="url(#goldLine)" strokeWidth="1" rx="2"/>
          <ellipse cx={i === 0 ? x + 10 : x - 10} cy="198" rx="10" ry="4" fill="#E8B86D" opacity="0.6" filter="url(#glow)"/>
        </g>
      ))}

      {/* Gold frame border */}
      <rect x="4" y="4" width="472" height="512" rx="17"
        stroke="url(#goldLine)" strokeWidth="1.5" fill="none" opacity="0.4"/>
      <rect x="10" y="10" width="460" height="500" rx="14"
        stroke="rgba(198,139,78,0.15)" strokeWidth="1" fill="none"/>
    </svg>
  );
}

/* ── Philosophy pillar card ─────────────────────────────── */
function PillarCard({ icon, title, text, delay }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      variants={fadeUp(delay)}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className="glass-card p-5 flex gap-4 items-start
                 hover:border-caramel/40 transition-colors duration-300 group"
    >
      <span className="text-2xl mt-0.5 shrink-0">{icon}</span>
      <div>
        <h4 className="font-display text-base font-semibold text-caramel mb-1">{title}</h4>
        <p className="font-body text-sm text-cream/55 leading-relaxed">{text}</p>
      </div>
    </motion.div>
  );
}

/* ── Section label ──────────────────────────────────────── */
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

/* ── Main About component ───────────────────────────────── */
const STATS = [
  { icon: '😊', value: '50K+',  label: 'Happy Customers' },
  { icon: '🍸', value: '200+',  label: 'Signature Drinks' },
  { icon: '☕', value: '12+',   label: 'Years Experience' },
  { icon: '🏆', value: '18',    label: 'Industry Awards'  },
];

const PILLARS = [
  {
    icon: '☕',
    title: 'Single-Origin Coffee',
    text:  'Sourced from family farms in Ethiopia, Colombia, and Guatemala — every bean tells a story of the land it came from.',
  },
  {
    icon: '🍸',
    title: 'Artisanal Cocktails',
    text:  'Our bar team crafts seasonal menus using house-made syrups, fresh botanicals, and rare spirits curated from around the world.',
  },
  {
    icon: '🕯️',
    title: 'Crafted Atmosphere',
    text:  'Low-lit warmth, curated jazz, and carefully chosen materials — every detail of our space is designed to slow you down.',
  },
];

export default function About() {
  const sectionRef = useRef(null);
  const inView     = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      id="about"
      ref={sectionRef}
      aria-labelledby="about-heading"
      className="relative py-24 lg:py-32 overflow-hidden bg-bar-texture"
    >
      {/* Background accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(198,139,78,0.3), transparent)' }}/>
        <div className="absolute bottom-0 left-0 w-full h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(198,139,78,0.3), transparent)' }}/>
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #C68B4E, transparent 70%)', filter: 'blur(60px)' }}/>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #4A0E1A, transparent 70%)', filter: 'blur(60px)' }}/>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">

        {/* ── Top stats strip ── */}
        <motion.div
          variants={fadeUp(0)}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-20"
        >
          {STATS.map((s, i) => (
            <StatCard key={s.label} {...s} delay={i * 0.1} />
          ))}
        </motion.div>

        {/* ── Split layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">

          {/* LEFT — Illustration */}
          <motion.div
            variants={fadeLeft(0.1)}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="relative flex items-center justify-center order-2 lg:order-1"
          >
            {/* Glow behind illustration */}
            <div className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(198,139,78,0.08) 0%, transparent 70%)',
                filter: 'blur(30px)',
              }}/>

            {/* Rotating decorative rings */}
            <motion.div
              className="absolute w-[110%] h-[110%] rounded-3xl border border-gold/10 pointer-events-none"
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}/>

            {/* Illustration frame */}
            <div className="relative w-full max-w-sm lg:max-w-none rounded-3xl overflow-hidden
                            ring-gold shadow-luxury">
              <CafeInteriorIllustration />

              {/* Overlay gradient at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
                style={{ background: 'linear-gradient(0deg, rgba(13,8,5,0.6) 0%, transparent 100%)' }}/>
            </div>

            {/* Floating badge */}
            <motion.div
              className="glass-card absolute -bottom-5 -right-4 sm:-right-6 px-5 py-3
                         flex items-center gap-3 animate-float"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.6, duration: 0.6, ease: [0.22,1,0.36,1] }}
            >
              <span className="text-2xl">🏆</span>
              <div>
                <p className="text-[10px] text-cream/50 uppercase tracking-widest">Best Café</p>
                <p className="text-sm font-display font-semibold text-caramel">City Awards 2024</p>
              </div>
            </motion.div>

            {/* Est. year badge */}
            <motion.div
              className="glass-card absolute -top-4 -left-4 sm:-left-6 px-4 py-3
                         flex items-center gap-2 animate-float-slow"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.8, duration: 0.6, ease: [0.22,1,0.36,1] }}
            >
              <span className="text-xl">📅</span>
              <div>
                <p className="text-[10px] text-cream/50 uppercase tracking-widest">Established</p>
                <p className="text-sm font-display font-semibold text-caramel">Since 2012</p>
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT — Text content */}
          <motion.div
            variants={fadeRight(0.15)}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="flex flex-col order-1 lg:order-2"
          >
            <SectionLabel>Our Story</SectionLabel>

            <h2 id="about-heading"
              className="font-display text-4xl sm:text-5xl lg:text-[3.2rem] font-bold
                         leading-[1.1] text-balance mb-6">
              <span className="text-ivory">More Than a</span>
              <br />
              <span className="text-gold-gradient">Cup of Coffee</span>
            </h2>

            {/* Decorative divider */}
            <div className="divider-gold max-w-xs mb-6">
              <span className="font-accent text-sm text-caramel/70">A Decade of Craft</span>
            </div>

            <p className="font-body text-base text-cream/65 leading-relaxed mb-4">
              Born from a single obsession — <em className="text-caramel not-italic">the perfect cup</em> — Noir
              &amp; Brew opened its doors in 2012 in a converted warehouse in the heart of the city. What began
              as a specialty coffee roastery evolved into something far richer: a full-service bar where the
              ritual of morning coffee flows seamlessly into the artistry of evening cocktails.
            </p>
            <p className="font-body text-base text-cream/65 leading-relaxed mb-10">
              Today, we are a gathering place for those who appreciate quality without compromise — a space
              where baristas and bartenders share equal reverence for their craft, and every guest leaves
              carrying a little more warmth than when they arrived.
            </p>

            {/* Philosophy pillars */}
            <div className="flex flex-col gap-3 mb-10">
              {PILLARS.map((p, i) => (
                <PillarCard key={p.title} {...p} delay={0.2 + i * 0.1} />
              ))}
            </div>

            {/* Signature line */}
            <div className="flex items-center gap-4 pt-6 border-t border-gold-subtle">
              {/* Avatar placeholder */}
              <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0
                              border border-gold-subtle text-2xl"
                style={{ background: 'rgba(198,139,78,0.1)' }}>
                ☕
              </div>
              <div>
                <p className="font-display text-sm font-semibold text-caramel">Marcus &amp; Elena Dubois</p>
                <p className="font-body text-xs text-cream/45">Founders, Noir &amp; Brew</p>
              </div>
              {/* Signature flourish */}
              <div className="ml-auto hidden sm:block">
                <span className="font-accent text-2xl text-caramel/50 select-none">N&amp;B</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
