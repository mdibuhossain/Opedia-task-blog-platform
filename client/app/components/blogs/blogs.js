import React from "react";
import Link from "next/link";
import Blog from "../blog/blog";
import getAllPosts from "@/lib/getAllPosts";

const Blogs = async ({ searchParams }) => {
  console.log(searchParams);
  const page = searchParams?.page ? Number(searchParams?.page) : 1;
  const limit = searchParams?.limit ? Number(searchParams?.limit) : 3;
  console.log(page);
  console.log(limit);
  const { posts, totalPages } = await getAllPosts({ page, limit });
  return (
    <>
      <div className="grid xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1 gap-y-3 md:gap-5 mx-auto my-12">
        {posts.map((post) => (
          <Blog key={post.id} post={post} />
        ))}
      </div>
      <div className="flex justify-center gap-2 mb-8">
        <Link href={`/?page=${page > 1 ? page - 1 : 1}`}>
          <div
            className={`bg-zinc-200 ${
              page === 1 ? "text-zinc-400" : "text-gray-800"
            } p-1 px-2 rounded-lg cursor-pointer`}
          >
            Previous
          </div>
        </Link>
        <Link href={`/?page=${totalPages === page ? page : page + 1}`}>
          <div
            className={`bg-zinc-200  p-1 px-2 ${
              page === totalPages ? "text-zinc-400" : "text-gray-800"
            } rounded-lg cursor-pointer`}
          >
            Next
          </div>
        </Link>
      </div>
    </>
  );
};

export default Blogs;
