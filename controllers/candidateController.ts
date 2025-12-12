import {
  Candidates,
  ICandidates,
  validateCreateCandidates,
} from "@/Modules/Candidates";
import { NextRequest, NextResponse } from "next/server";

export const createCandidates = async (req: NextRequest) => {
  try {
    const candidateData: ICandidates = await req.json();
    const { error } = validateCreateCandidates(candidateData);
    if (error) {
      return NextResponse.json(
        { error: "Validation error: " + error.details[0].message },
        { status: 400 }
      );
    }
    const ifVoterExists = await Candidates.findOne({
      candidateNumber: candidateData.candidateNumber,
    });
    if (ifVoterExists) {
      return NextResponse.json(
        { ifVoterExists, message: "candidate is existed" },
        { status: 500 }
      );
    }
    const newCandidate = await Candidates.create({
      name: candidateData.name,
      symbol: candidateData.symbol,
      candidateNumber: candidateData.candidateNumber,
    });
    return NextResponse.json(
      { voter: newCandidate, message: "candidate created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error creating voter: " + (error as Error).message },

      { status: 500 }
    );
  }
};

export const getALLCandidates = async () => {
  try {
    const candidates = await Candidates.find({}).lean();
    return NextResponse.json(candidates || [], { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Error fetching candidates: " + (err as Error).message },
      { status: 500 }
    );
  }
};
