import React from "react";

const Navbar = () => {
  return (
    <nav className="absolute top-0 left-0 w-full z-[100] bg-gradient-to-b from-black/90 to-black/0">
      <div className="mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-8">
            <img src="/images/ticker_logo.png" alt="Pedro" className="h-8" />
            <div className="hidden md:flex items-center space-x-8">
              <div className="group relative">
                <a
                  href="#"
                  className="text-gray-300 hover:text-white uppercase tracking-wide text-lg"
                >
                  Game
                </a>
                <div className="absolute h-0.5 bg-pedro-red w-0 group-hover:w-full transition-all duration-200"></div>
              </div>
              <div className="group relative">
                <a
                  href="#"
                  className="text-gray-300 hover:text-white uppercase tracking-wide text-lg"
                >
                  Heroes
                </a>
                <div className="absolute h-0.5 bg-pedro-red w-0 group-hover:w-full transition-all duration-200"></div>
              </div>
              <div className="group relative">
                <a
                  href="#"
                  className="text-gray-300 hover:text-white uppercase tracking-wide text-lg"
                >
                  News
                </a>
                <div className="absolute h-0.5 bg-pedro-red w-0 group-hover:w-full transition-all duration-200"></div>
              </div>
              <div className="group relative">
                <a
                  href="#"
                  className="text-gray-300 hover:text-white uppercase tracking-wide text-lg"
                >
                  Esports
                </a>
                <div className="absolute h-0.5 bg-pedro-red w-0 group-hover:w-full transition-all duration-200"></div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-300 hover:text-white uppercase tracking-wide text-lg">
              Login
            </button>
            <button className="bg-pedro-red hover:bg-pedro-red/90 px-6 py-2 rounded uppercase tracking-wide text-sm transition-colors">
              BUY PEDRO
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
