import React from "react";
import { Link } from "react-router-dom";

const Cancel: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-lg text-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">
          Ordre annulleret
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Din ordre er blevet annulleret.
        </p>
        <Link
          to="/cart"
          className="bg-[#1c1c1c] text-white py-3 px-6 rounded-md text-lg font-medium"
        >
          Tilbage til kurv
        </Link>
      </div>
    </div>
  );
};

export default Cancel;
