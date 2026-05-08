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
  FiMessageSquare,
  FiSend,
  FiLoader,
  FiCheckCircle
} from "react-icons/fi";

import { companyEmail } from "@/data/constants";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 2000);
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
            <FiMessageSquare className="animate-pulse" /> Support 24/7
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter"
          >
            Get in <span className="text-indigo-500">Touch</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg max-w-2xl mx-auto"
          >
            Have questions about your shipment? Our team of logistics experts is here to provide the support you need.
          </motion.p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Contact Information */}
          <div className="lg:col-span-5 space-y-12">
            <div>
              <h2 className="text-3xl font-black text-slate-900 mb-6 uppercase tracking-tight">Contact Information</h2>
              <p className="text-slate-500 mb-10 leading-relaxed">
                Reach out through any of our channels. We aim to respond to all inquiries within 2 business hours.
              </p>
            </div>

            <div className="space-y-8">
                <a href={`mailto:${companyEmail}`} className="block group">
                  <div className="flex gap-6">
                    <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110">
                      <FiMail className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Email Us</h4>
                      <p className="text-xl font-bold text-slate-900">{companyEmail}</p>
                      <p className="text-slate-400 text-sm mt-1">For general inquiries and support</p>
                    </div>
                  </div>
                </a>

              <div className="flex gap-6 group">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110">
                  <FiPhone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Call Us</h4>
                  <p className="text-xl font-bold text-slate-900">+1 (800) 555-LOGI</p>
                  <p className="text-slate-400 text-sm mt-1">Mon-Fri from 8am to 6pm EST</p>
                </div>
              </div>

              <div className="flex gap-6 group">
                <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110">
                  <FiMapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Our Headquarters</h4>
                  <p className="text-xl font-bold text-slate-900">123 Logistics Plaza, Global Trade City, NY 10001</p>
                  <p className="text-slate-400 text-sm mt-1">Visit our office for a consultation</p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <FiClock className="text-indigo-400" />
                </div>
                <h3 className="font-bold">Business Hours</h3>
              </div>
              <div className="space-y-2 text-sm text-slate-400">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span className="text-white font-medium">8:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="text-white font-medium">10:00 AM - 2:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="text-indigo-400 font-bold">Emergency Support Only</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-10 md:p-16 rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-100">
              {submitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20"
                >
                  <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <FiCheckCircle className="w-12 h-12" />
                  </div>
                  <h2 className="text-4xl font-black text-slate-900 mb-4 uppercase tracking-tighter">Message Sent!</h2>
                  <p className="text-slate-500 max-w-sm mx-auto mb-10">
                    Thank you for reaching out. One of our logistics specialists will contact you shortly.
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <>
                  <h3 className="text-3xl font-black text-slate-900 mb-4 uppercase tracking-tighter">Send a Message</h3>
                  <p className="text-slate-500 mb-12">Fill out the form below and we'll get back to you within 2 hours.</p>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                        <input required type="text" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-indigo-500 focus:bg-white transition-all outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                        <input required type="email" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-indigo-500 focus:bg-white transition-all outline-none" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Subject</label>
                      <select className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-indigo-500 focus:bg-white transition-all outline-none appearance-none cursor-pointer">
                        <option>General Inquiry</option>
                        <option>Shipment Tracking Help</option>
                        <option>Request a Quote</option>
                        <option>Corporate Partnership</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Your Message</label>
                      <textarea required rows={5} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-indigo-500 focus:bg-white transition-all outline-none resize-none" />
                    </div>

                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-3 px-10 py-5 bg-slate-900 text-white rounded-2xl font-bold shadow-xl shadow-slate-300 hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <FiLoader className="w-6 h-6 animate-spin" />
                      ) : (
                        <>
                          <FiSend className="w-5 h-5" />
                          <span>Transmit Message</span>
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
