import CreateVote from "@/components/CreateVote/CreateVote";


export default async function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center font-sans ">
      <CreateVote/>
    </div>
  );
}
