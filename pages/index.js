import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { AiFillFolderOpen } from "@react-icons/all-files/ai/AiFillFolderOpen";
import Img from "../components/img";

export default function Home() {
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState([]);
  const [names, setNames] = useState([]);
  const [newimg, setNewimg] = useState([]);
  const [urls, setUrls] = useState([]);

  const [message1, setMessage1] = useState();
  const [message, setMessage] = useState();
  const [loading, setLoading] = useState(false);
  const [loadingg, setLoadingg] = useState(false);
  const [loader, setLoader] = useState([]);
  const [selected, setSelected] = useState([]);
  const [show, setShow] = useState(false);

  const getdetails = async () => {
    let urldata = [];
    let namdata = [];

    setLoading(true);
    setLoadingg(true);
    setNewimg([]);
    loader.unshift("getting image paths from DB...");
    const { data, error } = await supabase.storage.from("avatars").list("", {
      limit: 1000,
      sortBy: { column: "created_at", order: "desc" },
    });
    namdata.push(data);

    loader.unshift("image paths retrieved");

    loader.unshift("Downloading images...");
    let y = namdata[0].length - 1;
    for (let i = 1; i < namdata[0].length; i++) {
      setMessage("Downloading image " + i + " of " + y + "...");
      const { data, error } = await supabase.storage
        .from("avatars")
        .download(namdata[0][i].name);

      const url = URL.createObjectURL(data);

      let xx = {
        name: namdata[0][i].name,
        url: url,
      };

      urldata.push(xx);

      setUrls(urldata);
    }

    loader.unshift("Downloading image " + y + " of " + y + "...");
    loader.unshift("Images loaded");
    setLoading(false);
    setLoadingg(false);
    setLoader([]);
    setMessage("");
  };

  useEffect(() => {
    getdetails();
  }, []);

  const imgtoupload = (event) => {
    setShow(false)
    setSelected([]);
    let names = [];
    setUploaded(event.target.files);

    for (let i = 0; i < event.target.files.length; i++) {
      names.push(event.target.files[i].name);
    }
    setNames(names);
  };

  const upload = async () => {
    setShow(false)
    setSelected([]);
    loader.unshift("Uploading images to database...");
    setNames([]);
    setLoading(true);
    let namdata = [];
    let urldata = [];
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

        setMessage1(
          "Uploading image " + (i + 1) + " of " + uploaded.length + "..."
        );
      }
      loader.unshift(
        "Uploading image " + uploaded.length + " of " + uploaded.length + "..."
      );
      loader.unshift("Uploaded " + uploaded.length + " images to database");
      setMessage1("");

      loader.unshift("Downloading uploaded images from the Db...");
      // test
      let y = uploaded.length + 1;
      const { data, error } = await supabase.storage.from("avatars").list("", {
        limit: y,
        sortBy: { column: "created_at", order: "desc" },
      });
      // console.log(data);
      namdata.push(data);
      // console.log(namdata);
      loader.unshift("images downloaded successfully");
      let x = namdata[0].length - 1;
      for (let i = 1; i < namdata[0].length; i++) {
        const { data, error } = await supabase.storage
          .from("avatars")
          .download(namdata[0][i].name);
        setMessage1("loading image " + i + " of " + x + "...");

        const url = URL.createObjectURL(data);

        let xx = {
          name: namdata[0][i].name,
          url: url,
        };

        urldata.push(xx);
      }
      // let xx = {
      //   name: namdata[0][i].name,
      //   url: url,
      // };

      // urldata.push(xx);

      // setUrls(urldata);

      // urls.push.apply(urls, urldata);
      newimg.unshift.apply(newimg, urldata);
      // test
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
      if (message === "") {
        setLoading(false);
        setLoader([]);
      }
      setUploaded([]);
      setMessage1("");
      setLoadingg(false);

      // setLoading(false);
    }
  };

  const imgtodel = async (url) => {
    if (selected.includes(url.name) === false) {
      selected.push(url.name);
    } else {
      if (selected.includes(url.name) === true) {
        selected.splice(selected.indexOf(url.name), 1);
      }
    }

    if (selected.length > 0) {
      setShow(true);
    } else {
      setShow(false);
    }
  };

  return (
    <div>
      {show === true && (
        <div
          onClick={async () => {
            console.log(urls)
            console.log(selected)
            const picstodelete = new Set(selected);
            const picstodeletee = new Set(selected)
            const newarrr = newimg.filter((url) => {
              return !picstodeletee.has(url.name)
            })
            const newarr = urls.filter((url) => {
              return !picstodelete.has(url.name);

            })

            setUrls(newarr)
            setNewimg(newarrr)
            const { data, error } = await supabase.storage
              .from("avatars")
              .remove(selected);
              setShow(false);
          }}
          className="h-[30px] flex justify-center cursor-pointer hover:bg-red-400 items-center w-[100px] rounded-lg z-50 fixed bg-red-500 bottom-2 right-2"
        >
          <h1 className="font-light text-black">Delete</h1>
        </div>
      )}

      <div className="bg-black min-h-screen bg-opacity-90">
        <div className="bg-black border-b rounded-b-lg border-gray-700 flex flex-col w-full">
          <h1 className="text-white text-3xl mb-3 font-thin text-center mt-2">
            Upload Images{" "}
          </h1>
          <div className="flex items-center">
            <label
              className={` flex items-center ${
                uploading ? "bg-green-400 animate-pulse text-black" : "text-white"
              } border ml-5 cursor-pointer font-thin  hover:bg-gray-800 border-gray-700 text-center px-4 text-[20px] justify-center rounded-lg py-1`}
              htmlFor="single"
            >
              {uploading ? "Uploading ..." : "Browse"}{" "}
              {!uploading && (
                <AiFillFolderOpen className="ml-2 text-green-400" />
              )}
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
          {names?.length > 0 && (
            <div className="flex justify-center mb-5">
              <button
                onClick={() => {
                  setUploaded([]);
                  setNames([]);
                }}
                className="text-white mr-2 text-[15px] border border-gray-700 rounded-lg px-4 py-1 hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={upload}
                className="text-white text-[15px] border border-gray-700 rounded-lg px-4 py-1 hover:bg-green-400 hover:text-black"
              >
                Upload
              </button>
            </div>
          )}

          {loading && (
            <div className="flex flex-col-reverse text-white ml-5 mb-2 overflow-y-scroll h-[80px]">
              <h1 className="text-white text-[12px] font-thin">{message1}</h1>
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
          {newimg.map((url, index) => {
            return (
              <div
                onClick={() => {
                  imgtodel(url);
                }}
                key={index}
              >
                <Img show={show} url={url} />
              </div>
            );
          })}
          {urls.map((url, index) => {
            return (
              <div
                onClick={() => {
                  imgtodel(url);
                }}
                key={index}
              >
                <Img show={show} url={url} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
