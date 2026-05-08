import Image, { StaticImageData } from "next/image";
import React from "react";
import "../assets/styles/Information.css";
interface ImageData {
  src: StaticImageData;
  text: string;
}

interface InformationProps {
  title: string;
  text: string;
  images: ImageData[];
}

const Information: React.FC<InformationProps> = ({ title, text, images }) => {
  return (
    <div className="p-4 bg-white text-black my-5">
      <h2 className="text-3xl font-bold text-center mb-2">{title}</h2>
      <div className="h-2 bg-slate-800 mx-auto w-20 mb-4"></div>

      <p className="text-center text-gray-700 mb-8">{text}</p>

      <div className="flex gap-4 overflow-x-auto scrollbar-hidden pb-4">
        {images.map((image, index) => (
          <div
            key={index}
            onClick={() => document.getElementById('tracking-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="relative w-[90%] md:w-[45%] lg:w-[22%] h-64 flex-shrink-0 cursor-pointer group overflow-hidden rounded-2xl transition-all hover:shadow-2xl hover:-translate-y-1"
          >
            <Image
              src={image.src}
              alt={image.text}
              width={400}
              height={300}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent flex flex-col justify-end p-6 transition-opacity group-hover:bg-opacity-70">
              <p className="text-white text-lg font-bold leading-tight mb-2">
                {image.text}
              </p>
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                Track Service <span>→</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Information;
