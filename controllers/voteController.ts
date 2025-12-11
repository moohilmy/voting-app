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

    const createVoterID = (voterData: IVoter): string => {
      const clubHouseID = voterData.clubHouseID;
      const time = Date.now().toString();
      const str = clubHouseID.slice(0, 3).toUpperCase() + time.slice(-6);
      let voteID = 0;
      for (let i = 0; i < str.length; i++) {
        voteID = (voteID * 31 + str.charCodeAt(i)) % 100000000;
      }
      return voteID.toString();
    };
    const newVoter = await Voter.create({
      clubHouseID: voterData.clubHouseID.toLowerCase(),
      telegramID: voterData.telegramID,
      voterId: createVoterID(voterData),
      OTP: createNewOTP(),
    });
    return NextResponse.json(
      { newVoter, message: "voter created successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error creating voter: " + (error as Error).message },
      { status: 500 }
    );
  }
};
