import { formatDate } from "@/utils/utils";
import React from "react";

const ScheduleCard = () => {
  const columns = [
    { title: "Port of Load (POL)", body: "BREMERHAVEN (DEBRV)" },
    { title: "Port of Discharge (POD)", body: "MUNDRA (INMUN)" },
    { title: "Fastest Transit Time", body: "36 DAYS" },
    { title: "Next Departure", body: formatDate(3) },
    { title: "Service", body: "SWAN-SENTOSA" },
    { title: "Routing Type", body: "DIRECT" },
  ];

  return (
    <div className="container mx-auto mt-6 px-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {columns.map((col, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-xl p-5 text-center border border-gray-100 flex flex-col justify-center items-center hover:shadow-lg transition-shadow"
          >
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#C9A84C] mb-2">{col.title}</h3>
            <p className="text-sm font-semibold text-[#0B1D3A] break-words w-full">{col.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleCard;
