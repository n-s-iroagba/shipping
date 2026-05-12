"use client";

import {
  GlobeAltIcon,
  ShieldCheckIcon,
  ClockIcon,
  UsersIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { brandName, companyEmail, telephoneNumber, companyAddress } from "@/data/constants";

export default function AboutPage() {
  const stats = [
    { label: "Years of Excellence", value: "15+", icon: ClockIcon },
    { label: "Jurisdictions Served", value: "50+", icon: GlobeAltIcon },
    { label: "Distinguished Clients", value: "10K+", icon: UsersIcon },
    { label: "Secure Consignments", value: "100K+", icon: ShieldCheckIcon },
  ];

  const services = [
    {
      title: "Confidential Transport",
      description:
        "End-to-end encrypted logistics with NDA-protected operations for items requiring absolute discretion.",
      icon: LockClosedIcon,
    },
    {
      title: "Global Concierge",
      description:
        "Dedicated relationship managers providing 24/7 white-glove service across 50+ jurisdictions.",
      icon: GlobeAltIcon,
    },
    {
      title: "Priority Dispatch",
      description:
        "Time-critical delivery with private charter options and diplomatic-grade customs facilitation.",
      icon: ClockIcon,
    },
    {
      title: "Secure Asset Handling",
      description:
        "Military-grade security protocols and comprehensive insurance for high-value and irreplaceable items.",
      icon: ShieldCheckIcon,
    },
  ];

  const team = [
    {
      name: "S. Laurent",
      role: "Managing Director",
      description: `Leading ${brandName} with 20+ years in private logistics and asset protection.`,
    },
    {
      name: "M. Chen",
      role: "Head of Operations",
      description: "Overseeing secure logistics channels across all global corridors.",
    },
    {
      name: "E. Rodriguez",
      role: "Director, Client Relations",
      description:
        "Ensuring an exceptional and discreet experience for every distinguished client.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#0B1D3A] via-[#0f2847] to-[#0B1D3A]">
        <div className="container mx-auto px-4 pt-48 pb-40">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-[10px] font-bold tracking-[0.5em] uppercase text-[#C9A84C] mb-8">
              Our Heritage
            </p>
            <h1
              className="text-5xl md:text-8xl font-bold mb-10 text-black leading-[1.1]"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              About {brandName}
            </h1>
            <p className="text-xl md:text-2xl text-black mb-16 max-w-2xl mx-auto font-light leading-relaxed tracking-wide">
              Discreet global logistics for individuals and institutions who demand absolute confidentiality
            </p>
            <div className="flex justify-center">
              <div className="bg-white/5 backdrop-blur-md rounded-full p-10 border border-white/10 shadow-2xl">
                <ShieldCheckIcon className="w-16 h-16 text-[#C9A84C]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="pb-32">
        {/* Stats Section */}
        <section className="py-32 md:py-48">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="bg-white rounded-2xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 h-full flex flex-col items-center justify-center">
                      <Icon className="w-10 h-10 text-[#C9A84C] mb-6" />
                      <div className="text-4xl font-bold text-[#0B1D3A] mb-2">
                        {stat.value}
                      </div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="bg-[#0B1D3A]/[0.02] py-32 md:py-48">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.08)] p-10 md:p-24 border border-slate-100">
                <p className="text-[10px] font-bold tracking-[0.5em] uppercase text-[#C9A84C] mb-8 text-center">
                  Est. 2008
                </p>
                <h2
                  className="text-4xl md:text-6xl font-bold text-[#0B1D3A] mb-16 text-center"
                  style={{ fontFamily: "var(--font-playfair), serif" }}
                >
                  Our Story
                </h2>
                <div className="prose prose-lg max-w-none text-slate-600">
                  <p className="text-xl leading-relaxed mb-8 font-light italic">
                    Founded in 2008, {brandName} was established to address a critical gap in global logistics:
                    the need for truly confidential, secure, and bespoke shipping services for high-net-worth
                    individuals, family offices, and distinguished institutions.
                  </p>
                  <p className="text-lg leading-relaxed mb-8">
                    From our headquarters in Geneva, we have built an unparalleled network spanning
                    over 50 jurisdictions, with dedicated secure corridors and NDA-protected operations
                    at every touchpoint. Our team comprises former diplomatic couriers, security specialists,
                    and luxury concierge professionals.
                  </p>
                  <p className="text-lg leading-relaxed font-light">
                    At {brandName}, we understand that for our clients, discretion is not a luxury—it is
                    a necessity. Whether relocating a private collection, transporting sensitive documents,
                    or managing complex cross-border logistics, we provide an uncompromising standard of
                    care, security, and confidentiality.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="bg-white mt-6 py-32 md:py-48">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <p className="text-[10px] font-bold tracking-[0.5em] uppercase text-[#C9A84C] mb-6 text-center">
                Capabilities
              </p>
              <h2
                className="text-4xl md:text-6xl font-bold text-[#0B1D3A] mb-24 text-center"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                Our Services
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {services.map((service, index) => {
                  const Icon = service.icon;
                  return (
                    <div
                      key={index}
                      className="bg-[#0B1D3A]/[0.02] rounded-3xl p-12 border border-slate-100 hover:border-[#C9A84C]/30 transition-all group"
                    >
                      <div className="bg-[#C9A84C]/10 p-5 rounded-2xl w-fit mb-8 group-hover:bg-[#C9A84C]/20 transition-all">
                        <Icon className="w-10 h-10 text-[#C9A84C]" />
                      </div>
                      <h3 className="text-2xl font-bold text-[#0B1D3A] mb-4">
                        {service.title}
                      </h3>
                      <p className="text-slate-500 leading-relaxed text-lg font-light">
                        {service.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="bg-[#0B1D3A]/[0.02] py-32 md:py-48 my-12">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <p className="text-[10px] font-bold tracking-[0.5em] uppercase text-[#C9A84C] mb-6 text-center">
                Leadership
              </p>
              <h2
                className="text-4xl md:text-6xl font-bold text-[#0B1D3A] mb-24 text-center"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                Our Team
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {team.map((member, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-3xl shadow-xl p-12 border border-slate-100 text-center hover:translate-y-[-8px] transition-transform duration-500"
                  >
                    <div className="bg-[#0B1D3A] w-24 h-24 rounded-full mx-auto mb-8 flex items-center justify-center shadow-2xl">
                      <UsersIcon className="w-12 h-12 text-[#C9A84C]" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#0B1D3A] mb-2">
                      {member.name}
                    </h3>
                    <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#C9A84C] mb-6">
                      {member.role}
                    </p>
                    <p className="text-slate-500 leading-relaxed font-light">
                      {member.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-[#0B1D3A] py-32 md:py-56 rounded-[4rem] mx-4 md:mx-8">
          <div className=" mx-auto p-8">
            <div className="max-w-4xl mx-auto text-center text-white">
              <p className="text-[10px] font-bold tracking-[0.5em] uppercase text-[#C9A84C] mb-8">
                Private Enquiries
              </p>
              <h2
                className="text-4xl md:text-8xl font-bold mb-12"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                Get in Touch
              </h2>
              <p className="text-xl md:text-2xl text-white/50 mb-20 font-light max-w-2xl mx-auto">
                All enquiries are treated with the utmost confidentiality. Our concierge team is available around the clock.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="flex flex-col items-center">
                  <div className="bg-white/5 backdrop-blur-md p-6 rounded-full mb-6 border border-white/10">
                    <PhoneIcon className="w-10 h-10 text-[#C9A84C]" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 uppercase tracking-widest text-[10px] text-[#C9A84C]">Call Us</h3>
                  <p className="text-white text-lg font-light">{telephoneNumber || "+41 22 000 0000"}</p>
                </div>
                <a href={`mailto:${companyEmail}`} className="flex flex-col items-center group">
                  <div className="bg-white/5 backdrop-blur-md p-6 rounded-full mb-6 border border-white/10 group-hover:bg-[#C9A84C]/20 transition-all">
                    <EnvelopeIcon className="w-10 h-10 text-[#C9A84C]" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 uppercase tracking-widest text-[10px] text-[#C9A84C]">Email Us</h3>
                  <p className="text-white text-lg font-light group-hover:text-[#C9A84C] transition-colors">{companyEmail}</p>
                </a>
                <div className="flex flex-col items-center">
                  <div className="bg-white/5 backdrop-blur-md p-6 rounded-full mb-6 border border-white/10">
                    <MapPinIcon className="w-10 h-10 text-[#C9A84C]" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 uppercase tracking-widest text-[10px] text-[#C9A84C]">Visit Us</h3>
                  <p className="text-white text-lg font-light">{companyAddress}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
