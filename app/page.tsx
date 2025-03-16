import Hero from "./components/home/Hero";
import Nav from "./components/home/Nav";
import OverView from "./components/home/OverView";

//one click google sign in
export default function Home() {
  return (
    <main className="">
      <Nav />
      <div className="max-w-[90rem] mx-auto">
        <Hero />
        <OverView />
      </div>
    </main>
  );
}
