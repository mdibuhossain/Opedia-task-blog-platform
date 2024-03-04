import getSinglePost from "@/lib/getSignlePost";
import React from "react";
import Image from "next/image";
import Comments from "@/app/components/blog/comment";

const SingleBlog = async ({ params }) => {
  const { id } = params;
  const post = await getSinglePost(id);
  const comments = post.comments;
  const createdAt = new Date(post.createdAt).toDateString().split(" ");
  return (
    <div>
      <div className="">
        <h1 className="mb-5 font-bold text-4xl">{post.title}</h1>
        <div>
          <Image
            width={400}
            height={400}
            className="rounded-xl"
            src={post.bannerImg}
            alt=""
          />
        </div>
        <div
          className="flex flex-col justify-center items-center bg-green-700 opacity-80 rounded-full md:w-40 md:h-40 w-28 h-28 text-white text font-medium"
          style={{ marginTop: "-50px", marginLeft: "10px" }}
        >
          <p className="md:text-5xl text-2xl">{createdAt[2]}</p>
          <p className="md:text-lg">{createdAt[1]}</p>
          <hr className="border-gray-50 w-4/6 mt-2" />
          <p className="md:text-2xl text-xl">{createdAt[3]}</p>
        </div>
        <div
          className="p-5"
          dangerouslySetInnerHTML={{
            __html: post.content,
          }}
        />
      </div>
      <Comments comments={comments} postId={post.id} />
    </div>
  );
};

export default SingleBlog;
