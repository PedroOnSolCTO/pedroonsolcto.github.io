import React from "react";

const Hero = () => {
  return (
    <div className="relative h-screen">
      {/* Video Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        <video
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/pedro_billboard.MP4" type="video/mp4" />
        </video>
      </div>

      {/* Content */}
      <div className="relative z-20 flex flex-col justify-between h-full">
        {/* Quote Section */}
        <div className="pt-40 px-8 md:px-16">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-2 leading-tight tracking-wide">
              BILLION DOLLAR
              <br />
              MOVEMENT
            </h1>
            <div className="flex space-x-4 mt-8">
              <a
                href="https://t.me/PedroCTOPortal"
                target="_blank"
                className="bg-transparent border-2 border-white hover:bg-white/10 text-white px-8 py-4 rounded flex items-center space-x-2 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-2 14v-8l6 4-6 4z" />
                </svg>
                <span>JOIN COMMUNITY</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
