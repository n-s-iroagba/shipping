"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserAlt, faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
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
            ? "bg-white/95 backdrop-blur-xl text-[#0B1D3A] shadow-xl" 
            : "bg-transparent text-white"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/arbor-logo.png"
            alt="Arbor Global"
            width={44}
            height={44}
            className="rounded-lg"
          />
          <div className="flex flex-col leading-none">
            <span
              className="text-xl font-bold tracking-[0.2em] uppercase"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Arbor
            </span>
            <span className={`text-[10px] font-semibold tracking-[0.35em] uppercase ${
              scrolled ? "text-[#C9A84C]" : "text-[#C9A84C]"
            }`}>
              Global
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-[11px] font-semibold uppercase tracking-[0.2em] hover:text-[#C9A84C] transition-colors relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#C9A84C] transition-all group-hover:w-full"></span>
            </Link>
          ))}
        </div>

        {/* Auth & Actions */}
        <div className="flex items-center gap-4">
          <Link 
            href="/auth/login"
            className={`hidden sm:flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-[11px] tracking-[0.15em] uppercase transition-all border ${
              scrolled 
                ? "bg-[#0B1D3A] text-white border-[#0B1D3A] hover:bg-[#132d54]" 
                : "bg-transparent text-white border-white/30 hover:bg-white/10"
            }`}
          >
            <FontAwesomeIcon icon={faUserAlt} className="text-xs" />
            Client Portal
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
                  className="text-2xl font-semibold text-[#0B1D3A] uppercase tracking-[0.15em]"
                  style={{ fontFamily: "var(--font-playfair), serif" }}
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-px bg-slate-100 my-4"></div>
              <Link
                href="/auth/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-6 bg-[#0B1D3A]/5 rounded-2xl group"
              >
                <div>
                  <p className="text-[10px] font-semibold text-[#C9A84C] uppercase tracking-[0.3em] mb-1">Private Access</p>
                  <p className="text-lg font-bold text-[#0B1D3A]">Client Portal</p>
                </div>
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#0B1D3A] shadow-sm group-hover:bg-[#0B1D3A] group-hover:text-white transition-all">
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
