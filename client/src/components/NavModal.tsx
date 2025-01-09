import { useRouter } from "next/navigation";
import React from "react";

interface ModalProps {
  onClose: () => void;
}

const NavModal: React.FC<ModalProps> = ({ onClose }) => {
  const router = useRouter();

  const handleRoute = (path: string) => {
    router.push(path);
  };

  const handleAlert = (message: string) => {
    alert(message); // Show an alert box with the given message
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-3xl focus:outline-none"
      >
        &times;
      </button>
      <ul className="text-white text-xl space-y-4 text-center">
        <li>
          <button
            onClick={() => handleRoute('/login')}
            className="bg-goldenrod text-black w-48 py-3 rounded focus:outline-none hover:underline"
          >
            Login As Receiver
          </button>
        </li>
        <li>
          <button
            onClick={() =>
              handleAlert(
                "Service not currently available, to check your shipment log in as a receiver."
              )
            }
            className="bg-goldenrod text-black w-48 py-3 rounded focus:outline-none hover:underline"
          >
            Login As Sender
          </button>
        </li>
        <li>
          <button
            onClick={() =>
              handleAlert(
                "Service not currently available, to check your shipment log in as a receiver."
              )
            }
            className="bg-goldenrod text-black w-48 py-3 rounded focus:outline-none hover:underline"
          >
            Sign Up
          </button>
        </li>
      </ul>
    </div>
  );
};

export default NavModal;
