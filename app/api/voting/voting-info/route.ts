import { connectDB } from "@/lib";
import { NextRequest } from "next/server";
import { getInfoVote } from "@/controllers/votingController";

export async function GET(
  req: NextRequest,
) {
  await connectDB();
  return await getInfoVote(req);
}
