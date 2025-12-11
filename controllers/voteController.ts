import { Voter, IVoter, validateCreateVoter } from "@/Modules/Voter";
import { NextRequest, NextResponse } from "next/server";

export const createVoter = async (req: NextRequest) => {
  try {
    const voterData = await req.json();
    const { error } = validateCreateVoter(voterData);
    if (error) {
      return NextResponse.json(
        { error: "Validation error: " + error.details[0].message },
        { status: 400 }
      );
    }

    const ifVoterExists = await Voter.findOne({
      clubHouseID: voterData.clubHouseID.toLowerCase(),
    });
    if (ifVoterExists) {
      return NextResponse.json(
        { ifVoterExists, message: "voter is existed" },
        { status: 500 }
      );
    }
    const createNewOTP = (): string => {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      return otp;
    };

    let voterId = Math.floor(10000000 + Math.random() * 90000000).toString();
    while (await Voter.findOne({ voterId })) {
      voterId = Math.floor(10000000 + Math.random() * 90000000).toString();
    }
    const newVoter = await Voter.create({
      clubHouseID: voterData.clubHouseID.toLowerCase(),
      telegramID: voterData.telegramID,
      voterId: voterId,
      OTP: createNewOTP(),
    });
    return NextResponse.json(
      { voter: newVoter, message: "voter created successfully" },
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
