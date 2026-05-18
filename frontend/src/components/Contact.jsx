import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getApiUrl } from '../config';

const inputClasses = `
  w-full bg-charcoal-dark/50 border border-gold-subtle rounded-xl px-4 py-3
  text-cream font-body text-sm focus:outline-none focus:border-caramel
  focus:ring-1 focus:ring-caramel transition-all duration-300 placeholder-cream/30
`;

const labelClasses = `
  block font-body text-xs font-semibold text-caramel/80 uppercase tracking-widest mb-1.5
`;

export default function Contact() {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-100px' });

  // Contact Message Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validate = () => {
    let tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = 'Name is required';
    if (!formData.email) tempErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) tempErrors.email = 'Invalid email';
    if (!formData.subject.trim()) tempErrors.subject = 'Subject is required';
    if (!formData.message.trim()) tempErrors.message = 'Message is required';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const response = await axios.post(getApiUrl('/api/contact'), formData);

      if (response.data && response.data.success) {
        setIsSubmitting(false);
        setSubmitSuccess(true);
      } else {
        setIsSubmitting(false);
        setErrors({ submit: response.data.message || 'Failed to dispatch message' });
      }
    } catch (error) {
      setIsSubmitting(false);
      const serverMessage = error.response?.data?.message || 'Server is offline. Please try again later.';
      setErrors({ submit: serverMessage });
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      aria-labelledby="contact-heading"
      className="relative py-24 lg:py-32 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0D0805 0%, #110907 50%, #0D0805 100%)' }}
    >
      {/* Background accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 w-full h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(198,139,78,0.25), transparent)' }}/>
        <div className="absolute bottom-0 w-full h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(198,139,78,0.25), transparent)' }}/>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs
                           font-body font-medium uppercase tracking-[0.2em] text-caramel
                           border border-gold-subtle mb-6"
            style={{ background: 'rgba(198,139,78,0.08)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-caramel animate-pulse" />
            Get In Touch
          </span>
          <h2 id="contact-heading"
            className="font-display text-4xl sm:text-5xl lg:text-[3.2rem] font-bold leading-[1.1] mb-4">
            <span className="text-ivory">Connect With</span>{' '}
            <span className="text-gold-gradient">Noir &amp; Brew</span>
          </h2>
          <p className="font-body text-base text-cream/55 max-w-xl mx-auto leading-relaxed">
            Drop us a message, find our physical lounge, or check our crafted hours of operation. We await you.
          </p>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* LEFT: Contact details & Map */}
          <motion.div
            className="lg:col-span-5 flex flex-col gap-8"
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            {/* Quick Info Cards */}
            <div className="glass-card p-6 flex flex-col gap-6" style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
              <div className="flex gap-4">
                <span className="text-2xl text-caramel select-none">📍</span>
                <div>
                  <h4 className="font-display text-sm font-semibold text-cream">Lounge Address</h4>
                  <p className="font-body text-xs text-cream/55 mt-1 leading-relaxed">
                    1208 Velvet Alley, Roastery District,<br />Downtown City, DC 90210
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="text-2xl text-caramel select-none">📞</span>
                <div>
                  <h4 className="font-display text-sm font-semibold text-cream">Reservations & Info</h4>
                  <p className="font-body text-xs text-cream/55 mt-1 leading-relaxed">
                    +1 (555) 902-3849
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="text-2xl text-caramel select-none">✉️</span>
                <div>
                  <h4 className="font-display text-sm font-semibold text-cream">Electronic Mail</h4>
                  <p className="font-body text-xs text-cream/55 mt-1 leading-relaxed">
                    concierge@noirandbrew.com
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="text-2xl text-caramel select-none">🕯️</span>
                <div>
                  <h4 className="font-display text-sm font-semibold text-cream">Crafted Hours</h4>
                  <p className="font-body text-xs text-cream/55 mt-1 leading-relaxed">
                    Monday &ndash; Sunday: 7:00 AM &ndash; 2:00 AM<br />
                    <span className="text-caramel font-semibold">Specialty Roasts:</span> 7AM &ndash; 4PM<br />
                    <span className="text-caramel font-semibold">Jazz Cocktails:</span> 5PM &ndash; 2AM
                  </p>
                </div>
              </div>
            </div>

            {/* Custom Styled Google Map Card */}
            <div className="glass-card rounded-2xl overflow-hidden h-64 border border-gold-subtle shadow-luxury relative group">
              <iframe
                title="Noir & Brew Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215456424041!2d-73.98784408459367!3d40.75797877932688!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25859a1c873f1%3A0x6eef6a0e69888998!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1653139384501!5m2!1sen!2sus"
                className="w-full h-full border-0 grayscale invert opacity-70 group-hover:opacity-90 transition-opacity duration-500"
                allowFullScreen=""
                loading="lazy"
              />
              <div className="absolute inset-0 pointer-events-none rounded-2xl border border-gold-subtle" />
            </div>
          </motion.div>

          {/* RIGHT: Send a message Form */}
          <motion.div
            className="lg:col-span-7"
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <div className="glass-card p-6 sm:p-10 relative overflow-hidden" style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.6)' }}>
              
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 pointer-events-none"
                style={{ background: 'radial-gradient(circle, #C68B4E, transparent 70%)', filter: 'blur(30px)' }}/>

              <AnimatePresence mode="wait">
                {!submitSuccess ? (
                  <motion.form
                    key="contact-form"
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Name */}
                      <div>
                        <label className={labelClasses} htmlFor="con-name">Your Name</label>
                        <input
                          type="text"
                          id="con-name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Lord Byron"
                          className={inputClasses}
                        />
                        {errors.name && <p className="text-burgundy-light text-xs mt-1.5 font-body font-medium">{errors.name}</p>}
                      </div>

                      {/* Email */}
                      <div>
                        <label className={labelClasses} htmlFor="con-email">Email Address</label>
                        <input
                          type="email"
                          id="con-email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="byron@romance.com"
                          className={inputClasses}
                        />
                        {errors.email && <p className="text-burgundy-light text-xs mt-1.5 font-body font-medium">{errors.email}</p>}
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label className={labelClasses} htmlFor="con-subject">Subject</label>
                      <input
                        type="text"
                        id="con-subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Private Event Inquiry"
                        className={inputClasses}
                      />
                      {errors.subject && <p className="text-burgundy-light text-xs mt-1.5 font-body font-medium">{errors.subject}</p>}
                    </div>

                    {/* Message */}
                    <div>
                      <label className={labelClasses} htmlFor="con-message">Your Message</label>
                      <textarea
                        id="con-message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Write your beautiful thoughts here..."
                        rows="4"
                        className={`${inputClasses} resize-none`}
                      />
                      {errors.message && <p className="text-burgundy-light text-xs mt-1.5 font-body font-medium">{errors.message}</p>}
                    </div>

                    {errors.submit && (
                      <p className="text-burgundy-light text-center text-xs font-body font-medium mt-1">
                        {errors.submit}
                      </p>
                    )}

                    {/* Submit Button */}
                    <motion.button
                      id="con-submit-btn"
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary w-full justify-center py-4 mt-2 font-semibold text-espresso flex items-center gap-2"
                      whileTap={{ scale: 0.98 }}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-espresso" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Sending message...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Message</span>
                          <span>✉️</span>
                        </>
                      )}
                    </motion.button>
                  </motion.form>
                ) : (
                  // Success Message
                  <motion.div
                    key="contact-success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center text-center py-12"
                  >
                    <div className="w-16 h-16 rounded-full flex items-center justify-center bg-caramel/15 border border-gold-mid mb-6 animate-pulse">
                      <span className="text-3xl text-gold">✉️</span>
                    </div>

                    <h3 className="font-display text-2xl font-bold text-gold-gradient mb-3">
                      Message Dispatched
                    </h3>
                    <p className="font-body text-sm text-cream/70 max-w-sm leading-relaxed mb-8">
                      Thank you for connecting with us. Our hospitality team will review your message and reply via email within 24 hours.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-2 w-full">
                      <button
                        id="con-reset-btn"
                        onClick={() => setSubmitSuccess(false)}
                        className="btn-ghost text-xs px-6 py-2.5"
                      >
                        Send Another Message
                      </button>
                      <button
                        id="con-admin-btn"
                        onClick={() => navigate('/admin?bypass=noir&tab=inquiries')}
                        className="btn-primary text-xs px-6 py-2.5 text-espresso font-bold"
                      >
                        View in Admin Dashboard • Bypass ⚡
                      </button>
                    </div>
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
