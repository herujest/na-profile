"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProjectResume from "@/components/ProjectResume";
import Socials from "@/components/Socials";
import Button from "@/components/Button";
import { useTheme } from "next-themes";
import data from "@/lib/data/portfolio.json";

// Extract data from default import
const { name, showResume, resume } = data;

export default function ResumePage() {
  const router = useRouter();
  const theme = useTheme();
  const [mount, setMount] = useState<boolean>(false);

  useEffect(() => {
    setMount(true);
    if (!showResume) {
      router.push("/");
    }
  }, [router]);

  return (
    <>
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button onClick={() => router.push("/admin/resume")} type={"primary"}>
            Edit Resume
          </Button>
        </div>
      )}
      {mount && (
        <div
          className="w-full min-h-screen resume-page-wrapper"
          style={{
            backgroundColor:
              mount && theme.theme === "dark" ? "#000000" : "#ffffff",
            position: "relative",
          }}
        >
          <div className="w-full max-w-5xl mx-auto px-4 tablet:px-6 laptop:px-8 desktop:px-12 pt-0 pb-8 tablet:pb-12 laptop:pb-16 desktop:pb-20">
            <div
              className={`w-full rounded-lg p-6 tablet:p-8 laptop:p-12 desktop:p-16 transition-all duration-300 ${
                mount && theme.theme === "dark"
                  ? "bg-gray-950 border border-gray-900"
                  : "bg-gray-50 border border-gray-200"
              }`}
            >
              {/* Header Section */}
              <div className="mb-8 tablet:mb-10 laptop:mb-12">
                <h1 className="text-2xl tablet:text-3xl laptop:text-4xl font-bold mb-4 tablet:mb-5 text-gray-900 dark:text-white">
                  {name}
                </h1>
                <h2 className="text-lg tablet:text-xl laptop:text-2xl font-medium mb-3 tablet:mb-4 text-gray-700 dark:text-gray-200">
                  {resume.tagline}
                </h2>
                <p className="text-base tablet:text-lg laptop:text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl">
                  {resume.description}
                </p>
                <div className="mt-4 tablet:mt-5">
                  <Socials />
                </div>
              </div>

              {/* Experience Section */}
              <div className="mb-8 tablet:mb-10 laptop:mb-12">
                <h1 className="text-xl tablet:text-2xl laptop:text-3xl font-bold mb-6 tablet:mb-8 text-gray-900 dark:text-white">
                  Experience
                </h1>
                <div className="space-y-4 tablet:space-y-6">
                  {resume.experiences.map(
                    ({
                      id,
                      dates,
                      type,
                      position,
                      bullets,
                    }: {
                      id: string;
                      dates: string;
                      type: string;
                      position: string;
                      bullets: string;
                    }) => (
                      <ProjectResume
                        key={id}
                        dates={dates}
                        type={type}
                        position={position}
                        bullets={bullets}
                      />
                    )
                  )}
                </div>
              </div>

              {/* Skills Section */}
              <div className="mb-4 tablet:mb-6">
                <h1 className="text-xl tablet:text-2xl laptop:text-3xl font-bold mb-6 tablet:mb-8 text-gray-900 dark:text-white">
                  Skills
                </h1>
                <div className="grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 gap-6 tablet:gap-8 laptop:gap-10">
                  {resume.languages && (
                    <div className="p-4 tablet:p-5 laptop:p-6 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300">
                      <h2 className="text-base tablet:text-lg laptop:text-xl font-semibold mb-3 tablet:mb-4 text-gray-800 dark:text-gray-200">
                        Modeling Focus
                      </h2>
                      <ul className="list-disc list-inside space-y-1 tablet:space-y-2">
                        {resume.languages.map(
                          (language: string, index: number) => (
                            <li
                              key={index}
                              className="text-sm tablet:text-base laptop:text-lg text-gray-600 dark:text-gray-400"
                            >
                              {language}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                  {resume.frameworks && (
                    <div className="p-4 tablet:p-5 laptop:p-6 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300">
                      <h2 className="text-base tablet:text-lg laptop:text-xl font-semibold mb-3 tablet:mb-4 text-gray-800 dark:text-gray-200">
                        Creative Collaboration
                      </h2>
                      <ul className="list-disc list-inside space-y-1 tablet:space-y-2">
                        {resume.frameworks.map(
                          (framework: string, index: number) => (
                            <li
                              key={index}
                              className="text-sm tablet:text-base laptop:text-lg text-gray-600 dark:text-gray-400"
                            >
                              {framework}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                  {resume.others && (
                    <div className="p-4 tablet:p-5 laptop:p-6 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300">
                      <h2 className="text-base tablet:text-lg laptop:text-xl font-semibold mb-3 tablet:mb-4 text-gray-800 dark:text-gray-200">
                        Tools & Techniques
                      </h2>
                      <ul className="list-disc list-inside space-y-1 tablet:space-y-2">
                        {resume.others.map((other: string, index: number) => (
                          <li
                            key={index}
                            className="text-sm tablet:text-base laptop:text-lg text-gray-600 dark:text-gray-400"
                          >
                            {other}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
