import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

/* ── Gallery data with real stock images ─────────────────── */
const ITEMS = [
  {
    id: 'g1', span: 'tall', label: 'Morning Ritual',
    tag: 'Coffee',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop',
    desc: 'Single-origin pour-over at golden hour',
  },
  {
    id: 'g2', span: 'wide', label: 'The Bar',
    tag: 'Nightlife',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800&auto=format&fit=crop',
    desc: 'Curated spirits lit by amber candlelight',
  },
  {
    id: 'g3', span: 'square', label: 'Espresso Art',
    tag: 'Coffee',
    image: 'https://images.unsplash.com/photo-1507133750040-4a8f57021571?q=80&w=800&auto=format&fit=crop',
    desc: 'Precision extraction, every shot matters',
  },
  {
    id: 'g4', span: 'square', label: 'Midnight Cocktail',
    tag: 'Bar',
    image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=800&auto=format&fit=crop',
    desc: 'Smoked old fashioned, crafted to perfection',
  },
  {
    id: 'g5', span: 'tall', label: 'Cozy Corner',
    tag: 'Interior',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop',
    desc: 'Where every seat feels like home',
  },
  {
    id: 'g6', span: 'wide', label: 'Garden Spritz',
    tag: 'Cocktails',
    image: 'https://images.unsplash.com/photo-1574085733277-851d9d856a3a?q=80&w=800&auto=format&fit=crop',
    desc: 'Rosé champagne, botanicals, fresh petals',
  },
  {
    id: 'g7', span: 'square', label: 'Latte Season',
    tag: 'Coffee',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=800&auto=format&fit=crop',
    desc: 'Seasonal oat latte with cinnamon',
  },
  {
    id: 'g8', span: 'square', label: 'Live Jazz Night',
    tag: 'Events',
    image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=800&auto=format&fit=crop',
    desc: 'Every Friday — live music from 9 PM',
  },
  {
    id: 'g9', span: 'wide', label: 'Dessert Noir',
    tag: 'Desserts',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=800&auto=format&fit=crop',
    desc: 'Dark chocolate fondant, molten heart',
  },
];

/* ── Scene card ──────────────────────────────────────────── */
function GalleryCard({ item, index, onOpen }) {
  const classes = {
    tall:   'row-span-2',
    wide:   'col-span-2',
    square: '',
  };

  return (
    <motion.div
      id={`gallery-card-${item.id}`}
      className={`relative overflow-hidden rounded-2xl cursor-pointer group ${classes[item.span]}`}
      style={{ minHeight: item.span === 'tall' ? 420 : 200 }}
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.65, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.02 }}
      onClick={() => onOpen(item)}
    >
      {/* Background image scene */}
      <img
        src={item.image}
        alt={item.label}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/35 group-hover:bg-black/20 transition-colors duration-400" />

      {/* Gold border glow on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
                      transition-opacity duration-400 pointer-events-none"
        style={{ boxShadow: 'inset 0 0 0 1.5px rgba(198,139,78,0.5)' }} />

      {/* Bottom overlay with text details */}
      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0
                      transition-transform duration-400"
        style={{ background: 'linear-gradient(0deg,rgba(13,8,5,0.95) 0%,rgba(13,8,5,0.6) 60%,transparent 100%)' }}>
        <div className="flex items-end justify-between gap-2">
          <div>
            <span className="block font-body text-[10px] text-caramel/90 uppercase tracking-widest mb-0.5 font-bold">
              {item.tag}
            </span>
            <h3 className="font-display text-base font-bold text-white leading-tight">
              {item.label}
            </h3>
            <p className="font-body text-xs text-cream/90 mt-0.5 opacity-0 group-hover:opacity-100
                          transition-opacity duration-300 delay-75">
              {item.desc}
            </p>
          </div>
          <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                          opacity-0 group-hover:opacity-100 transition-all duration-300
                          translate-y-2 group-hover:translate-y-0"
            style={{ background: 'linear-gradient(135deg,#C68B4E,#D4A853)' }}>
            <svg className="w-3.5 h-3.5 text-espresso" fill="none" stroke="#1A0A00" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Lightbox ────────────────────────────────────────────── */
