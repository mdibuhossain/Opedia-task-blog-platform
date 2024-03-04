"use client";

import { AuthContext } from "@/app/context/authProvider";
import React, { useContext } from "react";
import Link from "next/link";
import { Socket, io } from "socket.io-client";

const soc = io("http://localhost:5000/");

const Comments = ({ postId }) => {
  const { user } = useContext(AuthContext);
  const [cmnts, setCmnts] = React.useState([]);

  const fetchComments = async () => {
    const data = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER}/comments/${postId}`,
      {
        cache: "no-store",
        method: "GET",
      }
    );
    if (data.ok) {
      setCmnts((await data.json())?.comments);
    }
  };

  React.useEffect(() => {
    fetchComments();
  }, [user]);

  console.log("comments:", cmnts);
  console.log("User:", user);

  React.useEffect(() => {
    soc.on("receive_comment", (receiveComment) => {
      if (receiveComment) setCmnts([...cmnts, receiveComment]);
    });
  }, [cmnts]);

  const handlePostComment = async (e) => {
    e.preventDefault();
    const commentContent = e.target["comment"].value;
    if (commentContent.length <= 0) return;
    const data = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/comment`, {
      cache: "no-store",
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ content: commentContent, postId }),
    });
    if (data.ok) {
      const newComment = await data.json();
      soc.emit("post_comment", JSON.stringify(newComment.comment));
      setCmnts([...cmnts, newComment.comment]);
      e.target.reset();
    } else {
      alert("Something went wrong!");
    }
  };

  const handleDeleteComment = async (id) => {
    const queryParams = new URLSearchParams({ postId });
    const data = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER}/comment/${id}?${queryParams}`,
      {
        cache: "no-store",
        method: "DELETE",
        credentials: "include",
      }
    );
    console.log(data);
    if (data.ok) {
      const filteredComment = cmnts?.filter((cmnt) => cmnt?.id !== id);
      setCmnts(filteredComment);
    }
  };

  return (
    <div className="bg-gray-100 px-3 py-3 rounded-lg mb-8">
      <h3 className="p-0 m-0">Comments</h3>
      {cmnts?.map((cmnt) => (
        <div key={cmnt?.id}>
          <div className="rounded-lg p-2 flex items-start gap-2">
            <div className="relative w-10 h-10 overflow-hidden bg-gray-400 rounded-full">
              <svg
                className="absolute w-12 h-12 text-gray-50 -left-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <div className="flex-1 flex flex-col rounded-md p-2 m-0 bg-gray-200">
              <div className="flex flex-wrap justify-between items-center">
                <p className="text-xs">
                  <em>{cmnt?.author?.name}</em>
                </p>
                <p className="text-xs">
                  {new Date(cmnt?.createdAt)?.toLocaleString()}
                </p>
              </div>
              <p>{cmnt?.content}</p>
            </div>
            {user?.email === cmnt?.author?.email ? (
              <button
                onClick={() => handleDeleteComment(cmnt?.id)}
                class="flex items-center align-middle justify-center bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-full w-7 h-7"
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
            ) : null}
          </div>
        </div>
      ))}
      <form
        onSubmit={handlePostComment}
        className="flex items-center overflow-hidden mt-6"
      >
        <input
          id="comment-id"
          name="comment"
          type="text"
          disabled={!!!user?.email}
          className="appearance-none relative block flex-1 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-s-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          placeholder="Your comments"
        />
        <button
          type="submit"
          className="w-[70px] justify-center py-2 px-2 border border-transparent text-sm font-medium rounded-e-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Commit
        </button>
      </form>
      {!!!user?.email && (
        <p className="text-sm text-gray-500">
          To comment, you need to{" "}
          <Link href="/login" className="text-blue-800 underline">
            login
          </Link>
        </p>
      )}
    </div>
  );
};

export default Comments;
