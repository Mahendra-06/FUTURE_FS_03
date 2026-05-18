import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { getApiUrl } from '../config';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('reservations'); // 'reservations', 'orders', or 'inquiries'
  const [reservations, setReservations] = useState([]);
  const [orders, setOrders] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');

  // Simple admin passcode to make it feel premium and private!
  const handleLogin = (e) => {
    e.preventDefault();
    if (passcode === 'admin123' || passcode === 'noir') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Access Denied — Invalid Security Code');
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const resPromise = axios.get(getApiUrl('/api/reservations'));
      const orderPromise = axios.get(getApiUrl('/api/orders'));
      const contactPromise = axios.get(getApiUrl('/api/contact'));
      
      const [resResponse, orderResponse, contactResponse] = await Promise.all([
        resPromise,
        orderPromise,
        contactPromise
      ]);

      if (resResponse.data && resResponse.data.success) {
        setReservations(resResponse.data.data);
      }
      if (orderResponse.data && orderResponse.data.success) {
        setOrders(orderResponse.data.data);
      }
      if (contactResponse.data && contactResponse.data.success) {
        setContacts(contactResponse.data.data);
      }
      
      setLoading(false);
    } catch (err) {
      setError('Could not establish server connection to retrieve database logs.');
      setLoading(false);
    }
  };

  // Auto login from redirect bypass parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('bypass') === 'noir') {
      setIsAuthenticated(true);
      const targetTab = params.get('tab');
      if (targetTab === 'inquiries') {
        setActiveTab('inquiries');
      } else {
        setActiveTab('orders'); // Instant load orders tab so they see their ordered item!
      }
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const handleDeleteReservation = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this table reservation?')) return;

    try {
      const response = await axios.delete(getApiUrl(`/api/reservations/${id}`));
      if (response.data && response.data.success) {
        setReservations((prev) => prev.filter((res) => res._id !== id));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Could not cancel reservation.');
    }
  };

  const handleUpdateOrderStatus = async (id, newStatus) => {
    try {
      const response = await axios.put(getApiUrl(`/api/orders/${id}`), { status: newStatus });
      if (response.data && response.data.success) {
        setOrders((prev) =>
          prev.map((ord) => (ord._id === id ? { ...ord, status: newStatus } : ord))
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Could not update order status.');
    }
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;

    try {
      const response = await axios.delete(getApiUrl(`/api/orders/${id}`));
      if (response.data && response.data.success) {
        setOrders((prev) => prev.filter((ord) => ord._id !== id));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Could not cancel order.');
    }
  };

  const handleDeleteContact = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message inquiry?')) return;

    try {
      const response = await axios.delete(getApiUrl(`/api/contact/${id}`));
      if (response.data && response.data.success) {
        setContacts((prev) => prev.filter((c) => c._id !== id));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Could not delete contact inquiry.');
    }
  };

  // Compute Metrics
  const totalBookings = reservations.length;
  const totalGuests = reservations.reduce((sum, res) => sum + (Number(res.guests) || 0), 0);
  const totalPendingOrders = orders.filter((o) => o.status !== 'Served').length;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-espresso px-5 py-24 relative overflow-hidden">
        {/* Decorative highlights */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 opacity-10 bg-gold rounded-full filter blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 opacity-10 bg-burgundy rounded-full filter blur-[100px] pointer-events-none" />

        <motion.div
          className="glass-card max-w-md w-full p-8 relative z-10 text-center border border-gold-subtle"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ boxShadow: '0 20px 50px rgba(0,0,0,0.6)' }}
        >
          <svg className="w-10 h-10 text-caramel mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.02 5.912l-4.755 4.754a.75.75 0 01-.53.22H5.25a.75.75 0 01-.75-.75V16.5a.75.75 0 01.22-.53l4.754-4.755A6 6 0 1121 8.25z" />
          </svg>
          <h2 className="font-display text-2xl font-bold text-gold-gradient mb-2">Noir &amp; Brew Portal</h2>
          <p className="font-body text-xs text-cream/80 mb-8 uppercase tracking-widest font-bold">Administrative Access</p>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="block text-left font-body text-[10px] text-caramel uppercase tracking-widest mb-2 font-semibold">
                Security Key Passcode
              </label>
              <input
                type="password"
                placeholder="Enter admin passcode (noir)"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full bg-charcoal-dark border border-gold-mid rounded-xl px-4 py-3 text-white text-center text-sm font-body font-semibold placeholder-cream/40 focus:outline-none focus:border-gold"
              />
            </div>

            {authError && (
              <p className="text-red-400 text-xs font-body font-medium my-1">{authError}</p>
            )}

            <button type="submit" className="btn-primary w-full justify-center py-3 mt-4 text-xs tracking-wider">
              Verify Credentials
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bar-texture pt-32 pb-24 text-cream font-body">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="font-body text-xs text-gold uppercase tracking-widest font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              Realtime Concierge Panel
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mt-2">
              Concierge <span className="text-gold-gradient">Command Center</span>
            </h1>
          </div>
          <button
            onClick={fetchData}
            className="btn-ghost text-xs px-5 py-2.5 flex items-center gap-2 self-start font-bold"
          >
            <svg className="w-4 h-4 text-gold shrink-0 animate-spin-slow" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            <span>Refresh Logs</span>
          </button>
        </div>

        {/* Overview Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {[
            { 
              label: 'Active Reservations', 
              value: totalBookings, 
              icon: (
                <svg className="w-8 h-8 text-gold opacity-90" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5" />
                </svg>
              ) 
            },
            { 
              label: 'Active Drink/Food Orders', 
              value: totalPendingOrders, 
              icon: (
                <svg className="w-8 h-8 text-gold opacity-90" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9-12H3l9 12zm0 0v3m-4 0h8" />
                </svg>
              ) 
            },
            { 
              label: 'Portal Status', 
              value: 'Live & Connected', 
              icon: (
                <svg className="w-8 h-8 text-gold opacity-90 animate-pulse" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6H12v6zM12 18.75a6 6 0 01-6-6h6v6zM12 18.75v-6.75m0 6.75a6 6 0 00-6 6h6v-6zm0 6a6 6 0 016-6h-6v6" />
                </svg>
              ) 
            },
          ].map((stat, idx) => (
            <div key={idx} className="glass-card p-6 flex items-center justify-between border border-gold-subtle bg-white/[0.02]">
              <div>
                <p className="text-[10px] text-cream/70 uppercase tracking-widest leading-none font-bold">{stat.label}</p>
                <p className="font-display text-2xl font-bold text-white mt-2.5">
                  {stat.value}
                </p>
              </div>
              <span className="shrink-0">{stat.icon}</span>
            </div>
          ))}
        </div>

        {/* Dashboard Tabs Selector */}
        <div className="flex items-center gap-4 border-b border-gold-subtle/30 pb-4 mb-8">
          <button
            onClick={() => setActiveTab('reservations')}
            className={`font-display text-sm font-bold tracking-wider uppercase transition-all duration-300 pb-2 border-b-2 ${
              activeTab === 'reservations' ? 'border-gold text-gold' : 'border-transparent text-cream/50 hover:text-cream'
            }`}
          >
            Seating Logs ({reservations.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`font-display text-sm font-bold tracking-wider uppercase transition-all duration-300 pb-2 border-b-2 ${
              activeTab === 'orders' ? 'border-gold text-gold' : 'border-transparent text-cream/50 hover:text-cream'
            }`}
          >
            Artisanal Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`font-display text-sm font-bold tracking-wider uppercase transition-all duration-300 pb-2 border-b-2 ${
              activeTab === 'inquiries' ? 'border-gold text-gold' : 'border-transparent text-cream/50 hover:text-cream'
            }`}
          >
            📨 Guest Inquiries ({contacts.length})
          </button>
        </div>

        {/* Main Log Box */}
        <div className="glass-card overflow-hidden border border-gold-mid">
          {loading ? (
            <div className="py-20 text-center flex flex-col items-center gap-3">
              <svg className="animate-spin h-8 w-8 text-caramel" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-cream/80 text-xs tracking-widest uppercase font-semibold">Fetching concierge logs...</p>
            </div>
          ) : error ? (
            <div className="py-20 text-center">
              <p className="text-red-400 text-sm mb-4 font-semibold">⚠️ {error}</p>
              <button onClick={fetchData} className="btn-primary py-2 px-6 text-xs text-espresso">
                Try Reconnect
              </button>
            </div>
          ) : activeTab === 'reservations' ? (
            /* Reservations Tab */
            reservations.length === 0 ? (
              <div className="py-24 text-center">
                <svg className="w-12 h-12 text-caramel mx-auto mb-4 opacity-75" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5" />
                </svg>
                <h4 className="font-display text-lg font-medium text-cream/80">No Table Reservations Yet</h4>
                <p className="font-body text-xs text-cream/60 mt-1 max-w-xs mx-auto">
                  Any tables booked on the frontend reservation module will populate inside this panel in real-time.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr style={{ backgroundColor: '#1A0C05', borderBottom: '1.5px solid rgba(232, 184, 109, 0.45)' }} className="text-xs uppercase tracking-widest font-extrabold">
                      <th style={{ color: '#E8B86D', padding: '18px 24px' }}>Guest Detail</th>
                      <th style={{ color: '#E8B86D', padding: '18px 24px' }}>Date</th>
                      <th style={{ color: '#E8B86D', padding: '18px 24px' }}>Time Slot</th>
                      <th style={{ color: '#E8B86D', padding: '18px 24px', textAlign: 'center' }}>Covers</th>
                      <th style={{ color: '#E8B86D', padding: '18px 24px' }}>Status</th>
                      <th style={{ color: '#E8B86D', padding: '18px 24px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold-subtle/30 font-body text-xs text-cream/90">
                    <AnimatePresence>
                      {reservations.map((res) => (
                        <motion.tr
                          key={res._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="hover:bg-white/[0.03] transition-colors duration-200"
                        >
                          <td className="py-4 px-6">
                            <div style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: '15px' }}>{res.name}</div>
                            <div style={{ color: '#FAF7F0', opacity: 0.9, fontSize: '11.5px', marginTop: '4px', fontWeight: '600' }}>{res.email} &bull; {res.phone}</div>
                          </td>
                          <td style={{ color: '#FFFFFF', fontWeight: '700', fontSize: '13px' }} className="py-4 px-6">{res.date}</td>
                          <td style={{ color: '#FFD700', fontWeight: '900', fontSize: '14.5px' }} className="py-4 px-6">{res.time}</td>
                          <td style={{ color: '#FFFFFF', fontWeight: '800', fontSize: '13px' }} className="py-4 px-6 text-center">
                            {res.guests} {Number(res.guests) === 1 ? 'Guest' : 'Guests'}
                          </td>
                          <td className="py-4 px-6">
                            <span style={{ backgroundColor: 'rgba(76, 175, 80, 0.25)', color: '#81C784', border: '1.5px solid #4CAF50' }} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                              Confirmed
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <button
                              onClick={() => handleDeleteReservation(res._id)}
                              style={{ color: '#FF8A8A', border: '1.5px solid #FF5252', backgroundColor: 'rgba(255, 82, 82, 0.15)' }}
                              className="hover:bg-red-600 hover:text-white text-[10px] font-extrabold uppercase tracking-widest px-3.5 py-2 rounded-xl transition-all duration-300 shadow-md"
                            >
                              Cancel Seating
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            )
          ) : activeTab === 'orders' ? (
            /* Orders Tab */
            orders.length === 0 ? (
              <div className="py-24 text-center">
                <svg className="w-12 h-12 text-caramel mx-auto mb-4 opacity-75" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9-12H3l9 12zm0 0v3m-4 0h8" />
                </svg>
                <h4 className="font-display text-lg font-medium text-cream/80">No Artisanal Orders Yet</h4>
                <p className="font-body text-xs text-cream/60 mt-1 max-w-xs mx-auto">
                  Any items ordered via the menu cart will populate here for preparation logs.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr style={{ backgroundColor: '#1A0C05', borderBottom: '1.5px solid rgba(232, 184, 109, 0.45)' }} className="text-xs uppercase tracking-widest font-extrabold">
                      <th style={{ color: '#E8B86D', padding: '18px 24px' }}>Order ID &amp; Items</th>
                      <th style={{ color: '#E8B86D', padding: '18px 24px' }}>Estimated Cost</th>
                      <th style={{ color: '#E8B86D', padding: '18px 24px' }}>Ordered At</th>
                      <th style={{ color: '#E8B86D', padding: '18px 24px', textAlign: 'center' }}>Status</th>
                      <th style={{ color: '#E8B86D', padding: '18px 24px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold-subtle/30 font-body text-xs text-cream/90">
                    <AnimatePresence>
                      {orders.map((ord) => (
                        <motion.tr
                          key={ord._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="hover:bg-white/[0.03] transition-colors duration-200"
                        >
                          <td className="py-4 px-6">
                            <div style={{ color: '#FFFFFF', fontWeight: 'bold', fontFamily: 'monospace', opacity: 0.85 }} className="text-xs mb-3">Ref: {ord._id}</div>
                            
                            {/* Customer Identity Block */}
                            {ord.customerName ? (
                              <div style={{ borderLeft: '3px solid #E8B86D', paddingLeft: '12px' }} className="mb-3.5">
                                <div style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: '13.5px' }}>
                                  👤 {ord.customerName}
                                </div>
                                <div style={{ color: '#FAF7F0', opacity: 0.95, fontSize: '11px', marginTop: '2px', fontWeight: '700' }}>
                                  📱 {ord.customerPhone} &bull; <span style={{ color: '#FFD700', fontWeight: '900' }}>🪑 {ord.tableNumber}</span>
                                </div>
                                {/* Payment status badge */}
                                <div className="mt-2.5 flex">
                                  {ord.paymentMethod === 'Direct Pay' ? (
                                    <span style={{ backgroundColor: 'rgba(76, 175, 80, 0.25)', color: '#81C784', border: '1.5px solid #4CAF50' }} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest">
                                      💳 Paid (Direct)
                                    </span>
                                  ) : (
                                    <span style={{ backgroundColor: 'rgba(255, 193, 7, 0.25)', color: '#FFD700', border: '1.5px solid #FFC107' }} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest">
                                      💵 Bill to Table
                                    </span>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div style={{ borderLeft: '3px solid rgba(232, 184, 109, 0.35)', paddingLeft: '12px' }} className="mb-3.5">
                                <div style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: '13.5px', opacity: 0.65 }}>
                                  👤 Walk-in Guest (Legacy)
                                </div>
                                <div style={{ color: '#FAF7F0', opacity: 0.65, fontSize: '11px', marginTop: '2px', fontWeight: '700' }}>
                                  📱 Unspecified &bull; <span style={{ color: '#FFD700', fontWeight: '900' }}>🪑 Bar / Lounge</span>
                                </div>
                                {/* Fallback payment badge */}
                                <div className="mt-2.5 flex">
                                  <span style={{ backgroundColor: 'rgba(255, 193, 7, 0.25)', color: '#FFD700', border: '1.5px solid #FFC107' }} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest">
                                    💵 Bill to Table
                                  </span>
                                </div>
                              </div>
                            )}

                            <div className="flex flex-col gap-1.5 pt-1">
                              {ord.items.map((itm, idx) => (
                                <div key={idx} style={{ color: '#FAF7F0', opacity: 0.95 }} className="text-xs font-semibold">
                                  &bull; <span style={{ color: '#FFD700', fontWeight: '900' }}>{itm.name}</span> &times; {itm.qty} ({itm.price})
                                </div>
                              ))}
                            </div>
                          </td>
                          <td style={{ color: '#FFD700', fontWeight: '900', fontSize: '15px' }} className="py-4 px-6">${Number(ord.totalCost).toFixed(2)}</td>
                          <td style={{ color: '#FAF7F0', opacity: 0.85, fontWeight: '700' }} className="py-4 px-6">{new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                          <td className="py-4 px-6 text-center">
                            {ord.status === 'Pending' && (
                              <span style={{ backgroundColor: 'rgba(255, 193, 7, 0.25)', color: '#FFD700', border: '1.5px solid #FFC107' }} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest">
                                Pending
                              </span>
                            )}
                            {ord.status === 'Preparing' && (
                              <span style={{ backgroundColor: 'rgba(232, 184, 109, 0.25)', color: '#FFFFFF', border: '1.5px solid #E8B86D' }} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest">
                                Preparing
                              </span>
                            )}
                            {ord.status === 'Served' && (
                              <span style={{ backgroundColor: 'rgba(76, 175, 80, 0.25)', color: '#81C784', border: '1.5px solid #4CAF50' }} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest animate-pulse">
                                Served
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex gap-2 justify-end">
                              {ord.status !== 'Served' && (
                                <button
                                  onClick={() => handleUpdateOrderStatus(ord._id, ord.status === 'Pending' ? 'Preparing' : 'Served')}
                                  style={{ color: '#0D0805', backgroundColor: '#FFD700' }}
                                  className="hover:bg-white text-[9px] font-extrabold uppercase tracking-widest transition-all duration-300 px-3 py-1.5 rounded-lg shadow-sm"
                                >
                                  {ord.status === 'Pending' ? 'Start Prep' : 'Mark Served'}
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteOrder(ord._id)}
                                style={{ color: '#FF8A8A', border: '1.5px solid #FF5252', backgroundColor: 'rgba(255, 82, 82, 0.15)' }}
                                className="hover:bg-red-600 hover:text-white text-[9px] font-extrabold uppercase tracking-widest transition-all duration-300 px-3 py-1.5 rounded-lg shadow-sm"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            )
          ) : (
            /* Contact Inquiries Tab */
            contacts.length === 0 ? (
              <div className="py-24 text-center">
                <svg className="w-12 h-12 text-caramel mx-auto mb-4 opacity-75" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                <h4 className="font-display text-lg font-medium text-cream/80">No Guest Inquiries Yet</h4>
                <p className="font-body text-xs text-cream/60 mt-1 max-w-xs mx-auto">
                  Any feedback or message sent via the contact form on the site will populate inside this operational panel in real-time.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr style={{ backgroundColor: '#1A0C05', borderBottom: '1.5px solid rgba(232, 184, 109, 0.45)' }} className="text-xs uppercase tracking-widest font-extrabold">
                      <th style={{ color: '#E8B86D', padding: '18px 24px' }}>Sender &amp; Contact</th>
                      <th style={{ color: '#E8B86D', padding: '18px 24px' }}>Subject</th>
                      <th style={{ color: '#E8B86D', padding: '18px 24px' }}>Message Details</th>
                      <th style={{ color: '#E8B86D', padding: '18px 24px' }}>Date Received</th>
                      <th style={{ color: '#E8B86D', padding: '18px 24px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold-subtle/30 font-body text-xs text-cream/90">
                    <AnimatePresence>
                      {contacts.map((con) => (
                        <motion.tr
                          key={con._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="hover:bg-white/[0.03] transition-colors duration-200"
                        >
                          <td className="py-4 px-6">
                            <div style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: '14px' }}>{con.name}</div>
                            <div style={{ color: '#FAF7F0', opacity: 0.9, fontSize: '11px', marginTop: '3px', fontWeight: '600' }}>{con.email}</div>
                          </td>
                          <td style={{ color: '#FFD700', fontWeight: '700', fontSize: '13px' }} className="py-4 px-6">
                            {con.subject}
                          </td>
                          <td style={{ color: '#FFFFFF', opacity: 0.85, fontSize: '12px', minWidth: '220px', whiteSpace: 'normal', wordBreak: 'break-word' }} className="py-4 px-6 max-w-sm">
                            "{con.message}"
                          </td>
                          <td style={{ color: '#FAF7F0', opacity: 0.75 }} className="py-4 px-6">
                            {new Date(con.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })} &bull; {new Date(con.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="py-4 px-6 text-right">
                            <button
                              onClick={() => handleDeleteContact(con._id)}
                              style={{ color: '#FF8A8A', border: '1.5px solid #FF5252', backgroundColor: 'rgba(255, 82, 82, 0.15)' }}
                              className="hover:bg-red-600 hover:text-white text-[9px] font-extrabold uppercase tracking-widest transition-all duration-300 px-3 py-1.5 rounded-lg shadow-sm"
                            >
                              Delete Inquiry
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            )
          )}
        </div>

      </div>
    </div>
  );
}
