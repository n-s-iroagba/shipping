"use client";
import Footer from "@/components/Footer";
import type React from "react";

import Header from "@/components/Header";
import Information from "@/components/Information";
import Schedule from "@/components/Schedule";
import ScheduleCard from "@/components/ScheduleCard";
import image1 from "@/assets/images/auto.png";
import image2 from "@/assets/images/ship.png";
import image3 from "@/assets/images/ireefers.jpg";
import image4 from "@/assets/images/restoftheworld.jpg";
import image5 from "@/assets/images/transporttradefair.jpg";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import ContactInfo from "@/components/Contact";
import { useState } from "react";

export default function Home() {
  const images = [
    { src: image1, text: "Automobile Shipping Services" },
    { src: image2, text: "Goods and valuables logistics" },
    { src: image3, text: "Container shipping and logistics" },
    { src: image4, text: "International all over the world" },
    { src: image5, text: "Trade facilitation" },
  ];

  const [trackingId, setTrackingId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrackShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;

    setLoading(true);
    setError("");
    try {
      // Redirect to tracking dashboard
      window.location.href = `/tracking-dashboard/${trackingId}`;
    } catch (err) {
      console.error(err);
      setError("Shipment not found or tracking ID is invalid");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white">
      <Header />
     <br/>
      <Information
        title="Meeting Your Shiping Needs"
        text="Discover the best shipping solutions tailored for your needs."
        images={images}
      />
      <Schedule />
      <ContactInfo />
      <TestimonialCarousel />

      {/* Secondary Tracking Section */}
      <section id="tracking-section" className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-white p-12 rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-100">
            <h3 className="text-3xl font-black text-slate-900 mb-4 uppercase tracking-tighter">
              Quick Tracking
            </h3>
            <p className="text-slate-500 mb-10 max-w-md mx-auto">
              Enter your tracking number below for instant status updates on your global shipment.
            </p>
            
            <form onSubmit={handleTrackShipment} className="relative max-w-lg mx-auto">
              <input
                type="text"
                placeholder="Enter Tracking ID (e.g. TRK123456)"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                className="w-full pl-8 pr-48 py-6 bg-slate-50 border-2 border-slate-100 rounded-3xl focus:border-indigo-500 focus:bg-white transition-all outline-none text-lg font-bold"
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-2 top-2 bottom-2 px-8 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all disabled:opacity-50"
              >
                {loading ? "..." : "Track Now"}
              </button>
            </form>

            {error && (
              <div className="mt-6 text-red-600 font-bold text-sm animate-pulse">
                {error}
              </div>
            )}
          </div>
        </div>
      </section>

      <ScheduleCard />
      <Footer />
    </div>
  );
}
