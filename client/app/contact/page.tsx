"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiClock, 
  FiShield,
  FiSend,
  FiLoader,
  FiCheckCircle
} from "react-icons/fi";

import { companyEmail, companyAddress } from "@/data/constants";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 2000);
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      
      {/* Hero Header */}
      <header className="relative bg-[#0B1D3A] pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#C9A84C]/5 rounded-full blur-3xl" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C9A84C]/10 text-[#C9A84C] text-[10px] font-semibold uppercase tracking-[0.3em] mb-6 border border-[#C9A84C]/20"
          >
            <FiShield className="animate-pulse" /> Confidential Support
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            Get in <span className="text-[#C9A84C]">Touch</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/50 text-lg max-w-2xl mx-auto"
          >
            All enquiries are handled with the strictest confidence. Our concierge team is available around the clock.
          </motion.p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Contact Information */}
          <div className="lg:col-span-5 space-y-12">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.4em] uppercase text-[#C9A84C] mb-3">
                Private Channels
              </p>
              <h2
                className="text-3xl font-bold text-[#0B1D3A] mb-6"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                Contact Information
              </h2>
              <p className="text-slate-500 mb-10 leading-relaxed">
                Reach out through any of our secure channels. All communications are encrypted and NDA-protected.
              </p>
            </div>

            <div className="space-y-8">
                <a href={`mailto:${companyEmail}`} className="block group">
                  <div className="flex gap-6">
                    <div className="w-14 h-14 bg-[#C9A84C]/10 text-[#C9A84C] rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110">
                      <FiMail className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-semibold text-[#C9A84C] uppercase tracking-[0.2em] mb-1">Email Concierge</h4>
                      <p className="text-xl font-bold text-[#0B1D3A]">{companyEmail}</p>
                      <p className="text-slate-400 text-sm mt-1">Encrypted correspondence</p>
                    </div>
                  </div>
                </a>

              <div className="flex gap-6 group">
                <div className="w-14 h-14 bg-[#C9A84C]/10 text-[#C9A84C] rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110">
                  <FiPhone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-[10px] font-semibold text-[#C9A84C] uppercase tracking-[0.2em] mb-1">Private Line</h4>
                  <p className="text-xl font-bold text-[#0B1D3A]">+41 22 000 0000</p>
                  <p className="text-slate-400 text-sm mt-1">Direct to relationship manager</p>
                </div>
              </div>

              <div className="flex gap-6 group">
                <div className="w-14 h-14 bg-[#C9A84C]/10 text-[#C9A84C] rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110">
                  <FiMapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-[10px] font-semibold text-[#C9A84C] uppercase tracking-[0.2em] mb-1">Head Office</h4>
                  <p className="text-xl font-bold text-[#0B1D3A]">{companyAddress}</p>
                  <p className="text-slate-400 text-sm mt-1">By appointment only</p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-[#0B1D3A] rounded-2xl text-white">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-[#C9A84C]/10 rounded-xl flex items-center justify-center">
                  <FiClock className="text-[#C9A84C]" />
                </div>
                <h3 className="font-bold">Availability</h3>
              </div>
              <div className="space-y-2 text-sm text-white/50">
                <div className="flex justify-between">
                  <span>Monday – Friday</span>
                  <span className="text-white font-medium">8:00 AM – 8:00 PM CET</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="text-white font-medium">10:00 AM – 4:00 PM CET</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="text-[#C9A84C] font-bold">Emergency Concierge Only</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-10 md:p-16 rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100">
              {submitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20"
                >
                  <div className="w-24 h-24 bg-[#C9A84C]/10 text-[#C9A84C] rounded-full flex items-center justify-center mx-auto mb-8">
                    <FiCheckCircle className="w-12 h-12" />
                  </div>
                  <h2
                    className="text-4xl font-bold text-[#0B1D3A] mb-4"
                    style={{ fontFamily: "var(--font-playfair), serif" }}
                  >
                    Message Received
                  </h2>
                  <p className="text-slate-500 max-w-sm mx-auto mb-10">
                    Thank you for your enquiry. A member of our concierge team will respond within 2 hours.
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="px-10 py-4 bg-[#0B1D3A] text-white rounded-xl font-bold hover:bg-[#132d54] transition-all"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <>
                  <p className="text-[10px] font-semibold tracking-[0.4em] uppercase text-[#C9A84C] mb-3">
                    Secure Form
                  </p>
                  <h3
                    className="text-3xl font-bold text-[#0B1D3A] mb-4"
                    style={{ fontFamily: "var(--font-playfair), serif" }}
                  >
                    Send an Enquiry
                  </h3>
                  <p className="text-slate-500 mb-12">Complete the form below. All submissions are encrypted and confidential.</p>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-semibold text-[#0B1D3A] uppercase tracking-[0.2em] ml-1">Full Name</label>
                        <input required type="text" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#C9A84C] focus:bg-white transition-all outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-semibold text-[#0B1D3A] uppercase tracking-[0.2em] ml-1">Email Address</label>
                        <input required type="email" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#C9A84C] focus:bg-white transition-all outline-none" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] font-semibold text-[#0B1D3A] uppercase tracking-[0.2em] ml-1">Subject</label>
                      <select className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#C9A84C] focus:bg-white transition-all outline-none appearance-none cursor-pointer">
                        <option>General Enquiry</option>
                        <option>Consignment Tracking</option>
                        <option>Private Consultation</option>
                        <option>Corporate Partnership</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-semibold text-[#0B1D3A] uppercase tracking-[0.2em] ml-1">Your Message</label>
                      <textarea required rows={5} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#C9A84C] focus:bg-white transition-all outline-none resize-none" />
                    </div>

                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-3 px-10 py-5 bg-[#0B1D3A] text-white rounded-xl font-bold shadow-xl shadow-[#0B1D3A]/20 hover:bg-[#132d54] transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <FiLoader className="w-6 h-6 animate-spin" />
                      ) : (
                        <>
                          <FiSend className="w-5 h-5" />
                          <span>Submit Enquiry</span>
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
