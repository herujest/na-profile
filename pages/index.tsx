import Head from "next/head";
import Link from "next/link";
import { useRef, useState } from "react";
import { stagger } from "../animations";
import Button from "../components/Button";
import Cursor from "../components/Cursor";
import Footer from "../components/Footer";
import Header from "../components/Header";
import ServiceCard from "../components/ServiceCard";
import Socials from "../components/Socials";
import { useIsomorphicLayoutEffect } from "../utils";

// Local Data
import data from "../data/portfolio.json";
import Portfolio from "./sections/portfolio";

import TabButton from "../components/Button/TabButton";
import Collaboration from "./sections/collaboration";

interface HomeTab {
  id: string;
  label: string;
  route: string;
}

const homeTabs: HomeTab[] = [
  {
    id: "tabPortfolio",
    label: "Portfolio",
    route: "portfolio",
  },
  {
    id: "tabAffiliateProducts",
    label: "Affiliates",
    route: "affiliates",
  },
];

export default function Home() {
  // Ref
  const workRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const textOne = useRef<HTMLHeadingElement>(null);
  const textTwo = useRef<HTMLHeadingElement>(null);
  const textThree = useRef<HTMLHeadingElement>(null);
  const textFour = useRef<HTMLHeadingElement>(null);

  const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<HomeTab>(homeTabs[currentTabIndex]);

  function onChangeActiveTab(index: number) {
    setCurrentTabIndex(index);
    setActiveTab(homeTabs[index]);
  }

  // Handling Scroll
  const handleWorkScroll = () => {
    if (workRef.current) {
      window.scrollTo({
        top: workRef.current.offsetTop,
        left: 0,
        behavior: "smooth",
      });
    }
  };

  const handleAboutScroll = () => {
    if (aboutRef.current) {
      window.scrollTo({
        top: aboutRef.current.offsetTop,
        left: 0,
        behavior: "smooth",
      });
    }
  };

  useIsomorphicLayoutEffect(() => {
    if (textOne.current && textTwo.current && textThree.current && textFour.current) {
      stagger(
        [textOne.current, textTwo.current, textThree.current, textFour.current],
        { y: 40, x: -10, transform: "scale(0.95) skew(10deg)" },
        { y: 0, x: 0, transform: "scale(1)" }
      );
    }
  }, []);

  return (
    <div className={`relative ${data.showCursor && "cursor-none"}`}>
      {data.showCursor && <Cursor />}
      <Head>
        <title>{data.name}</title>
      </Head>

      <div className="gradient-circle"></div>
      <div className="gradient-circle-bottom"></div>

      <div className="container mx-auto mb-10">
        <Header
          handleWorkScroll={handleWorkScroll}
          handleAboutScroll={handleAboutScroll}
        />
        <div className="laptop:mt-20 mt-10">
          <div className="mt-5">
            <h1
              ref={textOne}
              className="text-3xl tablet:text-6xl laptop:text-6xl laptopl:text-8xl p-1 tablet:p-2 text-bold w-4/5 mob:w-full laptop:w-4/5"
            >
              {data.headerTaglineOne}
            </h1>
            <h1
              ref={textTwo}
              className="text-3xl tablet:text-6xl laptop:text-6xl laptopl:text-8xl p-1 tablet:p-2 text-bold w-full laptop:w-4/5"
            >
              {data.headerTaglineTwo}
            </h1>
            <h1
              ref={textThree}
              className="text-3xl tablet:text-6xl laptop:text-6xl laptopl:text-8xl p-1 tablet:p-2 text-bold w-full laptop:w-4/5"
            >
              {data.headerTaglineThree}
            </h1>
            <h1
              ref={textFour}
              className="text-3xl tablet:text-6xl laptop:text-6xl laptopl:text-8xl p-1 tablet:p-2 text-bold w-full laptop:w-4/5"
            >
              {data.headerTaglineFour}
            </h1>
          </div>

          <Socials className="mt-2 laptop:mt-5" />
        </div>
        {/* WORK Collaborations */}
        <div className="row-item">
          <TabButton
            classes={`button-tab ${
              currentTabIndex === 0 ? "switch-active" : "switch-inactive"
            }`}
            onClick={() => onChangeActiveTab(0)}
          >
            Collaboration
          </TabButton>
          <TabButton
            classes={`button-tab ${
              currentTabIndex === 1 ? "switch-active" : "switch-inactive"
            }`}
            onClick={() => onChangeActiveTab(1)}
          >
            Gallery
          </TabButton>
        </div>
        {currentTabIndex === 0 ? (
          <Portfolio workRef={workRef as React.RefObject<HTMLDivElement>} collabs={data.collaborations || []} />
        ) : null}
        {currentTabIndex === 1 ? <Collaboration /> : null}

        <div className="mt-10 laptop:mt-30 p-2 laptop:p-0">
          <h1 className="tablet:m-10 text-2xl text-bold">Services.</h1>
          <div className="mt-5 tablet:m-10 grid grid-cols-1 laptop:grid-cols-2 gap-6">
            {data.services.map((service: { title: string; description: string }, index: number) => (
              <ServiceCard
                key={index}
                name={service.title}
                description={service.description}
              />
            ))}
          </div>
        </div>
        {/* This button should not go into production */}
        {process.env.NODE_ENV === "development" && (
          <div className="fixed bottom-5 right-5">
            <Link href="/edit">
              <Button type="primary">Edit Data</Button>
            </Link>
          </div>
        )}
        <div className="mt-10 laptop:mt-40 p-2 laptop:p-0" ref={aboutRef}>
          <h1 className="tablet:m-10 text-2xl text-bold">About.</h1>
          <p className="tablet:m-10 mt-2 text-xl laptop:text-3xl w-full laptop:w-3/5">
            {data.aboutpara}
          </p>
        </div>
        <Footer />
      </div>
    </div>
  );
}

