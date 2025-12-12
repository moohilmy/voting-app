
import { connectDB } from "@/lib";
import { getALLCandidates } from "@/controllers/candidateController";

export async function GET(

) {
  await connectDB();
  return await getALLCandidates();
}
