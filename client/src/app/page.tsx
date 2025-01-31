"use client"
import Header from "@/components/Header";
import Information from "@/components/Information";
import Schedule from "@/components/Schedule";
import ScheduleCard from "@/components/ScheduleCard";


export default function H() {
  const images = [
    { src: "/image1.jpg", alt: "Service 1" },
    { src: "/image2.jpg", alt: "Service 2" },
    { src: "/image3.jpg", alt: "Service 3" },
    { src: "/image4.jpg", alt: "Service 4" },
    { src: "/image5.jpg", alt: "Service 5" },
    { src: "/image6.jpg", alt: "Service 6" },
  ];
  return (
    <>
    <Header/>
    <Information
        title="Our Services"
        text="Discover the best shipping solutions tailored for your needs."
        images={images}
      />
      <Schedule/>
      <Information
        title="Meeting Your Shiping needs"
        text="Discover the best shipping solutions tailored for your needs."
        images={images}
      />
      <ScheduleCard/>
    </>
  );
}
