import { NextRequest, NextResponse } from "next/server";
import {Voter} from "@/Modules/Voter"; // عدّل المسار حسب المشروع
import { connectDB } from "@/lib";


// POST route for Telegram Webhook
export async function POST(req: NextRequest) {
    await connectDB()
  try {
    
    const secret = req.headers.get("x-telegram-bot-api-secret-token");
    
    if (process.env.TELEGRAM_SECRET_TOKEN && secret !== process.env.TELEGRAM_SECRET_TOKEN) {
      return NextResponse.json({ status: 401, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const message = body.message;
    if (!message || !message.text) {
      return NextResponse.json({ ok: true });
    }

    const chatId = message.chat.id;
    const text = message.text.trim();
    const voter = await Voter.findOne({ OTP: text });
    if (!voter) {
      await sendMessage(chatId, "❌ Invalid OTP. Please try again.");
      return NextResponse.json({ ok: true });
    }

    voter.isVerified = true;
    await voter.save();

    await sendMessage(chatId, `✅ Verified successfully!\nYour Voter ID: ${voter.voterId}`);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("BOT WEBHOOK ERROR:", err);
    return NextResponse.json({ ok: false, error: (err as Error).message }, { status: 500 });
  }
}

async function sendMessage(chatId: number, text: string) {
  return fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
}
