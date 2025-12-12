"use client";

import { ICandidates } from "@/Modules/Candidates";
import { useEffect, useState } from "react";

export default function ChooseCandidates({ voterID }: { voterID: string }) {
  const [error, setError] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<ICandidates[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voted, setVoted] = useState<ICandidates[]>([]);

 const loadCandidates = async () => {
  try {
    const res = await fetch("/api/candidates/getallcandidates");
    const data = await res.json();

    if (!Array.isArray(data)) {
      setError("فشل تحميل المرشحين.. حاول تاني");
      setCandidates([]);
      return;
    }

    setCandidates(data);
  } catch (err) {
    setError("فشل تحميل المرشحين.. حاول تاني");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    loadCandidates();
  }, []);

  const selectVote = (vote: ICandidates) => {
    setError(null);

    const alreadySelected = voted.find((x) => x._id === vote._id);

    if (alreadySelected) {
      setVoted(voted.filter((x) => x._id !== vote._id));
      return;
    }

    if (voted.length >= 3) {
      setError("مسموح تختار 3 مرشحين فقط");
      return;
    }

    setVoted([...voted, vote]);
  };

  const handleSubmit = async () => {
    if (voted.length !== 3) {
      setError("اختار 3 مرشحين بالظبط");
      return;
    }

    setIsSubmitting(true);

    try {
      await fetch("/api/vote", {
        method: "POST",
        body: JSON.stringify({
          voterID,
          selected: voted.map((v) => v._id),
        }),
      });
    } catch (err) {
      setError(` ${err}حصل خطأ أثناء إرسال التصويت`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div>Loading candidates...</div>;

  return (
    <div
      className="w-[80%] p-3 rounded-md bg-white flex flex-col gap-2"
      style={{ direction: "rtl" }}
    >
      {error && <div className="text-xl text-red-600 mb-3">{error}</div>}

      {candidates.map((c, index) => {
        const isSelected = voted.some((v) => v._id === c._id);

        return (
          <div
            key={index}
            onClick={() => selectVote(c)}
            className={`flex justify-between py-3 px-2 cursor-pointer rounded-md font-bold
              ${
                isSelected
                  ? "bg-green-100 border border-green-600"
                  : "bg-gray-100"
              }
            `}
          >
            <div className="flex gap-4">
              <span>{c.candidateNumber}</span>
              <span>{c.name}</span>
            </div>

            <span>{c.symbol}</span>
          </div>
        );
      })}

      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="mt-6 w-full rounded-md bg-green-600 px-4 py-2 text-white text-xl hover:bg-green-700 disabled:bg-green-400"
      >
        {isSubmitting ? "Processing..." : "Vote"}
      </button>
    </div>
  );
}
