import { Button } from "@/components/ui/button";
import Link from "next/link";

//one click google sign in
export default function Home() {
  return (
    <>
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold">Leadfume</h1>
      <p className="text-sm text-muted-foreground">
        Build your leads with ease
      </p>
      <Button className="mt-4"><Link href="/sign-in">Get Started</Link></Button>
    </div> 
    </>
  );
}
