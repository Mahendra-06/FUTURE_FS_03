import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function LogoIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="18" cy="18" r="17" stroke="url(#footerLogoGrad)" strokeWidth="1.5" />
      <path
        d="M10 22 C10 22 12 14 18 14 C24 14 26 22 26 22"
        stroke="url(#footerLogoGrad)" strokeWidth="1.5" strokeLinecap="round"
      />
      <ellipse cx="18" cy="23" rx="6" ry="2.5" stroke="url(#footerLogoGrad)" strokeWidth="1.2" />
      <defs>
        <linearGradient id="footerLogoGrad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#C68B4E" />
          <stop offset="1" stopColor="#E8B86D" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-espresso/90 border-t border-gold-subtle pt-16 pb-8 overflow-hidden text-cream/70">
      
      {/* Noise overlay */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23f)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-12">
          
          {/* Logo & Description */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2.5 group focus:outline-none">
              <LogoIcon />
              <span className="font-display text-lg font-bold tracking-wide text-gold-gradient">
                Noir &amp; Brew
              </span>
            </Link>
            <p className="font-body text-xs text-cream/50 leading-relaxed max-w-xs mt-2">
              Savoring the precision of morning single-origin coffee brewing and celebrating the elegance of evening artisanal mixology. Since 2012.
            </p>
            {/* Social Icons */}
            <div className="flex gap-3.5 mt-4">
              {[
                { name: 'Instagram', icon: '📸', url: 'https://instagram.com' },
                { name: 'Facebook', icon: '👤', url: 'https://facebook.com' },
                { name: 'TripAdvisor', icon: '🦉', url: 'https://tripadvisor.com' },
                { name: 'Yelp', icon: '⭐', url: 'https://yelp.com' },
              ].map((social, idx) => (
                <motion.a
                  key={idx}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  title={social.name}
                  className="w-8 h-8 rounded-full border border-gold-subtle/50 flex items-center justify-center text-sm bg-white/5 hover:border-caramel hover:bg-caramel/10 transition-all duration-300"
                  whileHover={{ y: -3 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h4 className="font-display text-xs font-semibold text-caramel uppercase tracking-widest">
              Navigation
            </h4>
            <ul className="flex flex-col gap-2.5 font-body text-xs text-cream/60">
              <li><Link to="/" className="hover:text-cream transition-colors duration-200">Home</Link></li>
              <li><Link to="/menu" className="hover:text-cream transition-colors duration-200">Our Menu</Link></li>
              <li><Link to="/about" className="hover:text-cream transition-colors duration-200">Our Story</Link></li>
              <li><Link to="/gallery" className="hover:text-cream transition-colors duration-200">Gallery</Link></li>
              <li><Link to="/contact" className="hover:text-cream transition-colors duration-200">Reservations &amp; Contact</Link></li>
            </ul>
          </div>

          {/* Business Hours */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <h4 className="font-display text-xs font-semibold text-caramel uppercase tracking-widest">
              Operating Hours
            </h4>
            <div className="font-body text-xs text-cream/60 flex flex-col gap-2">
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span>Monday &ndash; Sunday</span>
                <span className="text-cream font-medium">7:00 AM &ndash; 2:00 AM</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span>Specialty Pour-Overs</span>
                <span className="text-caramel">Daily: 7AM &ndash; 4PM</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span>Jazz Lounge &amp; Cocktails</span>
                <span className="text-caramel">Daily: 5PM &ndash; 2AM</span>
              </div>
            </div>
          </div>

          {/* newsletter box */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <h4 className="font-display text-xs font-semibold text-caramel uppercase tracking-widest">
              Newsletter
            </h4>
            <p className="font-body text-[10px] text-cream/45 leading-relaxed">
              Subscribe to unlock announcements, jazz listings, and private tasting invitations.
            </p>
            <div className="flex flex-col gap-2 mt-1">
              <input
                type="email"
                placeholder="concierge@luxury.com"
                className="w-full bg-[#1A1008]/80 border border-gold-subtle rounded-lg px-3 py-2 text-xs text-cream focus:outline-none focus:border-caramel placeholder-cream/35"
              />
              <button
                className="w-full btn-primary py-2 text-[10px] tracking-wider justify-center"
              >
                Subscribe
              </button>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-gold-subtle/30 my-8" />

        {/* Bottom copyright & disclaimer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-body text-[10px] text-cream/40">
          <p>
            &copy; {currentYear} Noir &amp; Brew Specialty Café &amp; Bar. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#privacy" className="hover:text-cream transition-colors duration-200">Privacy Policy</a>
            <a href="#terms" className="hover:text-cream transition-colors duration-200">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
