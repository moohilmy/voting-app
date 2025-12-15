import { NextRequest, NextResponse } from "next/server";
import { Voter } from "@/Modules/Voter";
import { Candidates } from "@/Modules/Candidates";
import { VotingInfo } from "@/Modules/VotingInfo";

export const createVote = async (
  req: NextRequest,
  context: { params: Promise<{ voterID: string }> }
) => {
  try {
    const { selected } = await req.json();
    const vote: string[] = selected;

    const { voterID } = await context.params;
    if (!voterID) {
      return NextResponse.json({ message: "access denied" }, { status: 403 });
    }
    const voter = await Voter.findOne({ voterId: voterID });
    const res = await fetch(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/getChat?chat_id=${voter.telegramFingerprint}`
    );
    const data = await res.json();

    if(!data.ok){
      return NextResponse.json({ message: "access denied" }, { status: 403 });

    }
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
    await VotingInfo.updateOne(
      {},
      {
        $inc: { votersWhoVotting: 1 },
      }
    );
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

export const getInfoVote = async (req: NextRequest) => {
  try {
    const votingInfo = await VotingInfo.findOne({});
    return NextResponse.json(
      { votingInfo, message: "get vote info successfully" },
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
