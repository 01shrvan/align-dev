import { Metadata } from "next";
import JobsContent from "./JobsContent";

export const metadata: Metadata = {
  title: "Jobs & Internships",
};

export default function JobsPage() {
  return <JobsContent />;
}