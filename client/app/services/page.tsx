"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import {
  FiTruck,
  FiAnchor,
  FiAirplay,
  FiShield,
  FiGlobe,
  FiLock,
  FiBox,
  FiFileText
} from "react-icons/fi";

const services = [
  {
    title: "Private Ground Transport",
    description: "Armoured and unmarked road transport with GPS-monitored secure corridors across continents.",
    icon: <FiTruck className="w-8 h-8" />,
    color: "bg-[#0B1D3A]/5 text-[#0B1D3A]"
  },
  {
    title: "Maritime Asset Relocation",
    description: "Confidential ocean freight for large-scale relocations with climate-controlled containerisation and armed escort options.",
    icon: <FiAnchor className="w-8 h-8" />,
    color: "bg-[#0B1D3A]/5 text-[#0B1D3A]"
  },
  {
    title: "Priority Air Charter",
    description: "Private and commercial air freight for time-critical, high-value consignments with diplomatic customs facilitation.",
    icon: <FiAirplay className="w-8 h-8" />,
    color: "bg-[#0B1D3A]/5 text-[#0B1D3A]"
  },
  {
    title: "Secure Vault Storage",
    description: "State-of-the-art vault facilities with biometric access, 24/7 surveillance, and comprehensive insurance coverage.",
    icon: <FiShield className="w-8 h-8" />,
    color: "bg-[#0B1D3A]/5 text-[#0B1D3A]"
  },
  {
    title: "Customs & Compliance",
    description: "Expert navigation of international regulations, sanctions screening, and privileged customs clearance channels.",
    icon: <FiFileText className="w-8 h-8" />,
    color: "bg-[#0B1D3A]/5 text-[#0B1D3A]"
  },
  {
    title: "White-Glove Delivery",
    description: "Concierge-level final delivery with identity verification, photographic proof, and NDA-protected chain of custody.",
    icon: <FiBox className="w-8 h-8" />,
    color: "bg-[#0B1D3A]/5 text-[#0B1D3A]"
  }
];

import { companyEmail } from "@/data/constants";

export default function ServicesPage() {
  const handleContactClick = () => {
    window.location.href = `mailto:${companyEmail}`;
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      {/* Hero Header */}
      <header className=" bg-[#0B1D3A] pt-48 pb-32 px-6 overflow-hidden">
        <div className=" mr-16 -mt-16 w-64 h-64 bg-[#C9A84C]/5 rounded-full blur-3xl" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C9A84C]/10 text-[#C9A84C] text-[10px] font-semibold uppercase tracking-[0.3em] mb-6 border border-[#C9A84C]/20"
          >
            <FiGlobe className="animate-pulse" /> Bespoke Solutions
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            Our <span className="text-[#C9A84C]">Services</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/50 text-lg max-w-2xl mx-auto"
          >
            A comprehensive suite of confidential logistics solutions designed for clients who demand discretion, security, and excellence.
          </motion.p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-32 md:py-48">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group p-10 md:p-12 bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:border-[#C9A84C]/20 transition-all cursor-default"
            >
              <div className={`w-16 h-16 rounded-2xl ${service.color} flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}>
                {service.icon}
              </div>
              <h3 className="text-2xl font-bold text-[#0B1D3A] mb-4 tracking-tight">{service.title}</h3>
              <p className="text-slate-500 leading-relaxed">
                {service.description}
              </p>
              <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
                <span className="text-[10px] font-semibold text-[#C9A84C] uppercase tracking-[0.2em]">Enquire</span>
                <div
                  onClick={handleContactClick}
                  className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-[#0B1D3A] group-hover:text-[#C9A84C] transition-all cursor-pointer"
                >
                  →
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <section className="mt-32 md:mt-48 py-24 px-8 md:py-32 md:px-16 bg-[#0B1D3A] rounded-[3rem] text-white text-center shadow-2xl">

          <div className="relative z-10">
            <FiLock className="w-10 h-10 text-[#C9A84C] mx-auto mb-6" />
            <h2
              className="text-3xl md:text-5xl font-bold mb-6"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Ready to Begin?
            </h2>
            <p className="text-white/50 mb-10 max-w-xl mx-auto text-lg">
              Contact our private logistics team for a confidential consultation tailored to your requirements.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4">
              <button
                onClick={handleContactClick}
                className=" w-full px-10 py-4 bg-[#C9A84C] text-[#0B1D3A] rounded-xl font-bold hover:bg-[#d4b55c] transition-all"
              >
                Private Consultation
              </button>
              <button
                onClick={handleContactClick}
                className="w-full px-10 py-4 bg-white/5 text-white rounded-xl font-bold border border-white/10 hover:bg-white/10 transition-all"
              >
                Contact Concierge
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
