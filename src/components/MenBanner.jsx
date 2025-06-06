import React from "react";
import menBan from "./Assets/menBanner2.jpg"; // Make sure this is your imported image path

const IndianSummer = () => {
  return (
    <div className="w-full max-w-[1920px] mx-auto px-4 md:px-8 lg:px-12 mt-140px">
      <div
        className="relative max-h-dvh w-full bg-cover bg-center flex items-end justify-start mt-8"
        style={{ backgroundImage: `url(${menBan})` }}
      >
        
      </div>
    </div>
  );
};

export default IndianSummer;
