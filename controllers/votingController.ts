import { NextRequest, NextResponse } from "next/server";
import { Voter } from "@/Modules/Voter";
import { Candidates, ICandidates } from "@/Modules/Candidates";

export const createVote = async (
  req: NextRequest,
  context: { params: Promise<{ voterID: string }> }
) => {
  try {
    const { selected } = await req.json();
    const vote: string[] = selected;

    const { voterID } = await context.params;

    const voter = await Voter.findOne({ voterId: voterID });
    if (!voter) {
      return NextResponse.json({ message: "voter not found" }, { status: 404 });
    }

    if (voter.whoVotedFor.length >= 3 || voter.hasVoted === true) {
      return NextResponse.json(
        { message: "You can vote maximum 3 candidates" },
        { status: 400 }
      );
    }

    for (const candidateId of vote) {
      if (voter.whoVotedFor.includes(candidateId)) {
        return NextResponse.json(
          { message: `You already voted for candidate number ${candidateId}` },
          { status: 400 }
        );
      }

      if (voter.whoVotedFor.length >= 3) {
        return NextResponse.json(
          { message: "You can vote maximum 3 candidates" },
          { status: 400 }
        );
      }

      await Candidates.findOneAndUpdate(
        { candidateNumber: candidateId },
        { $addToSet: { voteCount: voterID } }
      );

      voter.whoVotedFor.push(candidateId);
    }

    voter.hasVoted = true;

    await voter.save();

    return NextResponse.json(
      { message: "Vote recorded successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error creating vote: " + (error as Error).message },
      { status: 500 }
    );
  }
};
