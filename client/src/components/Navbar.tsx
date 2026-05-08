"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserAlt, faBars, faXmark, faTruckFast } from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import "../assets/styles/Navbar.css";

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-4 flex items-center justify-between ${
          scrolled 
            ? "bg-white/90 backdrop-blur-md text-slate-900 shadow-xl" 
            : "bg-transparent text-white"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className={`p-2 rounded-xl transition-colors ${scrolled ? "bg-slate-900 text-white" : "bg-white text-slate-900"}`}>
            <FontAwesomeIcon icon={faTruckFast} className="text-xl" />
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase italic">
            Netly<span className="text-indigo-500">Logistics</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-bold uppercase tracking-widest hover:text-indigo-500 transition-colors relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-500 transition-all group-hover:w-full"></span>
            </Link>
          ))}
        </div>

        {/* Auth & Actions */}
        <div className="flex items-center gap-4">
          <Link 
            href="/auth/login"
            className={`hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
              scrolled 
                ? "bg-slate-900 text-white hover:bg-slate-800" 
                : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
            }`}
          >
            <FontAwesomeIcon icon={faUserAlt} className="text-xs" />
            Sign In
          </Link>

          {/* Mobile Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-black/5 transition-colors"
          >
            <FontAwesomeIcon icon={mobileMenuOpen ? faXmark : faBars} className="text-2xl" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-3xl font-black text-slate-900 uppercase tracking-tighter"
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-px bg-slate-100 my-4"></div>
              <Link
                href="/auth/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl group"
              >
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Administrative Access</p>
                  <p className="text-xl font-bold text-slate-900">Partner Login</p>
                </div>
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-900 shadow-sm group-hover:bg-slate-900 group-hover:text-white transition-all">
                  <FontAwesomeIcon icon={faUserAlt} />
                </div>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
