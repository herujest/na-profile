import React from "react";

interface ProjectResumeProps {
  dates?: string;
  type?: string;
  position?: string;
  bullets?: string;
}

const ProjectResume: React.FC<ProjectResumeProps> = ({ dates, type, position, bullets }) => {
  const [bulletsLocal, setBulletsLocal] = React.useState<string[]>(
    bullets ? bullets.split(",") : []
  );

  return (
    <div className="w-full flex flex-col tablet:flex-row tablet:justify-between gap-4 tablet:gap-6 pb-6 tablet:pb-8 border-b border-gray-200 dark:border-gray-800 last:border-b-0">
      <div className="flex-shrink-0 tablet:w-2/5 laptop:w-1/3">
        <h2 className="text-base tablet:text-lg laptop:text-xl font-medium mb-1 tablet:mb-2 text-gray-800 dark:text-gray-300">
          {dates}
        </h2>
        <h3 className="text-xs tablet:text-sm laptop:text-base text-gray-500 dark:text-gray-500">
          {type}
        </h3>
      </div>
      <div className="flex-1 tablet:w-3/5 laptop:w-2/3">
        <h2 className="text-base tablet:text-lg laptop:text-xl font-bold mb-2 tablet:mb-3 text-gray-900 dark:text-white">
          {position}
        </h2>
        {bulletsLocal && bulletsLocal.length > 0 && (
          <ul className="list-disc list-inside space-y-1 tablet:space-y-2">
            {bulletsLocal.map((bullet, index) => (
              <li key={index} className="text-sm tablet:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                {bullet.trim()}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProjectResume;

