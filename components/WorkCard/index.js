import React, { useEffect } from "react";
import Image from "next/image";

const WorkCard = ({ imgs, name, description, onClick }) => {
  if (!imgs?.length) return null;

  return (
    <div
      className="overflow-hidden rounded-lg p-2 laptop:p-4 first:ml-0 link"
      onClick={onClick}
    >
      <div
        className="relative rounded-lg overflow-hidden transition-all ease-out duration-300"
        style={{ height: "400px" }}
      >
        <span
          color="black"
          className="heading"
          style={{
            position: "absolute",
            zIndex: 2,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "rgba(0,0,0,0.5)",
            color: "#fff",
            padding: "8px 16px",
            borderRadius: "8px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            width: "90%",
            maxWidth: "100%",
          }}
        >
          {name}
        </span>
        <Image
          alt={name}
          className="h-full w-full object-cover hover:scale-110 transition-all ease-out duration-300"
          src={
            imgs[0]?.imageSrc[0]?.startsWith("/")
              ? imgs[0]?.imageSrc
              : `/images/${imgs[0]?.imageSrc[0]}`
          }
          layout="fill"
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />
      </div>
    </div>
  );
};

export default WorkCard;
