import React from "react";
import Link from "next/link";
import Image from "next/image";

const UserBlog = ({ post, setUserPosts }) => {
  const handleDeleteUserPost = async (id) => {
    if (window.confirm("Are you sure want to delete this post?")) {
      const data = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER}/dashboard/post/${post?.id}/user/${post?.authorId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (data?.ok) {
        setUserPosts((revPost) => {
          const filteredPost = revPost?.filter((p) => p?.id !== id);
          return filteredPost;
        });
      } else {
        alert("Something went wrong!");
      }
    }
  };

  return (
    <div className="flex justify-center">
      <div className="flex flex-col justify-between rounded-lg shadow-md hover:shadow-lg duration-100 bg-white w-full">
        <Link href={`/blog/${post?.id}`}>
          <div className="overflow-hidden">
            <Image
              className="rounded-t-lg w-full h-[150px]"
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
            <h3 className="text-gray-900 text-base font-semibold mb-2 w-full">
              {post?.title?.slice(0, 60)}
              {post?.title?.length > 60 && "..."}
            </h3>
          </div>
          <div className="flex justify-between items-center">
            <Link href={`/dashboard/blog/edit/${post?.id}`}>
              <button
                type="button"
                className="inline-block px-6 py-2.5 bg-green-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out"
              >
                Edit
              </button>
            </Link>
            <button
              onClick={() => handleDeleteUserPost(post?.id)}
              class="flex justify-center items-center bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-full w-7 h-7"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserBlog;
