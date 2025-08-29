import React from "react";

export const LeftSection = () => {
  return (
 <div className="relative w-1/2 h-screen bg-gradient-to-tr from-blue-400 via-white to-blue-400"> 

      
      {/* Bottom-left content */}
      <div className="absolute top-10 left-10">
        {/* Logo */}
        <img 
          src="/movie_logo.png"   // <-- replace with your actual logo src
          alt="Movie Logo"
          className="w-24 md:w-32 lg:w-40 mb-6"
        />
</div>
        {/* Text */}
              <div className="absolute bottom-10 left-10">

        <h1 className="font-poppins italic font-light text-2xl md:text-3xl lg:text-5xl leading-snug text-black max-w-sm md:max-w-md">
          Welcome. <br />
          Begin your cinematic <br />
          adventure now with <br />
          our ticketing platform!
        </h1>
      </div>

    </div>
  );
};