function Lightbox({ item, onClose }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />

      <motion.div
        className="relative w-full max-w-2xl rounded-3xl overflow-hidden bg-espresso border border-gold-mid"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        onClick={e => e.stopPropagation()}
        style={{ boxShadow: '0 25px 60px rgba(0,0,0,0.8)' }}
      >
        {/* Full Image */}
        <div className="relative h-96 w-full">
          <img
            src={item.image}
            alt={item.label}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-espresso to-transparent" />
        </div>

        {/* Info */}
        <div className="p-8 bg-espresso">
          <span className="font-body text-xs text-caramel uppercase tracking-widest font-extrabold">{item.tag}</span>
          <h3 className="font-display text-2xl font-bold text-white mt-2 mb-3">{item.label}</h3>
          <p className="font-body text-sm text-cream/90 leading-relaxed">{item.desc}</p>
        </div>

        {/* Close */}
        <button
          id="lightbox-close"
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center
                     border border-gold-subtle text-white hover:border-gold transition-colors"
          style={{ background:'rgba(13,8,5,0.8)' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </motion.div>
    </motion.div>
  );
}

/* ── Filter tabs ─────────────────────────────────────────── */
const FILTERS = ['All', 'Coffee', 'Bar', 'Cocktails', 'Interior', 'Events', 'Desserts', 'Nightlife'];

/* ── Main Gallery ────────────────────────────────────────── */
export default function Gallery() {
  const [filter, setFilter]     = useState('All');
  const [selected, setSelected] = useState(null);
  const headRef = useRef(null);
  const inView  = useInView(headRef, { once: true, margin: '-80px' });

  const visible = filter === 'All' ? ITEMS : ITEMS.filter(i => i.tag === filter);

  return (
    <section id="gallery" aria-labelledby="gallery-heading"
      className="relative py-24 lg:py-32 overflow-hidden"
      style={{ background:'linear-gradient(180deg,#110907 0%,#0D0805 50%,#110907 100%)' }}>

      {/* Bg accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 w-full h-px"
          style={{ background:'linear-gradient(90deg,transparent,rgba(198,139,78,0.3),transparent)' }}/>
        <div className="absolute bottom-0 w-full h-px"
          style={{ background:'linear-gradient(90deg,transparent,rgba(198,139,78,0.3),transparent)' }}/>
        <div className="absolute top-1/4 left-0 w-80 h-80 opacity-8 rounded-full"
          style={{ background:'radial-gradient(circle,#C68B4E,transparent 70%)', filter:'blur(80px)', opacity:0.06 }}/>
        <div className="absolute bottom-1/4 right-0 w-80 h-80 opacity-8 rounded-full"
          style={{ background:'radial-gradient(circle,#4A0E1A,transparent 70%)', filter:'blur(80px)', opacity:0.08 }}/>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">

        {/* Header */}
        <motion.div ref={headRef} className="text-center mb-14"
          initial={{ opacity:0, y:30 }}
          animate={inView ? { opacity:1, y:0 } : {}}
          transition={{ duration:0.8, ease:[0.22,1,0.36,1] }}>
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs
                             font-body font-medium uppercase tracking-[0.2em] text-caramel
                             border border-gold-subtle"
              style={{ background:'rgba(198,139,78,0.08)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-caramel"/>
              Visual Stories
            </span>
          </div>
          <h2 id="gallery-heading"
            className="font-display text-4xl sm:text-5xl lg:text-[3.2rem] font-bold leading-[1.1] mb-4">
            <span className="text-white">Life Inside</span>{' '}
            <span className="text-gold-gradient">Noir &amp; Brew</span>
          </h2>
          <p className="font-body text-base text-cream/90 max-w-lg mx-auto leading-relaxed">
            Moments of craft, connection, and warmth captured from our floors — morning through midnight.
          </p>
        </motion.div>

        {/* Filter pills */}
        <motion.div className="flex flex-wrap justify-center gap-2 mb-12"
          initial={{ opacity:0, y:20 }}
          animate={inView ? { opacity:1, y:0 } : {}}
          transition={{ duration:0.7, delay:0.15 }}
          role="group" aria-label="Gallery filters">
          {FILTERS.map(f => (
            <motion.button
              key={f}
              id={`gallery-filter-${f.toLowerCase()}`}
              whileTap={{ scale:0.95 }}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-body font-medium
                          uppercase tracking-widest transition-all duration-300
                          ${filter === f
                            ? 'text-espresso shadow-gold'
                            : 'text-cream/80 border border-gold-subtle hover:text-cream hover:border-gold-mid'
                          }`}
              style={filter === f
                ? { background:'linear-gradient(135deg,#C68B4E,#E8B86D)', fontWeight: 'bold' }
                : {}}>
              {f}
            </motion.button>
          ))}
        </motion.div>

        {/* Masonry grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            className="grid grid-cols-2 lg:grid-cols-3 auto-rows-[220px] gap-4"
            initial={{ opacity:0 }}
            animate={{ opacity:1 }}
            exit={{ opacity:0 }}
            transition={{ duration:0.3 }}>
            {visible.map((item, i) => (
              <GalleryCard key={item.id} item={item} index={i} onOpen={setSelected} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Count */}
        <motion.div className="text-center mt-10"
          initial={{ opacity:0 }} animate={inView ? { opacity:1 } : {}}
          transition={{ delay:0.5 }}>
          <p className="font-body text-xs text-cream/70 uppercase tracking-widest font-semibold">
            Showing {visible.length} of {ITEMS.length} moments
          </p>
          <div className="divider-gold max-w-xs mx-auto mt-4">
            <span className="font-accent text-base text-caramel/50">Noir &amp; Brew</span>
          </div>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <Lightbox item={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
