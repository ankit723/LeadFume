"use client";

import Image from "next/image";

export default function OverView() {
  return (
    <section className="w-full flex flex-col px-4 md:px-8 lg:px-12 py-4">
      <div className="relative w-full mt-0">
        <Image
          src="/home/Image.svg" 
          alt="Web Dashboard"
          width={900}
          height={700}
          className="w-full max-w-6xl mx-auto"
        />
      </div>
    </section>
  );
}

