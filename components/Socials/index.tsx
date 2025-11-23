"use client";

import Button from "@/components/Button";
import type { Social } from "@/types/portfolio";
import React, { useState, useEffect } from "react";

interface SocialsProps {
  className?: string;
}

const Socials: React.FC<SocialsProps> = ({ className }) => {
  const [socials, setSocials] = useState<Social[]>([]);

  useEffect(() => {
    const fetchSocials = async () => {
      try {
        const res = await fetch("/api/socials");
        if (res.ok) {
          const data = await res.json();
          setSocials(data.socials || []);
        }
      } catch (error) {
        console.error("Error fetching socials:", error);
        // Fallback to empty array
        setSocials([]);
      }
    };

    fetchSocials();
  }, []);

  // Return null if no socials to avoid rendering empty div
  if (!socials || socials.length === 0) {
    return null;
  }

  return (
    <div className={`${className || ""} flex flex-wrap mob:flex-nowrap link`}>
      {socials
        .filter((social: Social) => social && social.link && social.title)
        .map((social: Social) => (
          <Button
            key={social.id}
            onClick={() =>
              window.open(social.link, "_blank", "noopener,noreferrer")
            }
          >
            {social.title}
          </Button>
        ))}
    </div>
  );
};

export default Socials;
