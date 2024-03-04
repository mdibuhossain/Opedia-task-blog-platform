"use client";

import React from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import "suneditor/dist/css/suneditor.min.css";
const Editor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

const WriteBlog = () => {
  const editor = React.useRef();
  const [editorContent, setEditorContent] = React.useState("");
  const [selectedBannerImg, setSelectedBannerImg] = React.useState(undefined);
  const [contentImgLoading, setContentImgLoading] = React.useState(false);
  const [postLoading, setPostLoading] = React.useState(false);

  const getSunEditorInstance = (sunEditor) => {
    editor.current = sunEditor;
  };

  const handleBannerImgPreview = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedBannerImg(URL.createObjectURL(e.target.files[0]));
    }
  };

  function onImageUploadBefore() {
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
          console.log(error.message);
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
      bannerImg: "empty",
    };
    // const jsonBlob = new Blob([JSON.stringify(payload)], {
    //   type: "application/json",
    // });
    const formData = new FormData();
    formData.append("image", e.target["bannerImg"].files[0]);
    formData.append("title", payload.title);
    formData.append("content", payload.content);
    formData.append("bannerImg", payload.bannerImg);
    try {
      const data = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/post`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (data.ok) {
        alert("Post Successfully");
      } else {
        alert(await data.json.message);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setPostLoading(false);
    }
  };

  return (
    <>
      <div className="pt-8">
        <form onSubmit={handleCreatePost}>
          <label htmlFor="thbmnail">Blog Thumbnail:</label>
          <br />
          <input
            required
            type="file"
            name="bannerImg"
            id="thbmnail"
            className="mb-3"
            onChange={handleBannerImgPreview}
          />
          {selectedBannerImg && (
            <Image
              width={300}
              height={100}
              src={selectedBannerImg}
              alt="thumbnail"
            />
          )}
          {contentImgLoading && (
            <div className="animate-spin rounded-full h-5 w-5 my-2 border-b-2 border-indigo-600"></div>
          )}
          <input
            required
            name="title"
            type="text"
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Title"
          />
          <Editor
            name="content"
            onChange={setEditorContent}
            getSunEditorInstance={getSunEditorInstance}
            onImageUploadBefore={onImageUploadBefore()}
            onVideoUploadBefore={onImageUploadBefore()}
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
            height="60vh"
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
    </>
  );
};

export default WriteBlog;
