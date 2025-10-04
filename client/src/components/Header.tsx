"use client";

import React, { useState, useCallback } from "react";
import Navbar from "./Navbar";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useRouter } from "next/navigation";
import Image, { StaticImageData } from "next/image";
import { MagnifyingGlassIcon, TruckIcon } from "@heroicons/react/24/outline";
import image1 from "../assets/images/header.jpg";
import image2 from "../assets/images/transporttradefair.jpg";
import image3 from "../assets/images/ship.png";

const Header: React.FC = () => {
  const [trackingId, setTrackingId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setTrackingId(value);
    if (error) setError(""); // Clear error when user starts typing
  }, [error]);

  const handleFormSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!trackingId.trim()) {
      setError("Please enter a tracking ID");
      return;
    }

    if (trackingId.trim().length < 3) {
      setError("Tracking ID must be at least 3 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Add a small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 500));
      router.push(`/tracking-dashboard/${trackingId.trim()}`);
    } catch (err) {
      console.error(err)
      setError("Failed to navigate to tracking page");
      setLoading(false);
    }
  }, [trackingId, router]);

  const images: StaticImageData[] = [image1, image2, image3];

  return (
    <header className="py-6 relative bg-cover bg-center min-h-[120vh] md:min-h-[80vh] flex flex-col ">
      <Navbar />
      
      {/* Background Carousel */}
      <div className="absolute inset-0 z-0">
        <Carousel
          autoPlay
          infiniteLoop
          showThumbs={false}
          showArrows={false}
          showIndicators={false}
          showStatus={false}
          interval={6000}
          transitionTime={1000}
          stopOnHover={false}
        >
          {images.map((image, index) => (
            <div key={index} className="w-full h-full">
              <Image
                src={image}
                alt={`Logistics showcase ${index + 1}`}
                className="w-full h-screen lg:h-[80vh] object-cover"
                priority={index === 0}
                placeholder="blur"
              />
            </div>
          ))}
        </Carousel>
      </div>

      {/* Enhanced Overlay with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/50 to-slate-800/70 z-[1]"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between flex-grow text-center text-white px-4">
        
        {/* Hero Text */}
        <div className="flex-1 flex flex-col justify-center items-center mt-8 lg:mt-16">
          <div className="mb-8 space-y-4">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="p-3 bg-slate-800/80 backdrop-blur-sm rounded-full">
                <TruckIcon className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-light tracking-wide mb-2">
              LEADER IN
            </h1>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-wider bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
              SHIPPING LOGISTICS
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-200 mt-6 max-w-2xl mx-auto leading-relaxed">
              Fast, reliable, and secure shipping solutions worldwide
            </p>
          </div>
        </div>

        {/* Enhanced Tracking Form */}
        <div className="relative z-10 flex items-center justify-center mb-8 lg:mb-16">
          <div className="w-full max-w-lg mx-4">
            <form
              onSubmit={handleFormSubmit}
              className="bg-white/95 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-2xl border border-slate-200"
            >
              {/* Form Header */}
              <div className="mb-6 text-center">
                <div className="inline-flex items-center gap-2 mb-3">
                  <div className="p-2 bg-slate-800 rounded-full">
                    <MagnifyingGlassIcon className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">
                    TRACK YOUR SHIPMENT
                  </h2>
                </div>
                <p className="text-sm text-slate-600">
                  Enter your tracking ID to get real-time updates
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              )}

              {/* Input Field */}
              <div className="mb-6">
                <label
                  htmlFor="tracking-id"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  TRACKING ID
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="tracking-id"
                    className="w-full px-4 py-3 text-slate-800 bg-white border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-slate-800 transition-colors placeholder-slate-400 font-medium"
                    placeholder="Enter your tracking ID"
                    value={trackingId}
                    onChange={handleInputChange}
                    disabled={loading}
                    autoComplete="off"
                    autoCapitalize="characters"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <MagnifyingGlassIcon className="w-5 h-5 text-slate-400" />
                  </div>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Example: TRK123456789 or similar format
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !trackingId.trim()}
                className="w-full bg-slate-800 text-white py-3 px-6 rounded-lg hover:bg-slate-900 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-base transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Tracking...</span>
                  </>
                ) : (
                  <>
                    <TruckIcon className="w-5 h-5" />
                    <span>Track Shipment</span>
                  </>
                )}
              </button>

              {/* Additional Info */}
              <div className="mt-4 text-center">
                <p className="text-xs text-slate-500">
                  Need help? Contact our support team 24/7
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Floating indicators for carousel */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex space-x-2">
          {images.map((_, index) => (
            <div
              key={index}
              className="w-2 h-2 bg-white/50 rounded-full animate-pulse"
              style={{
                animationDelay: `${index * 2}s`,
                animationDuration: '6s'
              }}
            />
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;