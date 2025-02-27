import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import Select from "react-select";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const portOptions = [
  { value: "Aarhus, Denmark (DKAAR)", label: "Aarhus, Denmark (DKAAR)" },
  { value: "Adelaide, Australia (AUADL)", label: "Adelaide, Australia (AUADL)" },
  { value: "Shanghai, China (CNSHA)", label: "Shanghai, China (CNSHA)" },
  { value: "Los Angeles, USA (USLAX)", label: "Los Angeles, USA (USLAX)" },
];

const Schedule: React.FC = () => {
  const [fromPort, setFromPort] = useState<{ value: string; label: string } | null>(null);
  const [toPort, setToPort] = useState<{ value: string; label: string } | null>(null);
  const selectedDate= new Date();


  const handleSearch = () => {
    alert('No shipping from this port on this date')
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
   
      <h2 className="text-2xl font-bold text-center mb-4 relative">
        Point-to-Point
        <div className="absolute left-1/2 transform -translate-x-1/2 mt-1 h-1 w-24 bg-goldenrod rounded-full"></div>
      </h2>


      <div className="flex items-center justify-between gap-4">
  
        <div className="flex flex-col w-1/3">
          <label className="text-sm font-medium mb-1">From Port</label>
          <Select
            options={portOptions}
            value={fromPort}
            onChange={(selectedOption) => setFromPort(selectedOption)}
            placeholder="Select a port"
            className="text-sm"
          />
          <div className="mt-2">
            <DatePicker
              selected={selectedDate}
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-goldenrod text-black"
              dateFormat="dd/MM/yyyy"
            />
          </div>
        </div>

     
        <div className="flex items-center justify-center w-1/6">
          <button className="w-12 h-12 bg-goldenrod text-white rounded-full flex-col flex items-center justify-center focus:outline-none hover:bg-goldenrod-dark">
            <div>
              <FontAwesomeIcon icon={faArrowRight} />
            </div>
            <div>
              <FontAwesomeIcon icon={faArrowRight} />
            </div>
          </button>
        </div>

    
        <div className="flex flex-col w-1/3">
          <label className="text-sm font-medium mb-1">To Port</label>
          <Select
            options={portOptions}
            value={toPort}
            onChange={(selectedOption) => setToPort(selectedOption)}
            placeholder="Select a port"
            className="text-sm text-black"
          />
          <button
            onClick={handleSearch}
            className="mt-4 bg-goldenrod text-white py-2 px-4 rounded-md hover:bg-goldenrod-dark focus:outline-none"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
