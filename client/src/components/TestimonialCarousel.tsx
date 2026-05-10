"use client";

import { useState } from "react";
import { Carousel } from "react-responsive-carousel";
import Image, { type StaticImageData } from "next/image";
import image1 from "../assets/testimonial_images/female1.jpeg";
import image2 from "../assets/testimonial_images/female2.jpeg";
import image3 from "../assets/testimonial_images/female3.jpeg";
import image4 from "../assets/testimonial_images/female4.jpeg";
import image5 from "../assets/testimonial_images/female5.jpeg";
import image6 from "../assets/testimonial_images/male1.jpeg";
import image7 from "../assets/testimonial_images/male2.jpeg";
import image8 from "../assets/testimonial_images/male3.jpeg";
import image9 from "../assets/testimonial_images/male4.jpeg";
import image10 from "../assets/testimonial_images/male5.jpeg";
import { testimonials } from "@/data/testimonial";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const images: StaticImageData[] = [
  image10,
  image1,
  image2,
  image3,
  image4,
  image5,
  image6,
  image7,
  image8,
  image9,
];
const TestimonialCarousel = () => {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex: number) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel
      autoPlay
      infiniteLoop
      showThumbs={false}
      showStatus={false}
      showIndicators={false}
      selectedItem={index}
      onChange={handleSelect}
      className="w-full max-w-lg mx-auto"
    >
      {testimonials.map((testimonial, idx) => (
        <div
          key={idx}
          className="bg-white p-6 md:p-8 rounded-2xl shadow-md text-center mx-2 mb-8 border border-gray-100"
        >
          <div className="flex justify-center mb-4 gap-1">
            <FontAwesomeIcon className="text-[#C9A84C]" icon={faStar} />
            <FontAwesomeIcon className="text-[#C9A84C]" icon={faStar} />
            <FontAwesomeIcon className="text-[#C9A84C]" icon={faStar} />
            <FontAwesomeIcon className="text-[#C9A84C]" icon={faStar} />
            <FontAwesomeIcon className="text-[#C9A84C]" icon={faStar} />
          </div>
          <p className="text-gray-700 italic text-sm md:text-base leading-relaxed mb-6">&quot;{testimonial.testimonial}&quot;</p>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 relative mb-3 rounded-full border-2 border-[#C9A84C]/20 p-1">
              <Image
                src={images[idx] || "/placeholder.svg"}
                alt={`Client ${testimonial.name}`}
                className="rounded-full"
                layout="fill"
                objectFit="cover"
              />
            </div>
            <p className="text-[#0B1D3A] font-bold text-sm tracking-wide uppercase">{testimonial.name}</p>
          </div>
        </div>
      ))}
    </Carousel>
  );
};

export default TestimonialCarousel;
