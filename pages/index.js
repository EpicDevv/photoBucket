import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { AiFillFolderOpen } from "@react-icons/all-files/ai/AiFillFolderOpen";

export default function Home() {
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState([]);
  const [names, setNames] = useState([]);
  const [allimgs, setAllimgs] = useState([]);
  const [urls, setUrls] = useState([]);
  const [render, setRender] = useState(false);
  const [rerender, setRerender] = useState(false);
  const [message, setMessage] = useState();
  const [loading, setLoading] = useState(false);
  const [loadingg, setLoadingg] = useState(false);
  const [loader, setLoader] = useState([]);

  useEffect(() => {
    loader.unshift("getting image paths from DB...");
    const fetch = async () => {
      setLoadingg(true);
      setLoading(true)
      const { data, error } = await supabase.storage
        .from("avatars")
        .list("", { sortBy: { column: "created_at", order: "desc" } });

      setAllimgs(data);

      loader.unshift("image paths retrieved");
    };

    fetch();
  }, [render]);

  useEffect(() => {
    loader.unshift("Downloading images...");
    const fetch = async () => {
      let urldata = [];
      let y = allimgs.length - 1;
      for (let i = 1; i < allimgs.length; i++) {
        setMessage("Loading image " + i + " of " + y + "...");
        const { data, error } = await supabase.storage
          .from("avatars")
          .download(allimgs[i].name);

        const url = URL.createObjectURL(data);

        urldata.push(url);
        setUrls(urldata);
      }
      setRerender(!rerender);
      setLoadingg(false);
      setLoading(false);

      setMessage("");
      loader.unshift("Images loaded");
      setLoader([])

      // setLoader([])
    };
    fetch();
  }, [allimgs]);

  const imgtoupload = (event) => {
    let names = [];
    setUploaded(event.target.files);

    for (let i = 0; i < event.target.files.length; i++) {
      names.push(event.target.files[i].name);
    }
    setNames(names);
  };

  const upload = async () => {
    loader.unshift("Uploading images to database...");
    setLoading(true);
    try {
      setUploading(true);
      for (let i = 0; i < uploaded.length; i++) {
        const file = uploaded[i];
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        let { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, file);

        setMessage(
          "Uploading image " + (i + 1) + " of " + uploaded.length + "..."
        );
      }
      loader.unshift(
        "Uploading image " + uploaded.length + " of " + uploaded.length + "..."
      );
      loader.unshift("Uploaded " + uploaded.length + " images to database");
      setMessage("");
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
      setUploaded([]);
      setNames([]);
      setRender(!render);
      setLoading(false)

    }
  };

  return (
    <div>
      <div className="bg-black min-h-screen bg-opacity-90">
        <div className="bg-black border-b rounded-b-lg border-gray-600 flex flex-col w-full">
          <h1 className="text-white text-3xl mb-3 font-thin text-center mt-2">
            Upload Images{" "}
          </h1>
          <div className="flex items-center">
            <label
              className={`text-white flex items-center ${
                uploading ? "bg-green-400 animate-pulse text-black" : ""
              } border ml-5 cursor-pointer  hover:bg-gray-800 border-white text-center px-4 text-[20px] justify-center rounded-lg py-1`}
              htmlFor="single"
            >
              {uploading ? "Uploading ..." : "Browse" } {!uploading && (<AiFillFolderOpen className="ml-2 text-green-400" />)}
            </label>
            <input
              className="hidden"
              type="file"
              id="single"
              accept="image/*"
              onChange={imgtoupload}
              disabled={uploading}
              multiple
            />
            {uploaded?.length > 0 && (
              <h1 className="text-white ml-4 text-[20px]">
                {uploaded?.length} {uploaded?.length < 2 ? "Image" : "Images"}{" "}
                Selected{" "}
              </h1>
            )}
          </div>
          <div className="text-white flex flex-wrap ml-5 mb-5 mt-2">
            {names?.map((file, index) => (
              <div key={index}>
                <h1 className="text-gray-600 mr-4 text-[20px]">{file}</h1>
              </div>
            ))}
          </div>
          {uploaded?.length > 0 && (
            <div className="flex justify-center mb-5">
              <button
                onClick={() => {
                  setUploaded([]);
                  setNames([]);
                }}
                className="text-white mr-2 text-[15px] border rounded-lg px-4 py-1 hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={upload}
                className="text-white text-[15px] border rounded-lg px-4 py-1 hover:bg-gray-800"
              >
                Upload
              </button>
            </div>
          )}

          {loading && (

          <div className="flex flex-col-reverse text-white ml-5 mb-2 overflow-y-scroll h-[80px]">
            <h1 className="text-white text-[12px] font-thin">{message}</h1>
            {loader.map((msg, index) => (
              <div key={index}>
                <h1 className="text-white text-[12px] font-thin ">{msg}</h1>
              </div>
            ))}
          </div>
          )} 
        </div>
        <div className="">
          <h1 className="text-white text-center font-thin text-[20px]">
            All Images
          </h1>
          {loadingg && (
            <h1 className="animate-pulse text-center text-green-400">
              Loading All Images...
            </h1>
          )}
        </div>
        <div className="flex justify-center flex-wrap">
          {urls.map((url, index) => {
            return (
              <div
                className="relative w-[360px] m-1 border-gray-700  border-[1px] h-[300px] rounded-lg"
                key={index}
              >
                <Image src={url} layout="fill" alt="pics" objectFit="contain" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}