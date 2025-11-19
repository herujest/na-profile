import React from "react";
import Socials from "../Socials";
import Link from "next/link";
import Button from "../Button";

const Footer: React.FC = () => {
  return (
    <>
      <div className="mt-5 laptop:mt-40 p-2 laptop:p-0">
        <div>
          <h1 className="text-2xl text-bold text-gray-900 dark:text-white">
            Contact.
          </h1>
          <div className="mt-10">
            <h1 className="text-3xl tablet:text-6xl laptop:text-6xl laptopl:text-8xl text-bold text-gray-900 dark:text-white">
              LET&apos;S WORK
            </h1>
            <h1 className="text-3xl tablet:text-6xl laptop:text-6xl laptopl:text-8xl text-bold text-gray-900 dark:text-white">
              TOGETHER
            </h1>
            <Button type="primary">Schedule a call</Button>
            <div className="mt-10">
              <Socials />
            </div>
          </div>
        </div>
      </div>
      <h1 className="text-sm text-bold mt-2 laptop:mt-10 p-2 laptop:p-0 text-gray-700 dark:text-gray-300">
        Made With ❤ by{" "}
        <Link href="/">
          <a className="underline underline-offset-1 text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300">
            heruu.js
          </a>
        </Link>
      </h1>
    </>
  );
};

export default Footer;

