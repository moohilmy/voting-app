import { connectDB } from "@/lib";
import { Admin } from "@/Modules/Admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const data = await req.json();
    const newVoter = await Admin.create({
      userName: data.userName,
      pass: data.pass,
    });
    return NextResponse.json(
      { newVoter, message: "Vote recorded successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error creating voter: " + (error as Error).message },

      { status: 500 }
    );
  }
}
