"use client";

import { useState } from "react";
import { Carousel } from "react-responsive-carousel";
import Image from "next/image";

interface Testimonial {
  name: string;
  testimonial: string;
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
  images: string[];
  stars:string
;
}

const TestimonialCarousel: React.FC<TestimonialCarouselProps> = ({
  testimonials,
  images,
  stars,
}) => {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex: number) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel
      showThumbs={false}
      showStatus={false}
      showIndicators={false}
      selectedItem={index}
      onChange={handleSelect}
      className="w-full max-w-lg mx-auto"
    >
      {testimonials.map((testimonial, idx) => (
        <div key={idx} className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="mb-4 text-yellow-500">{stars}</div>
          <p className="text-gray-700 italic">{testimonial.testimonial}</p>
          <div className="mt-4 flex flex-col items-center">
            <div className="w-16 h-16 relative mb-2">
              <Image
                src={images[idx]}
                alt={`Testimonial from ${testimonial.name}`}
                className="rounded-full"
                layout="fill"
                objectFit="cover"
              />
            </div>
            <p className="text-gray-600 font-semibold">- {testimonial.name}</p>
          </div>
        </div>
      ))}
    </Carousel>
  );
};

export default TestimonialCarousel;
