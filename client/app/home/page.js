import React from "react";
import Blogs from "../components/blogs/blogs";

const HomePage = ({ searchParams }) => {
  return (
    <div className="mt-8">
      <h1 className="lg:text-7xl md:text-5xl sm:text-4xl text-4xl font-light">
        <span className="font-bold">Hey there,</span> share your creative ideas
        here.
      </h1>
      <Blogs searchParams={searchParams} />
    </div>
  );
};

export default HomePage;
