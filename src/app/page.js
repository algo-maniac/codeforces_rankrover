"use client";

import Navbar from "@/components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="flex justify-around items-center h-[500px]">
        <div className="lg:text-6xl md:text-5xl text-3xl w-[60%] m-auto tracking-wide">
          Explore your Codeforces account, compare with your friends and get
          exclusive insights
        </div>
      </div>
    </>
  );
}
