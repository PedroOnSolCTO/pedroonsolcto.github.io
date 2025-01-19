import React from "react";

const ProCircuit = () => {
  return (
    <div className="relative bg-black py-24">
      {/* Background Images */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-0 top-0 w-full h-64 opacity-50">
          <img
            src="/images/background_image.jpg"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute right-0 top-0 w-64 h-64 opacity-50">
          <img
            src="/images/crowd-right.jpg"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
        {/* TI Logo */}
        <div className="mb-16">
          <img
            src="/images/phone.gif"
            alt="The International"
            className="h-24 mx-auto"
          />
        </div>

        {/* Pro Circuit Logo and Text */}
        <div className="space-y-8">
          <div className="flex flex-col items-center space-y-4">
            <img
              src="/images/bananas.jpg"
              alt="Pro Circuit Logo"
              className="h-16"
            />
            <h2 className="text-5xl font-bold tracking-wide text-white">
              THE Pedro CIRCUIT
            </h2>
          </div>
          <p className="max-w-4xl mx-auto text-gray-300 text-lg leading-relaxed">
            When not climbing the ranks, you'll be able to learn from the best.
            The Pedro Circuit features ultra-high-level Pedro competition
            streaming regularly in the game client, on Twitch and Steam.TV.
            Culminating in the largest e-sports championship in the world, The
            International, professional Pedro is an event not to be missed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProCircuit;
