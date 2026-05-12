import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";

import {
  companyAddress,
  companyEmail,

} from "@/data/constants";
const ContactInfo = () => {
  return (
    <div className="bg-white p-2 my-6 rounded-2xl shadow-xl w-full max-w-lg mx-auto text-center md:text-left overflow-hidden border border-gray-100">
      <h2 className="text-2xl font-bold mb-2 text-[#0B1D3A]" style={{ fontFamily: "var(--font-playfair), serif" }}>Private Contact</h2>
      <h6 className="text-xs font-bold tracking-[0.2em] uppercase mb-8 text-[#C9A84C]">For Bespoke Logistics</h6>
      <div className="flex flex-col gap-6 text-gray-700">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
          <div className="w-10 h-10 shrink-0 bg-[#0B1D3A]/5 rounded-full flex items-center justify-center">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-[#0B1D3A] w-4 h-4" />
          </div>
          <span className="text-sm leading-relaxed mt-2 md:mt-1">{companyAddress}</span>
        </div>


        <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
          <div className="w-10 h-10 shrink-0 bg-[#0B1D3A]/5 rounded-full flex items-center justify-center">
            <FontAwesomeIcon icon={faEnvelope} className="text-[#0B1D3A] w-4 h-4" />
          </div>
          <a
            href={`mailto:${companyEmail}`}
            className="text-sm font-medium text-gray-700 hover:text-[#C9A84C] transition-colors break-all mt-2 md:mt-1"
          >
            {companyEmail}
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
