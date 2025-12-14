import { LoginAdmin } from "@/controllers/adminController";
import { connectDB } from "@/lib";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  await connectDB();

  return await LoginAdmin(req);
}
