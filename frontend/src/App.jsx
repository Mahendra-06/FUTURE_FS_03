import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar       from './components/Navbar';
import Hero         from './components/Hero';
import About        from './components/About';
import Menu         from './components/Menu';
import Gallery      from './components/Gallery';
import Reservation  from './components/Reservation';
import Testimonials from './components/Testimonials';
import Contact      from './components/Contact';
import Footer       from './components/Footer';
import AdminDashboard from './components/AdminDashboard';

function HomePage({ addToCart }) {
  return (
    <main>
      <Hero />
      <Menu addToCart={addToCart} />
      <About />
      <Gallery />
      <Testimonials />
      <Reservation />
      <Contact />
    </main>
  );
}

function MenuPage({ addToCart })    { return <main className="pt-24"><Menu addToCart={addToCart} /></main>;    }
function AboutPage()   { return <main className="pt-24"><About /></main>;   }
function GalleryPage() { return <main className="pt-24"><Gallery /></main>; }
function ContactPage() {
  return (
    <main className="pt-24">
      <Reservation />
      <Contact />
    </main>
  );
}

export default function App() {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => setCart([]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-bar-texture flex flex-col justify-between">
        <div>
          <Navbar cart={cart} removeFromCart={removeFromCart} clearCart={clearCart} />
          <Routes>
            <Route path="/"        element={<HomePage addToCart={addToCart} />} />
            <Route path="/menu"    element={<MenuPage addToCart={addToCart} />} />
            <Route path="/about"   element={<AboutPage   />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/admin"   element={<AdminDashboard />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
