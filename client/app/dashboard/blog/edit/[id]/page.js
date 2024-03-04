"use client";

import React, { useContext } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import "suneditor/dist/css/suneditor.min.css";
import { AuthContext } from "@/app/context/authProvider";
const Editor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

const EditUserPost = ({ params }) => {
  const { id: postId } = params;
  const { user } = useContext(AuthContext);
  const [userPost, setUserPost] = React.useState({});
  const [selectedBannerImg, setSelectedBannerImg] = React.useState(undefined);
  const [contentImgLoading, setContentImgLoading] = React.useState(false);
  const [postLoading, setPostLoading] = React.useState(false);
  const editor = React.useRef();
  const getSunEditorInstance = (sunEditor) => {
    editor.current = sunEditor;
  };

  React.useEffect(() => {
    const fetchUserPost = async () => {
      const result = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER}/post/${postId}`,
        {
          method: "GET",
        }
      );
      if (result.ok) {
        setUserPost(await result.json());
      }
    };
    fetchUserPost();
  }, []);

  const handleBannerImgPreview = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedBannerImg(e.target.files[0]);
      setUserPost({
        ...userPost,
        bannerImg: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  function onImageOrVideoUploadBefore() {
    return (files, _info, uploadHandler) => {
      (async () => {
        setContentImgLoading(true);
        const formData = new FormData();
        formData.append("image", files[0]);
        try {
          const data = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER}/upload/single`,
            {
              method: "POST",
              body: formData,
              credentials: "include",
            }
          );
          const imgURL = await data.json();
          const res = {
            result: [
              {
                url: imgURL?.url,
                name: "thumbnail",
              },
            ],
          };
          uploadHandler(res);
        } catch (error) {
          console.log("Image upload before error:", error.message);
        } finally {
          setContentImgLoading(false);
        }
      })();
      // called here for stop double image
      uploadHandler();
    };
  }

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setPostLoading(true);
    const payload = {
      title: e.target["title"].value,
      content: e.target["content"].value,
      bannerImg: userPost?.bannerImg,
    };
    const formData = new FormData();
    if (selectedBannerImg) formData.append("image", selectedBannerImg);
    for (const [key, value] of Object.entries(payload)) {
      formData.append(key, value);
    }
    try {
      const data = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER}/dashboard/post/edit/${userPost?.id}/user/${user?.id}`,
        {
          method: "PUT",
          body: formData,
          credentials: "include",
        }
      );
      if (data.ok) {
        alert("Edited Successfully");
      } else {
        alert((await data.json()).message);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setPostLoading(false);
    }
  };

  return (
    <div className="mt-5">
      <h3>Edit post</h3>
      <label htmlFor="thbmnail">Choose blog Thumbnail:</label>
      <br />
      <input
        onChange={handleBannerImgPreview}
        type="file"
        name="bannerImg"
        id="thbmnail"
        className="mb-3"
      />
      <Image
        width={300}
        height={100}
        src={userPost?.bannerImg}
        alt="thumbnail"
      />
      {contentImgLoading && (
        <div className="animate-spin rounded-full h-5 w-5 my-2 border-b-2 border-indigo-600"></div>
      )}
      <form onSubmit={handleCreatePost} className="mt-5">
        <input
          name="title"
          type="text"
          className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          placeholder="Title"
          defaultValue={userPost?.title}
        />
        <Editor
          name="content"
          //   onChange={setEditorContent}
          getSunEditorInstance={getSunEditorInstance}
          onImageUploadBefore={onImageOrVideoUploadBefore()}
          onVideoUploadBefore={onImageOrVideoUploadBefore()}
          defaultValue={userPost?.content}
          placeholder="Write your story"
          setOptions={{
            videoAccept: true,
            videoFileInput: true,
            videoResizing: true,
            videoUrlInput: false,
            buttonList: [
              [
                "fontSize",
                "bold",
                "italic",
                "underline",
                "strike",
                "blockquote",
                "link",
                "image",
                "video",
                "align",
              ],
            ],
          }}
          height="80vh"
        />
        <button
          type="submit"
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-b-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {postLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            "Post"
          )}
        </button>
      </form>
    </div>
  );
};

export default EditUserPost;
