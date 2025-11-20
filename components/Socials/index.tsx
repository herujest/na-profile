"use client";

import Button from "@/components/Button";
import type { Social } from "@/types/portfolio";
import React, { useState } from "react";

interface SocialsProps {
  className?: string;
}

// TODO: handle route for affiliated products and blog
const Socials: React.FC<SocialsProps> = ({ className }) => {
  const [socials, setSocials] = useState<Social[]>([
    {
      id: "1",
      title: "Instagram",
      link: "https://instagram.com/nisa_wly",
    },
    {
      id: "2",
      title: "TikTok",
      link: "https://tiktok.com/@racunnyacacaa",
    },
    {
      id: "3",
      title: "Affiliated Products",
      link: "",
    },
    {
      id: "4",
      title: "Blog",
      link: "",
    },
    {
      id: "5",
      title: "Email",
      link: "mailto:contact@nisaaulia.com",
    },
  ]);

  // useEffect(() => {
  // Fetch socials from API with admin=true to get full portfolio data
  // const fetchSocials = async () => {
  //   try {
  //     const res = await fetch("/api/portfolio?admin=true");
  //     if (res.ok) {
  //       const data = await res.json();
  //       // Handle different response structures
  //       if (data.socials && Array.isArray(data.socials)) {
  //         setSocials(data.socials);
  //       } else if (
  //         Array.isArray(data) &&
  //         data.length > 0 &&
  //         data[0]?.socials
  //       ) {
  //         setSocials(data[0].socials);
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error fetching socials:", error);
  //     // Fallback to empty array
  //     setSocials([]);
  //   }
  // };

  // fetchSocials();
  // }, []);

  // Return null if no socials to avoid rendering empty div
  if (!socials || socials.length === 0) {
    return null;
  }

  return (
    <div className={`${className || ""} flex flex-wrap mob:flex-nowrap link`}>
      {socials.map((social: Social, index: number) => {
        // Validate social has required properties
        if (!social || !social.link || !social.title) {
          return null;
        }
        return (
          <Button
            key={social.id || `social-${index}`}
            onClick={() =>
              window.open(social.link, "_blank", "noopener,noreferrer")
            }
          >
            {social.title}
          </Button>
        );
      })}
    </div>
  );
};

export default Socials;
