import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import axios from 'axios';

/* ── Custom Select/Input Styling Helpers ─────────────────── */
const inputClasses = `
  w-full bg-charcoal-dark/50 border border-gold-subtle rounded-xl px-4 py-3
  text-cream font-body text-sm focus:outline-none focus:border-caramel
  focus:ring-1 focus:ring-caramel transition-all duration-300 placeholder-cream/30
`;

const labelClasses = `
  block font-body text-xs font-semibold text-caramel/80 uppercase tracking-widest mb-1.5
`;

export default function Reservation() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-100px' });

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '2',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Simple validation
  const validate = () => {
    let tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = 'Name is required';
    else if (formData.name.trim().length < 3) tempErrors.name = 'Name must be at least 3 characters';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) tempErrors.email = 'Email is required';
    else if (!emailRegex.test(formData.email)) tempErrors.email = 'Invalid email address';

    const phoneRegex = /^[0-9+\s-]{8,15}$/;
    if (!formData.phone) tempErrors.phone = 'Phone number is required';
    else if (!phoneRegex.test(formData.phone)) tempErrors.phone = 'Invalid phone number format';

    if (!formData.date) tempErrors.date = 'Date is required';
    if (!formData.time) tempErrors.time = 'Time is required';
    if (!formData.guests) tempErrors.guests = 'Number of guests is required';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const response = await axios.post('http://localhost:5000/api/reservation', formData);

      if (response.data && response.data.success) {
        setIsSubmitting(false);
        setSubmitSuccess(true);
      } else {
        setIsSubmitting(false);
        setErrors({ submit: response.data.message || 'Failed to confirm reservation' });
      }
    } catch (error) {
      setIsSubmitting(false);
      const serverMessage = error.response?.data?.message || 'Server is offline. Please try again later.';
      setErrors({ submit: serverMessage });
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      date: '',
      time: '',
      guests: '2',
    });
    setErrors({});
    setSubmitSuccess(false);
  };

  return (
    <section
      id="reservation"
      ref={sectionRef}
      aria-labelledby="reservation-heading"
      className="relative py-24 lg:py-32 overflow-hidden bg-bar-texture"
    >
      {/* Background Accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(198,139,78,0.3), transparent)' }}/>
        <div className="absolute bottom-0 left-0 w-full h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(198,139,78,0.3), transparent)' }}/>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-[0.03]"
          style={{ background: 'radial-gradient(circle, #C68B4E, transparent 70%)', filter: 'blur(80px)' }}/>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT: Elegance info & Booking Details */}
          <motion.div
            className="lg:col-span-5 flex flex-col text-center lg:text-left"
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-flex items-center justify-center lg:justify-start gap-2 px-4 py-1.5 rounded-full text-xs
                             font-body font-medium uppercase tracking-[0.2em] text-caramel
                             border border-gold-subtle mb-6 self-center lg:self-start"
              style={{ background: 'rgba(198,139,78,0.08)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-caramel animate-pulse" />
              Table Bookings
            </span>

            <h2 id="reservation-heading"
              className="font-display text-4xl sm:text-5xl font-bold leading-[1.1] mb-6">
              <span className="text-ivory">Secure Your</span>
              <br />
              <span className="text-gold-gradient">Special Evening</span>
            </h2>

            <div className="divider-gold max-w-xs mx-auto lg:mx-0 mb-6">
              <span className="font-accent text-sm text-caramel/70">Uncompromised Luxury</span>
            </div>

            <p className="font-body text-base text-cream/65 leading-relaxed mb-8">
              Whether you are planning a cozy coffee date at noon or a late-night cocktail celebration,
              reserve your table in advance. Experience exceptional table service, beautiful live jazz, 
              and exclusive menu items crafted by our finest baristas and mixologists.
            </p>

            {/* Quick Policies / Info */}
            <div className="flex flex-col gap-4 text-left">
              {[
                { title: 'Elegant Ambiance', desc: 'Curated low lighting, luxury leather seating, cozy music.' },
                { title: 'Grace Period', desc: 'Reservations are held for up to 15 minutes past the booking time.' },
                { title: 'Events & Parties', desc: 'For groups larger than 10, please contact us directly.' },
              ].map((policy, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <span className="text-xl text-caramel">✦</span>
                  <div>
                    <h4 className="font-display text-sm font-semibold text-cream">{policy.title}</h4>
                    <p className="font-body text-xs text-cream/50 leading-relaxed mt-0.5">{policy.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT: Modern Reservation Form */}
          <motion.div
            className="lg:col-span-7"
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          >
            <div className="glass-card p-6 sm:p-10 relative overflow-hidden"
              style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.6)' }}>
              
              {/* Radial decorative highlight inside form card */}
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 pointer-events-none"
                style={{ background: 'radial-gradient(circle, #C68B4E, transparent 70%)', filter: 'blur(30px)' }}/>

              <AnimatePresence mode="wait">
                {!submitSuccess ? (
                  <motion.form
                    key="reservation-form"
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Name */}
                      <div>
                        <label className={labelClasses} htmlFor="res-name">Full Name</label>
                        <input
                          type="text"
                          id="res-name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Marcus Aurelius"
                          className={inputClasses}
                        />
                        {errors.name && <p className="text-burgundy-light text-xs mt-1.5 font-body font-medium">{errors.name}</p>}
                      </div>

                      {/* Email */}
                      <div>
                        <label className={labelClasses} htmlFor="res-email">Email Address</label>
                        <input
                          type="email"
                          id="res-email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="marcus@empire.com"
                          className={inputClasses}
                        />
                        {errors.email && <p className="text-burgundy-light text-xs mt-1.5 font-body font-medium">{errors.email}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Phone */}
                      <div>
                        <label className={labelClasses} htmlFor="res-phone">Phone Number</label>
                        <input
                          type="tel"
                          id="res-phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+1 (555) 019-2834"
                          className={inputClasses}
                        />
                        {errors.phone && <p className="text-burgundy-light text-xs mt-1.5 font-body font-medium">{errors.phone}</p>}
                      </div>

                      {/* Guests */}
                      <div>
                        <label className={labelClasses} htmlFor="res-guests">Number of Guests</label>
                        <select
                          id="res-guests"
                          name="guests"
                          value={formData.guests}
                          onChange={handleChange}
                          className={`${inputClasses} appearance-none cursor-pointer`}
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23C68B4E'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 16px center',
                            backgroundSize: '16px',
                          }}
                        >
                          <option value="1" className="bg-[#1A1008] text-cream">1 Guest</option>
                          <option value="2" className="bg-[#1A1008] text-cream">2 Guests</option>
                          <option value="3" className="bg-[#1A1008] text-cream">3 Guests</option>
                          <option value="4" className="bg-[#1A1008] text-cream">4 Guests</option>
                          <option value="5" className="bg-[#1A1008] text-cream">5 Guests</option>
                          <option value="6" className="bg-[#1A1008] text-cream">6+ Guests (Party)</option>
                        </select>
                        {errors.guests && <p className="text-burgundy-light text-xs mt-1.5 font-body font-medium">{errors.guests}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Date */}
                      <div>
                        <label className={labelClasses} htmlFor="res-date">Date</label>
                        <input
                          type="date"
                          id="res-date"
                          name="date"
                          value={formData.date}
                          onChange={handleChange}
                          min={new Date().toISOString().split('T')[0]}
                          className={`${inputClasses} cursor-pointer`}
                        />
                        {errors.date && <p className="text-burgundy-light text-xs mt-1.5 font-body font-medium">{errors.date}</p>}
                      </div>

                      {/* Time */}
                      <div>
                        <label className={labelClasses} htmlFor="res-time">Time Slot</label>
                        <select
                          id="res-time"
                          name="time"
                          value={formData.time}
                          onChange={handleChange}
                          className={`${inputClasses} appearance-none cursor-pointer`}
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23C68B4E'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 16px center',
                            backgroundSize: '16px',
                          }}
                        >
                          <option value="" className="bg-[#1A1008] text-cream/40">Select Time</option>
                          <optgroup label="Afternoon Coffee (7:00 AM - 4:00 PM)" className="bg-[#1A1008] text-caramel/80">
                            <option value="08:00" className="bg-[#1A1008] text-cream">08:00 AM</option>
                            <option value="10:00" className="bg-[#1A1008] text-cream">10:00 AM</option>
                            <option value="12:00" className="bg-[#1A1008] text-cream">12:00 PM</option>
                            <option value="14:00" className="bg-[#1A1008] text-cream">02:00 PM</option>
                          </optgroup>
                          <optgroup label="Evening Cocktail & Jazz (5:00 PM - 1:00 AM)" className="bg-[#1A1008] text-caramel/80">
                            <option value="17:00" className="bg-[#1A1008] text-cream">05:00 PM</option>
                            <option value="19:00" className="bg-[#1A1008] text-cream">07:00 PM</option>
                            <option value="21:00" className="bg-[#1A1008] text-cream">09:00 PM</option>
                            <option value="23:00" className="bg-[#1A1008] text-cream">11:00 PM</option>
                          </optgroup>
                        </select>
                        {errors.time && <p className="text-burgundy-light text-xs mt-1.5 font-body font-medium">{errors.time}</p>}
                      </div>
                    </div>

                    {errors.submit && (
                      <p className="text-burgundy-light text-center text-xs font-body font-medium mt-1">
                        {errors.submit}
                      </p>
                    )}

                    {/* Submit Button */}
                    <motion.button
                      id="res-submit-btn"
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary w-full justify-center py-4 mt-4 relative font-semibold text-espresso flex items-center gap-3"
                      whileTap={{ scale: 0.98 }}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-espresso" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Confirming reservation...</span>
                        </>
                      ) : (
                        <>
                          <span>Reserve Table Now</span>
                          <span className="text-lg">✨</span>
                        </>
                      )}
                    </motion.button>
                  </motion.form>
                ) : (
                  // Success State (Vibe Ticket Card)
                  <motion.div
                    key="reservation-success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center text-center py-8"
                  >
                    <div className="w-16 h-16 rounded-full flex items-center justify-center bg-caramel/15 border border-gold-mid mb-6 animate-pulse">
                      <span className="text-3xl text-gold">✨</span>
                    </div>

                    <h3 className="font-display text-2xl font-bold text-gold-gradient mb-2">
                      Reservation Confirmed
                    </h3>
                    <p className="font-body text-sm text-cream/70 max-w-sm mb-8">
                      An elegant evening awaits you. We have saved a prime table for your upcoming visit to Noir &amp; Brew.
                    </p>

                    {/* Ticket Summary */}
                    <div className="w-full bg-[#160E08] border border-gold-subtle rounded-2xl p-6 text-left relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gold-gradient opacity-[0.04] rounded-full pointer-events-none filter blur-2xl" />
                      
                      <div className="border-b border-gold-subtle pb-4 mb-4 flex justify-between items-center">
                        <span className="font-display text-xs text-caramel font-bold tracking-widest uppercase">Noir &amp; Brew Ticket</span>
                        <span className="font-accent text-lg text-gold">Exclusive</span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 font-body text-xs text-cream/60">
                        <div>
                          <p className="text-[10px] text-cream/30 uppercase tracking-widest leading-none">Guest</p>
                          <p className="text-sm font-semibold text-cream mt-1">{formData.name}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-cream/30 uppercase tracking-widest leading-none">Guests Count</p>
                          <p className="text-sm font-semibold text-cream mt-1">{formData.guests} {parseInt(formData.guests) === 1 ? 'Guest' : 'Guests'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-cream/30 uppercase tracking-widest leading-none">Date</p>
                          <p className="text-sm font-semibold text-cream mt-1">{formData.date}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-cream/30 uppercase tracking-widest leading-none">Time Slot</p>
                          <p className="text-sm font-semibold text-cream mt-1">{formData.time}</p>
                        </div>
                      </div>

                      <div className="border-t border-gold-subtle pt-4 mt-4 flex items-center justify-between">
                        <span className="text-[10px] text-cream/30 font-mono tracking-wider uppercase">ID: NB-{Math.floor(100000 + Math.random() * 900000)}</span>
                        <span className="text-xs text-gold flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-gold animate-pulse" /> Active
                        </span>
                      </div>
                    </div>

                    <button
                      id="res-reset-btn"
                      onClick={handleReset}
                      className="btn-ghost text-xs px-6 py-2.5 mt-8 w-fit"
                    >
                      Book Another Table
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
