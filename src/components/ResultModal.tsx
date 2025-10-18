import { useEffect, useRef } from "react";

interface ResultModalProps {
  show: boolean;
  success: boolean;
  onClose: () => void;
}

const ResultModal = ({ show, success, onClose }: ResultModalProps) => {
  const scrollYRef = useRef(0);

  useEffect(() => {
    if (show) {
      scrollYRef.current = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollYRef.current}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.overflow = "hidden";
      document.body.style.width = "100%";
    } else {
      const scrollY = scrollYRef.current;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollY);
    }
  }, [show]);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 px-6"
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-sm text-center overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/*
        <div className="flex justify-center mt-6">
          {success ? (
            <img
              src="https://media1.tenor.com/m/BSY1qTH8g-oAAAAC/check.gif"
              alt="Success"
              className="w-[100px] h-[100px]"
            />
          ) : (
            <img
              src="https://media.tenor.com/sKDzNg2OwAsAAAAj/sad-face-emoji.gif"
              alt="Error"
              className="w-[90px] h-[90px]"
            />
          )}
        </div>
        */}

        <h2
          className={`text-[22px] font-semibold mt-5 ${
            success ? "text-black" : "text-red-500"
          }`}
        >
          {success ? "SUCCESS" : "ERROR"}
        </h2>

        <p className="text-black text-[15px] mb-6 mt-2 px-6">
          {success
            ? "Your registration was successful!"
            : "Something went wrong. Please try again."}
        </p>

        <button
          onClick={onClose}
          className={`w-full py-3 font-medium text-white transition-colors ${
            success
              ? "bg-gray-900 hover:bg-gray-800"
              : "bg-red-500 hover:bg-red-600"
          }`}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ResultModal;
