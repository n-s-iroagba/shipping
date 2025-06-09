"use client"
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Information from "@/components/Information";
import Schedule from "@/components/Schedule";
import ScheduleCard from "@/components/ScheduleCard";
const image1 = '/images/auto.png'
const image2 = '/images/ship.png'
const image3 = '/images/ireefers.jpg'
const image4 = '/images/restoftheworld.jpg'
const image5 = '/images/transporttradefair.jpg'
import TestimonialCarousel from "@/components/TestimonialCarousel";
import ContactInfo from "@/components/Contact";


export default function H() {
  const images = [
    { src: image1, text: "Automobile Shipping Services" },
    { src: image2, text: "Goods and valuables logistics" },
    { src: image3, text: "Container shipping and logistics" },
    { src: image4, text: 'International all over the world' },
    { src: image5, text: "Trade facilitation" },

  ];
  return (
    <div className="bg-white">
    <Header/>
    
    <Information
        title="Meeting Your Shiping needs"
        text="Discover the best shipping solutions tailored for your needs."
        images={images}
      />
      <Schedule/>
      <ContactInfo/>
      <TestimonialCarousel/>
     
      <ScheduleCard/>
      <Footer/>
    </div>
  );
}
