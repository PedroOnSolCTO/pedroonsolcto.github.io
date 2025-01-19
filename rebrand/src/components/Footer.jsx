import React from "react";

const Footer = () => {
  return (
    <footer>
      {/* Call to Action Section */}
      <div className="relative bg-pedro-dark py-32">
        {/* Background Image */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="/images/background_image.jpg"
            alt=""
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="max-w-2xl">
            <h2 className="text-6xl font-bold mb-8">
              <span className="text-gray-400">JOIN THE</span>
              <br />
              <span className="text-white">COMMUNITY</span>
            </h2>
            <a
              href="https://t.me/PedroCTOPortal"
              target="_blank"
              className="bg-[#242424] hover:bg-[#2f2f2f] text-white px-8 py-3 rounded uppercase tracking-wide text-sm"
            >
              Telegram
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="bg-black py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col items-center space-y-6">
            {/* Logos */}
            <div className="flex items-center space-x-8">
              <img src="/images/ticker_logo.png" alt="Pedro" className="h-6" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
