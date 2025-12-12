import Link from "next/link";
import ChooseCandidates from "@/components/ChooseCandidates/ChooseCandidates";

const getVoter = async (id: string) => {
  try {
    const res = await fetch(`${process.env.BASE_URL}/api/voter/get/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = await res.json();


    return data.voter;
  } catch (error) {
    console.error("Failed to fetch voter:", error);
    return null;
  }
};

export default async function Page({
  params,
}: {
  params: Promise<{ voterID: string }>;
}) {
  const { voterID } = await params;

  const voter = await getVoter(voterID);

  if (voter === null) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Link
          href="/"
          className="bg-amber-100 p-4 rounded-md text-2xl font-bold"
        >
          انت مش مسجل في قائمة الناخبين — برجاء التسجيل
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 flex justify-center items-center w-full">
      <ChooseCandidates voterID={voterID} />
    </div>
  );
}
