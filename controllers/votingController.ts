import {
  Candidates,
  ICandidates,
  validateCreateCandidates,
} from "@/Modules/Candidates";
import { NextRequest, NextResponse } from "next/server";
import { Voter, validateCreateVoter } from "@/Modules/Voter";

export const createVote = async (req: NextRequest) => {
  try {
    
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error creating voter: " + (error as Error).message },

      { status: 500 }
    );
  }
};
