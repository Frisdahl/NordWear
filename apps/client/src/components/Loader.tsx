import React, { useState, useEffect } from "react";

interface LoaderProps {
  onAnimationComplete: () => void;
}

const Loader: React.FC<LoaderProps> = ({ onAnimationComplete }) => {
  const [percentage, setPercentage] = useState(0);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  useEffect(() => {
    // When percentage hits 100, start the exit animation sequence
    if (percentage >= 100) {
      const timer = setTimeout(() => {
        setIsAnimatingOut(true);
        // Set another timeout that matches the CSS animation duration before calling the final callback
        setTimeout(onAnimationComplete, 1000);
      }, 500); // A brief pause at 100% before animating out

      return () => clearTimeout(timer);
    }

    // Interval to increment the percentage counter
    const interval = setInterval(() => {
      setPercentage((prev) => Math.min(prev + 1, 100));
    }, 30); // Adjust this value for a faster/slower load time

    return () => clearInterval(interval);
  }, [percentage, onAnimationComplete]);

  const text = "NORDWEAR NORDWEAR - ";
  const chars = text.split("");
  const radius = 100; // The radius of the text circle
  const angle = 360 / chars.length;

  return (
    <div
      className={`fixed inset-0 z-[10000] flex items-center justify-center bg-white transition-all duration-1000 ease-in-out ${
        isAnimatingOut
          ? "opacity-0 -translate-y-full"
          : "opacity-100 translate-y-0"
      }`}
    >
      {/* SVG Container for the rotating circular text */}
      <div className="w-52 h-52 animate-spin-slow">
        <svg viewBox="0 0 100 100">
          <defs>
            <path
              id="circlePath"
              d="M 50, 50 m -40, 0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0"
            />
          </defs>
          <text className="text-xs font-semibold uppercase text-gray-800 tracking-wider">
            <textPath href="#circlePath" startOffset="50%" text-anchor="middle">
              <tspan>NORDWEAR</tspan>
              <tspan dx="1.5em">—</tspan>
              <tspan dx="2em">NORDWEAR</tspan>
              <tspan dx="1.5em">—</tspan>
            </textPath>
          </text>
        </svg>
      </div>

      {/* Counter, centered independently in the viewport */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <span
          className="text-5xl font-light text-gray-900"
          style={{ fontFamily: "'EB Garamond', serif" }}
        >
          {percentage}%
        </span>
      </div>
    </div>
  );
};

export default Loader;
