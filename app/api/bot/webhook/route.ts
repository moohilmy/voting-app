import { NextRequest, NextResponse } from "next/server";
import { Voter } from "@/Modules/Voter";
import { connectDB } from "@/lib";

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const body = await req.json();
    if (!body.message?.text) return NextResponse.json({ ok: true });

    const telegramID: number = body.message.from.id;
    const telegramUsername =
      body.message.from.username?.toLowerCase() || null;
    const chatId = body.message.chat.id;
    const text = body.message.text.trim();


    let voter = await Voter.findOne({
      telegramFingerprint: telegramID,
    });

    if (!voter) {
      if (!telegramUsername) {
        await sendMessage(chatId, "❌ لازم تحط Username في تلجرام.");
        return NextResponse.json({ ok: true });
      }

      voter = await Voter.findOne({
        telegramUsername,
        telegramFingerprint: null,
      });

      if (!voter) {
        await sendMessage(chatId, "❌ انت غير مسجل كناخب.");
        return NextResponse.json({ ok: true });
      }


      voter.telegramFingerprint = telegramID;
      await voter.save();
    }

    if (voter.OTP !== text) {
      await sendMessage(chatId, "❌ كود التحقق غير صحيح.");
      return NextResponse.json({ ok: true });
    }

    voter.isVerified = true
    await voter.save();

    await sendMessage(
      chatId,
      `✅ تم التحقق بنجاح\nرقم الناخب: ${voter.voterId}`
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
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
