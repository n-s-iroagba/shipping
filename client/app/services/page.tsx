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
  FiClock,
  FiBox,
  FiFileText
} from "react-icons/fi";

const services = [
  {
    title: "Ground Freight",
    description: "Secure and timely road transportation across continents with real-time tracking and specialized handling.",
    icon: <FiTruck className="w-8 h-8" />,
    color: "bg-blue-50 text-blue-600"
  },
  {
    title: "Ocean Freight",
    description: "Cost-effective international shipping for large volumes with comprehensive port-to-port and door-to-door services.",
    icon: <FiAnchor className="w-8 h-8" />,
    color: "bg-indigo-50 text-indigo-600"
  },
  {
    title: "Air Freight",
    description: "The fastest way to move your high-value or time-sensitive goods globally with premium carrier partnerships.",
    icon: <FiAirplay className="w-8 h-8" />,
    color: "bg-sky-50 text-sky-600"
  },
  {
    title: "Secure Warehousing",
    description: "State-of-the-art storage facilities with 24/7 monitoring, inventory management, and fulfillment services.",
    icon: <FiShield className="w-8 h-8" />,
    color: "bg-emerald-50 text-emerald-600"
  },
  {
    title: "Customs Brokerage",
    description: "Expert guidance through complex international regulations to ensure your shipments clear customs without delay.",
    icon: <FiFileText className="w-8 h-8" />,
    color: "bg-amber-50 text-amber-600"
  },
  {
    title: "Last Mile Delivery",
    description: "Precision delivery to the final destination, ensuring a premium experience for your end customers.",
    icon: <FiBox className="w-8 h-8" />,
    color: "bg-rose-50 text-rose-600"
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
      <header className="relative bg-slate-900 pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white/80 text-xs font-bold uppercase tracking-widest mb-6 border border-white/10"
          >
            <FiGlobe className="animate-pulse" /> Global Solutions
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter"
          >
            Our <span className="text-indigo-500">Services</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg max-w-2xl mx-auto"
          >
            We provide a comprehensive suite of logistics and shipping solutions designed to meet the demands of modern global commerce.
          </motion.p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group p-8 bg-white border border-slate-100 rounded-[2rem] shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:border-indigo-100 transition-all cursor-default"
            >
              <div className={`w-16 h-16 rounded-2xl ${service.color} flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                {service.icon}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">{service.title}</h3>
              <p className="text-slate-500 leading-relaxed">
                {service.description}
              </p>
              <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Learn More</span>
                <div 
                  onClick={handleContactClick}
                  className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all cursor-pointer"
                >
                  →
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <section className="mt-24 p-12 bg-indigo-600 rounded-[3rem] text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-24 -mt-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-64 h-64 bg-indigo-400 rounded-full blur-3xl" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-black mb-6 uppercase tracking-tighter">Ready to ship?</h2>
            <p className="text-indigo-100 mb-10 max-w-xl mx-auto text-lg">
              Get in touch with our logistics experts today for a customized quote tailored to your business needs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={handleContactClick}
                className="px-10 py-4 bg-white text-indigo-600 rounded-2xl font-bold hover:bg-slate-50 transition-all"
              >
                Request a Quote
              </button>
              <button 
                onClick={handleContactClick}
                className="px-10 py-4 bg-white/10 text-white rounded-2xl font-bold border border-white/20 hover:bg-white/20 transition-all"
              >
                Contact Sales
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
