import { checkIsAdmin } from "@/controllers/adminController";
import { connectDB } from "@/lib";
import { NextRequest } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ adminID: string }> }
) {
  await connectDB();

  return await checkIsAdmin(req,context);
}
