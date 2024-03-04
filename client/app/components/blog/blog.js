import React from "react";
import Link from "next/link";
import Image from "next/image";

const Blog = ({ post }) => {
  // const post = {
  //   bannerImg:
  //     "https://napieroutdoors.com/us/wp-content/uploads/sites/3/2021/11/David-Leiter-2021-8.jpg",
  //   title: "30,000 Miles: Our US Travels in a Napier Truck Tent",
  //   date: ["13", "November", "2021"],
  //   summary:
  //     "For decades, Napier Outdoors has been pioneering the idea of vehicle tents. Their tents are directly attached to your vehicle for extra comfort and",
  // };
  return (
    <div className="flex justify-center">
      <div className="flex flex-col justify-between rounded-lg shadow-md hover:shadow-lg duration-100 bg-white max-w-sm w-full">
        <Link href={`/blog/${post?.id}`}>
          <div className="max-h-[250px] overflow-hidden">
            <Image
              className="rounded-t-lg w-full"
              width={300}
              height={300}
              src={post?.bannerImg}
              alt="blog banner"
            />
          </div>
        </Link>
        <div className="p-6 w-full flex-1 flex flex-col justify-between">
          <div>
            <p className="text-gray-500 font-bold w-auto">
              {post?.author?.name}
            </p>
            <p className="text-gray-400 text-xs w-auto">
              {new Date(post?.createdAt).toLocaleString()}
            </p>
            <h3 className="text-gray-900 text-xl font-semibold mb-2 w-full">
              {post?.title?.slice(0, 60)}
              {post?.title?.length > 60 && "..."}
            </h3>
          </div>
          <Link href={`/blog/${post?.id}`}>
            <button
              type="button"
              className=" inline-block mt-4 px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
            >
              Read
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Blog;
