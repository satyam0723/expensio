"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import { useRef } from "react";

const HeroSection = () => {
  const imageRef = useRef();
  return (
    <div className="pb-20 px-4">
      <div className="container mx-auto text-center">
        <h1 className="text-5xl md:text-8xl lg:text-[105px] pb-6 gradient-title">
          {/* Simplify, Track, Grow <br /> Your Finances */}
          {/* Smarter Money Management. Simplified. */}
          Simplify Your Spending <br /> With Intelligence
        </h1>
        <p className="text-xl text-gray-600 dark:text-white/85 m-6 max-w-2xl mx-auto ">
          Overwhelmed by your finances? <br />
          <i>
            Let Expensio track, analyze, and visualize your expenses,
            automatically.
          </i>
        </p>
        <div className=" space-x-4">
          <Link href="/dashboard">
            <Button className="px-8 w-1/8 dark:bg-white">Get Started</Button>
          </Link>
        </div>
        <div className="hero-image-wrapper mt-5 md:mt-0">
          <div className="hero-image" ref={imageRef}>
            <Image
              src="/banner4.jpg"
              width={1000}
              height={500}
              alt="Dashboard Preview"
              className="rounded-lg shadow-2xl border mx-auto m-5"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
