import { NextRequest, NextResponse } from "next/server";
import { Voter } from "@/Modules/Voter";
import { connectDB } from "@/lib";

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const secret = req.headers.get("x-telegram-bot-api-secret-token");
    if (
      process.env.TELEGRAM_SECRET_TOKEN &&
      secret !== process.env.TELEGRAM_SECRET_TOKEN
    ) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    if (!body.message?.text) {
      return NextResponse.json({ ok: true });
    }

    const telegramID: number = body.message.from.id;
    const telegramUsername: string | undefined =
      body.message.from.username?.toLowerCase();

    const chatId = body.message.chat.id;
    const otp = body.message.text.trim();

    if (!telegramUsername) {
      await sendMessage(
        chatId,
        "❌ Please set a Telegram username in settings first."
      );
      return NextResponse.json({ ok: true });
    }

    const voter = await Voter.findOne({ telegramID: telegramUsername });

    if (!voter) {
      await sendMessage(chatId, "❌ Voter not found.");
      return NextResponse.json({ ok: true });
    }

 
    if (!voter.telegramFingerprint) {
      voter.telegramFingerprint = telegramID;
      await voter.save();
    } else {
      if (voter.telegramFingerprint !== telegramID) {
        await sendMessage(
          chatId,
          "🚫 This Telegram account is not authorized for this voter."
        );
        return NextResponse.json({ ok: true });
      }
    }

    if (voter.OTP !== otp) {
      await sendMessage(chatId, "❌ Invalid OTP.");
      return NextResponse.json({ ok: true });
    }

    voter.isVerified = true;
    await voter.save();

    await sendMessage(
      chatId,
      `✅ Verified successfully!\nYour Voter ID: ${voter.voterId}`
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("BOT WEBHOOK ERROR:", err);
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}


async function sendMessage(chatId: number, text: string) {
  return fetch(
    `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    }
  );
}
