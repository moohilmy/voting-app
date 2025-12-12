import { createVote } from "@/controllers/votingController";
import { connectDB } from "@/lib";
import { NextRequest } from "next/server";


export async function POST(req: NextRequest){
    await connectDB()
    return await createVote(req)
}