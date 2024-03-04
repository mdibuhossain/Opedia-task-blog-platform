"use client";

import { AuthContext } from "@/app/context/authProvider";
import React, { useContext } from "react";
import UserBlog from "./blog";

const DashboardNav = () => {
  const { user } = useContext(AuthContext);
  console.log(user);
  const [userPosts, setUserPosts] = React.useState([]);
  React.useEffect(() => {
    const fetchUserPosts = async () => {
      const data = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER}/dashboard/posts/user/${user?.id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (data?.ok) {
        setUserPosts((await data.json())?.posts);
      }
    };
    if (user?.id) fetchUserPosts();
  }, [user]);
  return (
    <div className="mt-5">
      <div>
        <div className="grid grid-cols-4">
          <div className="flex flex-col">
            <label className="mb-2">Name: </label>
            <label>Email: </label>
          </div>
          <div className="flex flex-col col-span-3">
            <input
              disabled
              type="text"
              className="rounded-md px-2 mb-2"
              defaultValue={user?.email}
            />
            <input
              disabled
              type="text"
              className="rounded-md px-2"
              defaultValue={user?.name}
            />
          </div>
        </div>
      </div>
      <h3 className="mt-5 bg-zinc-100 px-3 py-1 rounded-md">
        Manage your Posts
      </h3>
      <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-1 gap-y-3 md:gap-5 mx-auto my">
        {userPosts?.map((post) => (
          <UserBlog key={post?.id} post={post} setUserPosts={setUserPosts} />
        ))}
      </div>
    </div>
  );
};

export default DashboardNav;
