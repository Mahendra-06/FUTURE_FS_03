import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

/* ── Data ────────────────────────────────────────────────── */
const MENU = {
  Coffee: [
    { id: 'c1', name: 'Ethiopian Yirgacheffe',   price: '$7.50', desc: 'Single-origin pour-over with bright citrus and floral jasmine notes.',   image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop', featured: true  },
    { id: 'c2', name: 'Noir Signature Espresso', price: '$5.00', desc: 'Our house double-shot blend — rich chocolate, smoky oak, lingering finish.', image: 'https://images.unsplash.com/photo-1507133750040-4a8f57021571?q=80&w=600&auto=format&fit=crop', featured: false },
    { id: 'c3', name: 'Honey Oat Latte',         price: '$6.50', desc: 'Velvety oat milk, raw wildflower honey, cinnamon dust, single origin.',    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=600&auto=format&fit=crop', featured: true  },
    { id: 'c4', name: 'Cold Brew Reserve',        price: '$7.00', desc: '24-hour slow-steeped Colombian concentrate served over black ice.',        image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?q=80&w=600&auto=format&fit=crop', featured: false },
    { id: 'c5', name: 'Spiced Cortado',           price: '$6.00', desc: 'Equal parts espresso and steamed milk with cardamom and star anise.',      image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=600&auto=format&fit=crop', featured: false },
    { id: 'c6', name: 'Matcha Noir',              price: '$7.00', desc: 'Ceremonial-grade matcha, coconut milk, a hint of black sesame and gold.',   image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?q=80&w=600&auto=format&fit=crop', featured: false },
  ],
  Cocktails: [
    { id: 'k1', name: 'Smoked Old Fashioned',    price: '$16', desc: 'Bourbon, hickory smoke, demerara, Angostura, served in a smoke-filled cloche.', image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=600&auto=format&fit=crop', featured: true  },
    { id: 'k2', name: 'Espresso Martini Noir',   price: '$18', desc: 'Cold brew vodka, Kahlúa, house espresso, edible gold flake garnish.',          image: 'https://images.unsplash.com/photo-1545696913-c394364b9db3?q=80&w=600&auto=format&fit=crop', featured: true  },
    { id: 'k3', name: 'Rose Garden Spritz',      price: '$15', desc: 'St-Germain, rosé champagne, fresh rose petals, cucumber ribbon.',             image: 'https://images.unsplash.com/photo-1574085733277-851d9d856a3a?q=80&w=600&auto=format&fit=crop', featured: false },
    { id: 'k4', name: 'Midnight Mezcal Sour',    price: '$17', desc: 'Añejo mezcal, activated charcoal, yuzu, egg white foam, smoked salt rim.',    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=600&auto=format&fit=crop', featured: false },
    { id: 'k5', name: 'Velvet Negroni',          price: '$16', desc: 'Beefeater gin, Campari, Carpano Antica, black fig syrup, orange peel.',       image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?q=80&w=600&auto=format&fit=crop', featured: false },
    { id: 'k6', name: 'Golden Hour Mule',        price: '$14', desc: 'Ginger beer, turmeric vodka, fresh lime, honey, saffron garnish.',            image: 'https://images.unsplash.com/photo-1530991808291-7e157454758c?q=80&w=600&auto=format&fit=crop', featured: false },
  ],
  Snacks: [
    { id: 's1', name: 'Truffle Arancini',         price: '$14', desc: 'Crispy risotto bites, black truffle oil, aged parmesan, smoked aioli.',       image: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?q=80&w=600&auto=format&fit=crop', featured: true  },
    { id: 's2', name: 'Charcuterie Noir',         price: '$22', desc: 'Curated meats, artisan cheeses, honeycomb, fig jam, sourdough crisps.',       image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=600&auto=format&fit=crop', featured: false },
    { id: 's3', name: 'Burrata Toast',            price: '$16', desc: 'Charcoal sourdough, fresh burrata, heirloom tomato, basil, aged balsamic.',   image: 'https://images.unsplash.com/photo-1603046891744-1f76eb10aec1?q=80&w=600&auto=format&fit=crop', featured: false },
    { id: 's4', name: 'Spiced Nuts & Olives',     price: '$10', desc: 'Warm Marcona almonds, Castelvetrano olives, harissa butter, rosemary.',       image: 'https://images.unsplash.com/photo-1553177595-4de2bb0842b9?q=80&w=600&auto=format&fit=crop', featured: false },
    { id: 's5', name: 'Wagyu Sliders',            price: '$24', desc: 'Mini Wagyu burgers, caramelised onion jam, gruyère, brioche, house pickles.',  image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600&auto=format&fit=crop', featured: true  },
    { id: 's6', name: 'Lobster Crostini',         price: '$26', desc: 'Maine lobster, tarragon crème fraîche, micro herbs, lemon zest, caviar.',     image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=600&auto=format&fit=crop', featured: false },
  ],
  Desserts: [
    { id: 'd1', name: 'Dark Chocolate Fondant',  price: '$14', desc: '70% Valrhona chocolate, molten centre, salted caramel, vanilla bean ice cream.', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=600&auto=format&fit=crop', featured: true  },
    { id: 'd2', name: 'Crème Brûlée Noir',       price: '$12', desc: 'Espresso-infused custard, torched caramel crust, cardamom shortbread.',         image: 'https://images.unsplash.com/photo-1470324161839-ce2bb6fa6bc3?q=80&w=600&auto=format&fit=crop', featured: false },
    { id: 'd3', name: 'Gold Tiramisu',            price: '$13', desc: 'Savoiardi soaked in our house espresso, mascarpone, edible 24k gold dust.',    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=600&auto=format&fit=crop', featured: true  },
    { id: 'd4', name: 'Pistachio Panna Cotta',   price: '$11', desc: 'Silky panna cotta, pistachio praline, rose water jelly, saffron honey.',        image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=600&auto=format&fit=crop', featured: false },
    { id: 'd5', name: 'Seasonal Cheesecake',     price: '$12', desc: 'New York-style baked cheesecake with rotating seasonal fruit compote.',         image: 'https://images.unsplash.com/photo-1524351199679-46cddf530c04?q=80&w=600&auto=format&fit=crop', featured: false },
    { id: 'd6', name: 'Petit Four Selection',    price: '$16', desc: 'Chef\'s daily selection of macarons, truffles, financiers, and mignardises.',   image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600&auto=format&fit=crop', featured: false },
  ],
};

const CATEGORIES = Object.keys(MENU);

const TAB_ICONS = {
  Coffee: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3" />
    </svg>
  ),
  Cocktails: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9-12H3l9 12zm0 0v3m-4 0h8" />
    </svg>
  ),
  Snacks: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  ),
  Desserts: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5a2 2 0 10-2 2h2zm0 8H4.3a2 2 0 00-1.8 1.1L2 20h20l-.5-2.9a2 2 0 00-1.8-1.1H12z" />
    </svg>
  ),
};

/* ── Variants ────────────────────────────────────────────── */
const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};
const cardVariants = {
  hidden:  { opacity: 0, y: 30, scale: 0.96 },
  visible: { opacity: 1, y: 0,  scale: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: -20, scale: 0.96, transition: { duration: 0.3 } },
};

/* ── Menu card ───────────────────────────────────────────── */
function MenuCard({ item, addToCart }) {
  return (
    <motion.article
      id={`menu-item-${item.id}`}
      variants={cardVariants}
      layout
      className="glass-card group relative flex flex-col overflow-hidden
                 hover:border-caramel/50 transition-colors duration-300 cursor-default"
      style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)' }}
      whileHover={{ y: -6, boxShadow: '0 20px 50px rgba(0,0,0,0.7), 0 0 30px rgba(198,139,78,0.12)' }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* Featured badge */}
      {item.featured && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1
                        px-2.5 py-1 rounded-full text-[10px] font-body font-semibold
                        uppercase tracking-widest text-espresso font-bold"
          style={{ background: 'linear-gradient(135deg, #C68B4E, #E8B86D)' }}>
          ★ Featured
        </div>
      )}

      {/* High-resolution Image Visual Area */}
      <div className="relative h-44 overflow-hidden bg-charcoal-dark">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-750 ease-out group-hover:scale-110"
        />
        {/* Shadow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0805]/95 via-transparent to-transparent" />
        
        {/* Subtle Ambient Glow Ring on Hover */}
        <motion.div
          className="absolute inset-4 rounded-full border border-gold/10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }} />
      </div>

      {/* Border accent line */}
      <div className="h-px w-full"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(198,139,78,0.25), transparent)' }} />

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-2 bg-[#0C0704]">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-base font-bold text-white leading-snug
                         group-hover:text-caramel transition-colors duration-300">
            {item.name}
          </h3>
          <span className="font-display text-base font-extrabold shrink-0 text-gold-gradient">
            {item.price}
          </span>
        </div>
        <p className="font-body text-xs text-cream/90 leading-relaxed font-semibold">{item.desc}</p>

        {/* Add to order hover reveal */}
        <div className="mt-auto pt-3 flex items-center justify-between
                        opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0
                        transition-all duration-300">
          <span className="font-body text-[10px] text-cream/70 uppercase tracking-widest font-extrabold">
            Handcrafted to order
          </span>
          <motion.button
            id={`order-${item.id}`}
            whileTap={{ scale: 0.94 }}
            onClick={() => addToCart && addToCart(item)}
            className="text-[10px] font-body font-bold uppercase tracking-widest
                       text-espresso px-3 py-1.5 rounded-full"
            style={{ background: 'linear-gradient(135deg, #C68B4E, #D4A853)' }}
          >
            + Order
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}

/* ── Category tab ────────────────────────────────────────── */
function CategoryTab({ cat, active, onClick }) {
  return (
    <motion.button
      id={`menu-tab-${cat.toLowerCase()}`}
      onClick={() => onClick(cat)}
      whileTap={{ scale: 0.96 }}
      className={`relative flex items-center gap-2.5 px-5 py-2.5 rounded-full
                  font-body text-sm font-bold transition-all duration-300 whitespace-nowrap
                  ${active
                    ? 'text-espresso shadow-gold'
                    : 'text-cream/80 hover:text-cream border border-gold-subtle hover:border-gold-mid'
                  }`}
      style={active
        ? { background: 'linear-gradient(135deg, #C68B4E 0%, #D4A853 50%, #E8B86D 100%)' }
        : {}}
    >
      <span className={active ? 'text-espresso' : 'text-caramel'}>{TAB_ICONS[cat]}</span>
      <span>{cat}</span>
      {active && (
        <motion.span
          layoutId="tab-pill"
          className="absolute inset-0 rounded-full -z-10"
          style={{ background: 'linear-gradient(135deg, #C68B4E, #E8B86D)' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}
    </motion.button>
  );
}

/* ── Section label ───────────────────────────────────────── */
function SectionLabel({ children }) {
  return (
    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs
                     font-body font-bold uppercase tracking-[0.2em] text-caramel
                     border border-gold-subtle mb-6"
      style={{ background: 'rgba(198,139,78,0.08)' }}>
      <span className="w-1.5 h-1.5 rounded-full bg-caramel" />
      {children}
    </span>
  );
}

/* ── Main Menu component ─────────────────────────────────── */
export default function MenuSection({ addToCart }) {
  const [activeTab, setActiveTab] = useState('Coffee');
  const sectionRef = useRef(null);
  const inView     = useInView(sectionRef, { once: true, margin: '-80px' });

  const items = MENU[activeTab];

  return (
    <section
      id="menu"
      ref={sectionRef}
      aria-labelledby="menu-heading"
      className="relative py-24 lg:py-32 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0D0805 0%, #110907 50%, #0D0805 100%)' }}
    >
      {/* Background accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(198,139,78,0.3), transparent)' }}/>
        <div className="absolute bottom-0 left-0 w-full h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(198,139,78,0.3), transparent)' }}/>
        <div className="absolute top-1/3 right-0 w-72 h-72 opacity-10 rounded-full"
          style={{ background: 'radial-gradient(circle, #C68B4E, transparent 70%)', filter: 'blur(60px)' }}/>
        <div className="absolute bottom-1/3 left-0 w-72 h-72 opacity-10 rounded-full"
          style={{ background: 'radial-gradient(circle, #4A0E1A, transparent 70%)', filter: 'blur(60px)' }}/>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">

        {/* ── Section header ── */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex justify-center">
            <SectionLabel>Our Offerings</SectionLabel>
          </div>
          <h2 id="menu-heading"
            className="font-display text-4xl sm:text-5xl lg:text-[3.2rem] font-bold leading-[1.1] mb-4">
            <span className="text-white">Crafted with</span>{' '}
            <span className="text-gold-gradient">Intention</span>
          </h2>
          <p className="font-body text-base text-cream/90 max-w-xl mx-auto leading-relaxed">
            Every item on our menu is a collaboration between our roasters, baristas, and bartenders —
            obsessing over quality so you don't have to.
          </p>
        </motion.div>

        {/* ── Category tabs ── */}
        <motion.div
          className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          role="tablist"
          aria-label="Menu categories"
        >
          {CATEGORIES.map((cat) => (
            <CategoryTab
              key={cat}
              cat={cat}
              active={activeTab === cat}
              onClick={setActiveTab}
            />
          ))}
        </motion.div>

        {/* ── Menu Grid ── */}
        <motion.div
          id="menu-grid"
          variants={gridVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <MenuCard
                key={item.id}
                item={item}
                addToCart={addToCart}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* ── Bottom Accent ── */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
        >
          <p className="font-body text-xs text-cream/70 uppercase tracking-[0.2em] font-semibold">
            Fine quality, organic ingredients only
          </p>
          <div className="divider-gold max-w-xs mx-auto mt-4">
            <span className="font-accent text-base text-caramel/50">Noir &amp; Brew</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
