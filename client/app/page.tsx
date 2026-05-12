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
    { src: image1, text: "Luxury Vehicle Transport" },
    { src: image2, text: "Maritime Asset Relocation" },
    { src: image3, text: "Temperature-Controlled Logistics" },
    { src: image4, text: "Global Concierge Delivery" },
    { src: image5, text: "Bespoke Trade Solutions" },
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
      setError("Consignment not found or tracking reference is invalid");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white">
      <Header />

      <Information
        title="Discreet Global Logistics"
        text="Bespoke shipping solutions designed for clients who value privacy, security, and absolute discretion."
        images={images}
      />
      <Schedule />

      <TestimonialCarousel />

      {/* Secondary Tracking Section */}
      <section id="tracking-section" className="py-24  bg-[#0B1D3A]/[0.03]">
        <div className="w-full px-2 mx-2 text-center">
          <div className="bg-white my-4 p-8 md:p-14 rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100">
            <p className="text-[10px] font-semibold tracking-[0.4em] uppercase text-[#C9A84C] mb-4">
              Private Access
            </p>
            <h3
              className="text-2xl md:text-3xl font-bold text-[#0B1D3A] mb-4"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Track Your Consignment
            </h3>
            <p className="text-slate-500 mb-10 max-w-md mx-auto text-sm md:text-base">
              Enter your private tracking reference below for encrypted, real-time status updates.
            </p>

            <form onSubmit={handleTrackShipment} className="flex flex-col sm:flex-row gap-4 mx-2">
              <input
                type="text"
                placeholder="Tracking Reference"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#C9A84C] focus:bg-white transition-all outline-none text-base font-medium"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-4 bg-[#0B1D3A] text-white rounded-xl font-semibold text-sm tracking-wide uppercase hover:bg-[#132d54] transition-all disabled:opacity-50 shrink-0 shadow-md"
              >
                {loading ? "..." : "Track Now"}
              </button>
            </form>

            {error && (
              <div className="mt-6 text-red-600 font-medium text-sm">
                {error}
              </div>
            )}
          </div>
        </div>
      </section>

      <ScheduleCard />
      <ContactInfo />
      <Footer />
    </div>
  );
}
