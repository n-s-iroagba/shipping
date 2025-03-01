import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserAlt } from "@fortawesome/free-solid-svg-icons";
import "../assets/styles/Navbar.css";

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);



  useEffect(() => {
    const handleScroll = () => {
      // Adjust the threshold value as needed
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`sticky top-0 z-20 flex justify-between items-center px-4 py-2 ${
        scrolled ? "bg-white text-black shadow-lg" : "bg-transparent"
      } transition-all duration-300`}
    >
      <div className="bg-gold">
        <button  className="focus:outline-none">
          <span className="block w-8 h-1 bg-black mb-1 mt-2"></span>
          <span className="block w-8 h-1 bg-black mb-1"></span>
          <span className="block w-8 h-1 bg-black mb-0"></span>
        </button>
      </div>
      <h2 className="text-2xl font-bold">Logo</h2>
      <div className="bg-gold">
        <FontAwesomeIcon
          className="text-black"
          size="2x"
          
          icon={faUserAlt}
        />
      </div>
    </nav>
  );
};

export default Navbar;
