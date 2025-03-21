import { Metadata } from "next";
import NotFoundComponent from "./not-found-component";

export const metadata: Metadata = {
  title: "Page Not Found | Leadfume",
  description: "The page you're looking for cannot be found. Return to Leadfume homepage.",
  robots: {
    index: false,
    follow: true,
  }
};

export default function NotFound() {
  return <NotFoundComponent />;
} 