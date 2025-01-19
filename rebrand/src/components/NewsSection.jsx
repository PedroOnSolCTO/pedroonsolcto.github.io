import React from "react";

const NewsCard = ({ title, date, image }) => (
  <div className="group cursor-pointer">
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
      <img
        src={image}
        alt={title}
        className="w-full h-[240px] object-cover transform group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
        <span className="text-gray-400 text-sm uppercase tracking-wider">
          {date}
        </span>
        <h3 className="text-2xl font-semibold mt-2 group-hover:text-pedro-red transition-colors">
          {title}
        </h3>
      </div>
    </div>
  </div>
);

const NewsSection = () => {
  const news = [
    {
      title: "Pedro's Fashion Show",
      date: "January 15, 2025",
      image: "/news/fashion.jpg",
    },
    {
      title: "Pedro Wins Big Game",
      date: "December 18, 2024",
      image: "/news/poker.jpg",
    },
    {
      title: "Pedro's Yacht Trip",
      date: "December 5, 2024",
      image: "/news/yacht.jpg",
    },
  ];

  return (
    <div
      className="bg-gradient-to-b from-transparent via-black/80 to-black"
      id="news"
    >
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center space-x-4 mb-4">
          <h2 className="text-gray-300 text-sm uppercase tracking-wider">
            Latest News
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.map((item, index) => (
            <NewsCard key={index} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsSection;
