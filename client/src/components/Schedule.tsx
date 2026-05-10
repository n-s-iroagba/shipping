import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";

const portOptions = [
  { value: "Aarhus, Denmark (DKAAR)", label: "Aarhus, Denmark (DKAAR)" },
  {
    value: "Adelaide, Australia (AUADL)",
    label: "Adelaide, Australia (AUADL)",
  },
  { value: "Shanghai, China (CNSHA)", label: "Shanghai, China (CNSHA)" },
  { value: "Los Angeles, USA (USLAX)", label: "Los Angeles, USA (USLAX)" },
];

const Schedule: React.FC = () => {
  const [fromPort, setFromPort] = useState<string>("");
  const [toPort, setToPort] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    setSelectedDate(new Date());
  }, []);
  const handleSearch = () => {
    alert("No shipping from this port on this date");
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white shadow-xl border border-gray-100 rounded-2xl p-6 md:p-8">
      <h2 className="text-2xl font-bold text-center mb-6 relative text-[#0B1D3A]" style={{ fontFamily: "var(--font-playfair), serif" }}>
        Consignment Routing
        <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 h-1 w-16 bg-[#C9A84C] rounded-full"></div>
      </h2>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
        <div className="flex flex-col w-full md:w-2/5">
          <label className="text-[10px] font-bold tracking-widest uppercase mb-2 text-[#0B1D3A]">Origin Port</label>
          <select
            value={fromPort}
            onChange={(
              e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
            ) => setFromPort(e.target.value)}
            className="w-full text-sm text-[#0B1D3A] bg-gray-50 border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] transition-all"
          >
            <option value="" disabled>Select Origin</option>
            {portOptions.map((option, idx) => {
              return (
                <option key={idx} value={option.value}>
                  {option.label}
                </option>
              );
            })}
          </select>
          <div className="mt-4">
            <label className="text-[10px] font-bold tracking-widest uppercase mb-2 text-[#0B1D3A] block">Departure Date</label>
            <input
              readOnly
              value={selectedDate.toDateString()}
              className="w-full border border-gray-200 bg-gray-50 rounded-lg p-3 text-sm focus:outline-none text-[#0B1D3A]"
            />
          </div>
        </div>

        <div className="flex items-center justify-center w-full md:w-auto py-2 md:py-0">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-[#0B1D3A] text-white rounded-full flex items-center justify-center shadow-md transform rotate-90 md:rotate-0">
            <FontAwesomeIcon icon={faArrowRight} />
          </div>
        </div>

        <div className="flex flex-col w-full md:w-2/5">
          <label className="text-[10px] font-bold tracking-widest uppercase mb-2 text-[#0B1D3A]">Destination Port</label>
          <select
            value={toPort}
            onChange={(
              e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
            ) => setToPort(e.target.value)}
            className="w-full text-sm text-[#0B1D3A] bg-gray-50 border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] transition-all"
          >
            <option value="" disabled>Select Destination</option>
            {portOptions.map((option, idx) => {
              return (
                <option key={idx} value={option.value}>
                  {option.label}
                </option>
              );
            })}
          </select>
          <button
            onClick={handleSearch}
            className="mt-4 w-full bg-[#C9A84C] text-[#0B1D3A] font-bold tracking-wide uppercase text-xs py-3.5 px-4 rounded-lg hover:bg-[#b89540] transition-colors focus:outline-none shadow-md"
          >
            Check Availability
          </button>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
