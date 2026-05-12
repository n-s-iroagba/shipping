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
        <div className="container mx-auto px-4 pt-32 pb-20">
          <div className="max-w-4xl mx-auto text-center text-white">
            <p className="text-[10px] font-semibold tracking-[0.4em] uppercase text-[#C9A84C] mb-6">
              Our Heritage
            </p>
            <h1
              className="text-4xl md:text-6xl font-bold mb-6 text-black"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              About {brandName}
            </h1>
            <p className="text-lg md:text-xl text-black mb-8 max-w-2xl mx-auto">
              Discreet global logistics for individuals and institutions who demand absolute confidentiality
            </p>
            <div className="flex justify-center">
              <div className="bg-[#C9A84C]/10 backdrop-blur-sm rounded-2xl p-8 border border-[#C9A84C]/20">
                <ShieldCheckIcon className="w-16 h-16 text-[#C9A84C] mx-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
                    <Icon className="w-8 h-8 text-[#C9A84C] mx-auto mb-4" />
                    <div className="text-3xl font-bold text-[#0B1D3A] mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm text-slate-500">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="py-20 bg-[#0B1D3A]/[0.02]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12 border border-slate-100">
              <p className="text-[10px] font-semibold tracking-[0.4em] uppercase text-[#C9A84C] mb-4 text-center">
                Est. 2008
              </p>
              <h2
                className="text-3xl md:text-4xl font-bold text-[#0B1D3A] mb-8 text-center"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                Our Story
              </h2>
              <div className="prose prose-lg max-w-none text-slate-600">
                <p className="text-lg leading-relaxed mb-6">
                  Founded in 2008, {brandName} was established to address a critical gap in global logistics:
                  the need for truly confidential, secure, and bespoke shipping services for high-net-worth
                  individuals, family offices, and distinguished institutions.
                </p>
                <p className="text-lg leading-relaxed mb-6">
                  From our headquarters in Geneva, we have built an unparalleled network spanning
                  over 50 jurisdictions, with dedicated secure corridors and NDA-protected operations
                  at every touchpoint. Our team comprises former diplomatic couriers, security specialists,
                  and luxury concierge professionals.
                </p>
                <p className="text-lg leading-relaxed">
                  At {brandName}, we understand that for our clients, discretion is not a luxury—it is
                  a necessity. Whether relocating a private collection, transporting sensitive documents,
                  or managing complex cross-border logistics, we provide an uncompromising standard of
                  care, security, and confidentiality.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <p className="text-[10px] font-semibold tracking-[0.4em] uppercase text-[#C9A84C] mb-4 text-center">
              Capabilities
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold text-[#0B1D3A] mb-12 text-center"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Our Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <div
                    key={index}
                    className="bg-[#0B1D3A]/[0.02] rounded-2xl p-8 border border-slate-100 hover:border-[#C9A84C]/30 transition-all"
                  >
                    <div className="bg-[#C9A84C]/10 p-4 rounded-xl w-fit mb-6">
                      <Icon className="w-8 h-8 text-[#C9A84C]" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#0B1D3A] mb-4">
                      {service.title}
                    </h3>
                    <p className="text-slate-500 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-20 bg-[#0B1D3A]/[0.02]">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <p className="text-[10px] font-semibold tracking-[0.4em] uppercase text-[#C9A84C] mb-4 text-center">
              Leadership
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold text-[#0B1D3A] mb-12 text-center"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Our Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100 text-center"
                >
                  <div className="bg-[#0B1D3A] w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <UsersIcon className="w-10 h-10 text-[#C9A84C]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#0B1D3A] mb-2">
                    {member.name}
                  </h3>
                  <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#C9A84C] mb-4">
                    {member.role}
                  </p>
                  <p className="text-slate-500">{member.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-20 bg-[#0B1D3A]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <p className="text-[10px] font-semibold tracking-[0.4em] uppercase text-[#C9A84C] mb-4">
              Private Enquiries
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold mb-8"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Get in Touch
            </h2>
            <p className="text-lg text-white/50 mb-12">
              All enquiries are treated with the utmost confidentiality. Our concierge team is available around the clock.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center">
                <div className="bg-[#C9A84C]/10 backdrop-blur-sm p-4 rounded-full mb-4 border border-[#C9A84C]/20">
                  <PhoneIcon className="w-8 h-8 text-[#C9A84C]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Call Us</h3>
                <p className="text-white/50">{telephoneNumber || "+41 22 000 0000"}</p>
              </div>
              <a href={`mailto:${companyEmail}`} className="flex flex-col items-center group">
                <div className="bg-[#C9A84C]/10 backdrop-blur-sm p-4 rounded-full mb-4 border border-[#C9A84C]/20 group-hover:bg-[#C9A84C]/20 transition-all">
                  <EnvelopeIcon className="w-8 h-8 text-[#C9A84C]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Email Us</h3>
                <p className="text-white/50 group-hover:text-[#C9A84C] transition-colors">{companyEmail}</p>
              </a>
              <div className="flex flex-col items-center">
                <div className="bg-[#C9A84C]/10 backdrop-blur-sm p-4 rounded-full mb-4 border border-[#C9A84C]/20">
                  <MapPinIcon className="w-8 h-8 text-[#C9A84C]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Visit Us</h3>
                <p className="text-white/50">{companyAddress}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
