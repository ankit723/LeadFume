import About from "./components/home/About";
import ElevateComponent from "./components/home/elevate-component";
import GetTouch from "./components/home/GetTouch";
import Hero from "./components/home/Hero";
import Nav from "./components/home/Nav";
import OverView from "./components/home/OverView";
import Questions from "./components/home/Questions";
import Testimonials from "./components/home/Testimonial";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leadfume - AI-Powered Lead Generation Platform",
  description: "Generate high-quality sales leads with Leadfume's advanced AI platform. Streamline your lead generation process and boost your sales conversions.",
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Leadfume - AI-Powered Lead Generation Platform",
    description: "Generate high-quality sales leads with Leadfume's advanced AI platform. Streamline your lead generation process and boost your sales conversions.",
    url: '/',
  },
};

//one click google sign in
export default function Home() {
  return (
    <main className="bg-white dark:bg-gray-950 min-h-screen">
      <Nav />
      <div className="max-w-[90rem] mx-auto">
        <Hero />
        <OverView />
        <About/>
        <GetTouch/>
        <ElevateComponent/>
        <Testimonials/>
        <Questions/>
      </div>
    </main>
  );
}
