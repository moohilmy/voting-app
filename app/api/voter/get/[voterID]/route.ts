
import { connectDB } from "@/lib";
import { NextRequest } from "next/server";
import { getVoterbyVoterID } from "@/controllers/voteController";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ voterID: string }> }
) {
  await connectDB();
  return await getVoterbyVoterID(req,context);
}
