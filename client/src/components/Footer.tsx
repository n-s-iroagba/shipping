import Link from "next/link";
import Image from "next/image";
import { companyEmail } from "@/data/constants";

const Footer = () => {
  return (
    <footer className="bg-[#0B1D3A] text-white py-16 mt-10 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          {/* Company Info */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3 justify-center md:justify-start mb-4">
              <Image
                src="/arbor-logo.png"
                alt="Arbor Global"
                width={36}
                height={36}
                className="rounded-lg"
              />
              <div className="flex flex-col leading-none">
                <span
                  className="text-lg font-bold tracking-[0.2em] uppercase"
                  style={{ fontFamily: "var(--font-playfair), serif" }}
                >
                  Arbor
                </span>
                <span className="text-[9px] font-semibold tracking-[0.35em] uppercase text-[#C9A84C]">
                  Global
                </span>
              </div>
            </div>
            <p className="text-sm text-white/60 leading-relaxed max-w-xs mx-auto md:mx-0">
              Discreet, secure, and bespoke logistics for distinguished clients
              who demand absolute confidentiality.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#C9A84C] mb-4">
              Quick Links
            </h2>
            <ul className="mt-2 space-y-3">
              <li>
                <Link href="/#tracking-section" className="text-sm text-white/70 hover:text-[#C9A84C] transition-colors">
                  Track Consignment
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-sm text-white/70 hover:text-[#C9A84C] transition-colors">
                  Our Services
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-white/70 hover:text-[#C9A84C] transition-colors">
                  About Arbor Global
                </Link>
              </li>
              <li>
                <a href={`mailto:${companyEmail}`} className="text-sm text-white/70 hover:text-[#C9A84C] transition-colors">
                  Private Support
                </a>
              </li>
            </ul>
          </div>

          {/* Trust & Compliance */}
          <div>
            <h2 className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#C9A84C] mb-4">
              Trust & Security
            </h2>
            <div className="space-y-3 text-sm text-white/60">
              <p>256-bit End-to-End Encryption</p>
              <p>GDPR & International Compliance</p>
              <p>NDA-Protected Operations</p>
              <p>24/7 Dedicated Concierge</p>
            </div>
          </div>
        </div>

        <hr className="border-white/10 my-10" />

        {/* Copyright */}
        <div className="text-center text-xs text-white/40 tracking-wider">
          &copy; {new Date().getFullYear()} Arbor Global. All rights reserved.
          <span className="mx-2">&middot;</span>
          Confidential & Proprietary
        </div>
      </div>
    </footer>
  );
};

export default Footer;
