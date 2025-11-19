import { useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  tech: string[];
  url: string;
}

const Collaboration: React.FC = () => {
  const [activeTemplate, setActiveTemplate] = useState<string>("magazine");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Sample data
  const projects: Project[] = [
    {
      id: 1,
      title: "E-commerce Platform",
      description:
        "A modern e-commerce solution with advanced filtering and payment integration.",
      image:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
      category: "Web Development",
      tech: ["React", "Node.js", "MongoDB"],
      url: "#",
    },
    {
      id: 2,
      title: "Mobile Banking App",
      description:
        "Secure and intuitive mobile banking application with biometric authentication.",
      image:
        "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=250&fit=crop",
      category: "Mobile App",
      tech: ["React Native", "Firebase"],
      url: "#",
    },
    {
      id: 3,
      title: "Data Visualization Dashboard",
      description:
        "Real-time analytics dashboard for business intelligence and reporting.",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=350&fit=crop",
      category: "Data Science",
      tech: ["D3.js", "Python", "PostgreSQL"],
      url: "#",
    },
    {
      id: 4,
      title: "AI Chatbot Platform",
      description:
        "Intelligent chatbot platform with natural language processing capabilities.",
      image:
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=280&fit=crop",
      category: "AI/ML",
      tech: ["Python", "TensorFlow", "FastAPI"],
      url: "#",
    },
    {
      id: 5,
      title: "Design System",
      description:
        "Comprehensive design system and component library for enterprise applications.",
      image:
        "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=320&fit=crop",
      category: "Design",
      tech: ["Figma", "Storybook", "React"],
      url: "#",
    },
    {
      id: 6,
      title: "Blockchain Wallet",
      description:
        "Secure cryptocurrency wallet with multi-chain support and DeFi integration.",
      image:
        "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=290&fit=crop",
      category: "Blockchain",
      tech: ["Web3.js", "Solidity", "React"],
      url: "#",
    },
  ];

  const templates: Record<string, string> = {
    cards: "Card Grid",
    minimal: "Minimal List",
    magazine: "Magazine Style",
  };

  const templateIcons: Record<string, React.ReactElement> = {
    cards: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    minimal: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" />
        <line x1="3" y1="18" x2="3.01" y2="18" />
      </svg>
    ),
    magazine: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="9" y1="21" x2="9" y2="9" />
      </svg>
    ),
  };

  interface ProjectCardProps {
    project: Project;
    template: string;
  }

  const ProjectCard: React.FC<ProjectCardProps> = ({ project, template }) => {
    const baseClasses = "group cursor-pointer transition-all duration-300";

    switch (template) {
      case "cards":
        return (
          <div className={`${baseClasses}`}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transform hover:-translate-y-2 h-full">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="bg-white bg-opacity-90 text-gray-900 p-2 rounded-full hover:bg-opacity-100 transition-all duration-200"
                  >
                    {/* <Eye size={16} /> */}
                  </button>
                </div>
                <div className="absolute bottom-4 left-4">
                  <span className="bg-black bg-opacity-70 text-white text-xs px-3 py-1 rounded-full">
                    {project.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl mb-3 text-gray-900 dark:text-white">
                  {project.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.slice(0, 3).map((tech, index) => (
                    <span
                      key={index}
                      className="text-xs font-medium bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-3 py-1 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.tech.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{project.tech.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case "minimal":
        return (
          <div
            className={`${baseClasses} border-b border-gray-200 dark:border-gray-700 py-6`}
          >
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex-grow">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                    {project.title}
                  </h3>
                  <span className="text-sm text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    {project.category}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  {project.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    {project.tech.slice(0, 4).map((tech, index) => (
                      <span
                        key={index}
                        className="text-xs text-gray-500 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center space-x-1"
                  >
                    <span>View</span>
                    {/* <ExternalLink size={14} /> */}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case "magazine":
        const isLarge = project.id % 3 === 0;
        return (
          <div
            className={`${baseClasses} ${
              isLarge ? "col-span-2 row-span-2" : ""
            }`}
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transform hover:-translate-y-1 h-full">
              <div
                className={`relative overflow-hidden ${
                  isLarge ? "h-64" : "h-40"
                }`}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-white text-xs font-medium bg-white bg-opacity-20 backdrop-blur-sm px-2 py-1 rounded">
                    {project.category}
                  </span>
                  <h3
                    className={`font-bold text-white mt-2 ${
                      isLarge ? "text-xl" : "text-lg"
                    }`}
                  >
                    {project.title}
                  </h3>
                  {isLarge && (
                    <p className="text-gray-200 text-sm mt-1 line-clamp-2">
                      {project.description}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setSelectedProject(project)}
                  className="absolute top-4 right-4 bg-white bg-opacity-20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-opacity-30 transition-all duration-200"
                >
                  {/* <Eye size={16} /> */}
                </button>
              </div>
              {!isLarge && (
                <div className="p-4">
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {project.tech.slice(0, 2).map((tech, index) => (
                      <span
                        key={index}
                        className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderGrid = () => {
    switch (activeTemplate) {
      case "cards":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                template="cards"
              />
            ))}
          </div>
        );
      case "minimal":
        return (
          <div className="max-w-4xl mx-auto">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                template="minimal"
              />
            ))}
          </div>
        );
      case "magazine":
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-max">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                template="magazine"
              />
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full mt-10 laptop:mt-30 p-2 laptop:p-0">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl text-bold mb-4">Partner in Collaborations.</h1>
        {/* Template Selector Dropdown */}
        <div className="relative inline-block text-left">
          {/* @ts-ignore - @headlessui/react Menu has type issues with React 18 */}
          <Menu>
            {({ open }: { open: boolean }): React.ReactNode => (
              <>
                {/* @ts-ignore */}
                <Menu.Button className="inline-flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 min-w-[200px]">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-900 dark:text-white">
                      {templateIcons[activeTemplate]}
                    </span>
                    <span>{templates[activeTemplate]}</span>
                  </div>
                  <svg
                    className={`ml-2 -mr-1 h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
                      open ? "rotate-180" : ""
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Menu.Button>

                {/* @ts-ignore */}
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  {/* @ts-ignore */}
                  <Menu.Items className="absolute left-0 mt-2 w-56 origin-top-left bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10 border border-gray-200 dark:border-gray-700">
                    <div className="py-1">
                      {Object.entries(templates).map(([key, name]) => (
                        /* @ts-ignore */
                        <Menu.Item key={key}>
                          {({ active }: { active: boolean }) => (
                            <button
                              onClick={() => setActiveTemplate(key)}
                              className={`${
                                active || activeTemplate === key
                                  ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                                  : "text-gray-700 dark:text-gray-300"
                              } group flex items-center w-full px-4 py-2 text-sm transition-all duration-150 hover:bg-gray-100 dark:hover:bg-gray-700`}
                            >
                              <span
                                className={`mr-3 flex-shrink-0 ${
                                  active || activeTemplate === key
                                    ? "text-blue-600 dark:text-blue-400"
                                    : "text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                                } transition-colors duration-150`}
                              >
                                {templateIcons[key]}
                              </span>
                              <span className="flex-1 text-left">{name}</span>
                              {activeTemplate === key && (
                                <svg
                                  className="h-4 w-4 text-blue-600 dark:text-blue-400"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                            </button>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </>
            )}
          </Menu>
        </div>
      </div>

      {/* Content */}
      <div className="w-full">{renderGrid()}</div>

      {/* Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-10 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-900 p-2 rounded-full transition-all duration-200"
              >
                {/* <X size={20} /> */}
              </button>

              <div className="relative h-64 md:h-80 overflow-hidden rounded-t-2xl">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="bg-white bg-opacity-20 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full">
                    {selectedProject.category}
                  </span>
                  <h2 className="text-3xl font-bold text-white mt-2">
                    {selectedProject.title}
                  </h2>
                </div>
              </div>

              <div className="p-8">
                <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
                  {selectedProject.description}
                </p>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Technologies Used
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tech.map((tech, index) => (
                      <span
                        key={index}
                        className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => window.open(selectedProject.url, "_blank")}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                  >
                    {/* <ExternalLink size={20} /> */}
                    <span>Visit Project</span>
                  </button>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Collaboration;
