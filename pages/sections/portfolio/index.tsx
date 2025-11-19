import { useEffect, useState, RefObject } from "react";
import WorkCard from "../../../components/WorkCard";

interface MediaItem {
  imageSrc: string | string[];
}

interface Collaboration {
  id: string;
  title: string;
  description: string;
  media?: MediaItem[];
  imageSrc?: string;
  url?: string;
}

interface PortfolioProps {
  workRef?: RefObject<HTMLDivElement>;
  collabs?: Collaboration[];
}

export default function Portfolio({ workRef, collabs }: PortfolioProps) {
  const [popupProject, setPopupProject] = useState<Collaboration | null>(null);

  const ProjectWrapper = () => {
    if (!collabs?.length) return null;

    return (
      <div className="mt-5 laptop:mt-10 grid grid-cols-2 tablet:grid-cols-2 gap-4">
        {collabs.map((project, index) => {
          // Ensure unique key by combining id with index to handle duplicates
          const uniqueKey = `${project.id || 'collab'}-${index}`;

          return (
            <WorkCard
              key={uniqueKey}
              imgs={project.media}
              name={project.title}
              description={project.description}
              onClick={() => setPopupProject(project)}
            />
          );
        })}
      </div>
    );
  };

  useEffect(() => {
    const fetchFiles = async () => {
      const res = await fetch("/api/portfolio/list-files");
      const data = await res.json();

      if (!res.ok) {
        console.error("Failed to fetch files:", data.error);
      }
    };

    fetchFiles();
  }, []);

  return (
    <div className="mt-10 laptop:mt-30 p-2 laptop:p-0" ref={workRef}>
      <h1 className="text-2xl text-bold">Collaborations.</h1>
      <ProjectWrapper />
      {/* Popup for project details */}
      {popupProject && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setPopupProject(null)}
        >
          <div
            className="p-5 rounded-lg max-w-3xl w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-5 right-5 text-white text-2xl"
              onClick={() => setPopupProject(null)}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">{popupProject.title}</h2>
            {popupProject.imageSrc && (
              <img
                src={popupProject.imageSrc}
                alt={popupProject.title}
                className="w-full h-auto mb-4"
              />
            )}
            <p>{popupProject.description}</p>
            {popupProject.url && (
              <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => window.open(popupProject.url)}
              >
                Visit Project
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

