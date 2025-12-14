import mongoose from "mongoose";
import { NextResponse } from "next/server";

export function validateObjectId(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
  }

  return null; 
}