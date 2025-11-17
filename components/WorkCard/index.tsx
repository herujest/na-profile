import React from "react";
import Image from "next/image";

interface WorkCardProps {
  imgs?: Array<{ imageSrc: string | string[] }>;
  name?: string;
  description?: string;
  onClick?: () => void;
}

const WorkCard: React.FC<WorkCardProps> = ({ imgs, name, description, onClick }) => {
  if (!imgs?.length) return null;

  const imageSrc = Array.isArray(imgs[0]?.imageSrc)
    ? imgs[0].imageSrc[0]
    : imgs[0]?.imageSrc;

  const finalImageSrc = imageSrc?.startsWith("/")
    ? imageSrc
    : `/images/${imageSrc}`;

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
        {imageSrc && (
          <Image
            alt={name || "Work"}
            className="h-full w-full object-cover hover:scale-110 transition-all ease-out duration-300"
            src={finalImageSrc}
            layout="fill"
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
        )}
      </div>
    </div>
  );
};

export default WorkCard;

