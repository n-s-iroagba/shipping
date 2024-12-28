
import { useState } from "react";
import NavModal from "./NavModal"
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
  import '../assets/styles/Navbar.css'
import { faUserAlt } from "@fortawesome/free-solid-svg-icons";

const Navbar: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  return (
    <nav className="relative z-20 flex justify-between items-center px-4 py-2 bg-transparent text-white">
     <div className=" bg-gold">
        <button onClick={toggleModal} className="focus:outline-none">
          <span className="block w-8 h-1 bg-black mb-1 mt-2"></span>
          <span className="block w-8 h-1 bg-black mb-1"></span>
          <span className="block w-8 h-1 bg-black mb-0"></span>
        </button>
      </div>
      <h2 className="text-2xl text-black font-bold">Logo</h2>
     
      <div className="bg-gold">
       <FontAwesomeIcon className="text-black" size="2x" onClick={toggleModal} icon={faUserAlt}/>
      </div>
      {isModalOpen && <NavModal onClose={toggleModal} />}
    </nav>
  );
};

export default Navbar;
