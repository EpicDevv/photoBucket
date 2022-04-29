import Image from "next/image";
import React, { useEffect, useState } from "react";

function Img({url, show, child }) {
  const [sel, setSel] = useState(false);

useEffect(() => {
    setSel(false)
}, [child]);

  return (
    <div
      onClick={() => {
        setSel(!sel);
      }}
      className="relative w-[360px] cursor-pointer m-1 border-gray-700  border-[1px] h-[300px] rounded-lg"
    >
      {show === true && (
        <div
          className={`h-[20px] ${
            sel ? "bg-green-400 bg-opacity-100" : "bg-gray-700 bg-opacity-40"
          } absolute w-[20px] top-2 left-2 border rounded-full z-50`}
        ></div>
      )}

      <Image src={url.url} layout="fill" alt="pics" objectFit="contain" />
    </div>
  );
}

export default Img;
