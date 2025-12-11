import CreateVote from "@/components/CreateVote/CreateVote";
import { connectDB } from "@/lib/mongoose";
import Image from "next/image";

export default async function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center font-sans ">
      <CreateVote/>
    </div>
  );
}
