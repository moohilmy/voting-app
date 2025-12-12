"use client";

import { IVoteScanForm, VoterScanSchema } from "@/validation/VottingCheck";
import { IVoter } from "@/Modules/Voter";
import InputField from "../InputField/InputField";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import Link from "next/link";
export default function VotingForm() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isError, setIsError] = useState<string | null>(null);
  const [voter, setVoter] = useState<IVoter | null>(null);
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors ,  },
  } = useForm<IVoteScanForm>({
    resolver: zodResolver(VoterScanSchema),
    mode: "onBlur",
  });
  const {voterID} = getValues()
  const onSubmit: SubmitHandler<IVoteScanForm> = async (data) => {
    if (!data.voterID) return;

    setIsSubmitting(true);
    setIsError(null);
    try {
      const response = await fetch(`/api/voter/get/${data.voterID}`, {
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();

      if (!response.ok) {
        setIsError(result.message || "An unknown error occurred");
        setIsSubmitting(false);
        return;
      }
      setVoter(result);

      setIsSubmitting(false);
    } catch (error) {
      setIsError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
      setIsSubmitting(false);
    }
  };

  return voter ? (
    voter.isVerified ? (
      voter.hasVoted ? (
        <div>
          <h2>thank you for vote you choose</h2>
          <ul>
            {voter.whoVotedFor?.map((vote, index) => (
              <div key={index}>{vote}</div>
            ))}
          </ul>
        </div>
      ) : <Link className="bg-amber-100 p-2 text-2xl capitalize " href={`/voting/${voterID}`}>vote now</Link>
    ) : (
      <div className="flex flex-col items-center justify-center">
        <div className=" text-xl">
          Please verify yourself by sending your OTP to the Telegram bot
        </div>

        <div className=" text-green-500 text-xl uppercase font-bold my-3">
          your OTP {voter.OTP}
        </div>
        <Link
          className=" text-center uppercase mt-3 w-full cursor-pointer rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2  disabled:bg-green-400"
          href={"https://t.me/green_Alataba_vote_bot"}
        >
          click here to go to bot
        </Link>
      </div>
    )
  ) : (
    <div className="flex flex-col justify-center items-center gap-4 p-6 bg-white rounded-lg shadow-md">
      {isError && <div className="text-2xl text-red-500 mb-4">{isError}</div>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <InputField
          id="voterID"
          {...register("voterID")}
          label="Voter ID"
          error={errors.voterID}
          type="text"
          placeholder="Enter voter ID"
        />
        <button
          type="submit"
          className="mt-6 w-full cursor-pointer rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2  disabled:bg-green-400"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : "join to elections"}
        </button>
      </form>

    </div>
  );
}
