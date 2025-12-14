import { NextRequest, NextResponse } from "next/server";
import { Voter } from "@/Modules/Voter";
import { connectDB } from "@/lib";
import { VotingInfo } from "@/Modules/VotingInfo";

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const secret = req.headers.get("x-telegram-bot-api-secret-token");
    if (
      process.env.TELEGRAM_SECRET_TOKEN &&
      secret !== process.env.TELEGRAM_SECRET_TOKEN
    ) {
      return NextResponse.json(
        { status: 401, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    if (!body.message || !body.message.text)
      return NextResponse.json({ ok: true });

    const telegramID: number = body.message.from.id;
    const chatId = body.message.chat.id;
    const text = body.message.text.trim();
    if (text === "/start") {
      await sendMessage(chatId, `اهلا بيك في انتخابات العتبه ابعت الرقم`);
      return NextResponse.json({ ok: true });
    }
    const res = await fetch(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/getChat?chat_id=${telegramID}`
    );
    const data = await res.json();
    const telegramUserName: string = data.result.username;

    const voter = await Voter.findOne({
      telegramID: telegramUserName.toLowerCase(),
    });
    if (!voter) {
      await sendMessage(chatId, `انت مش مسجل روح سجل الاول`);

      return NextResponse.json({ ok: true });
    }
    const verifyTelgramFingerPrint = await Voter.findOne({
      telegramFingerprint: telegramID,
    });

    if (verifyTelgramFingerPrint) {
      await sendMessage(
        chatId,
        `انت مسجل و ده اليوزر الي سجلت بيه متحاولش تغش ☺️ \n ${verifyTelgramFingerPrint.telegramID}`
      );

      return NextResponse.json({ ok: true });
    }

    if (voter.telegramFingerprint === null) {
      await sendMessage(
        chatId,
        `اهلا بيك في انتخابات العتبه لحظه و يوصل الرقم`
      );
    }

    if (voter.OTP !== text) {
      await sendMessage(chatId, `الكود غلط حاول تتاكد منه \n `);

      return NextResponse.json({ ok: true });
    }
    await VotingInfo.updateOne(
      {},
      {
        $inc: { voterhaveRight: 1 },
      }
    );
    voter.telegramFingerprint = telegramID;
    voter.isVerified = true;
    await voter.save();

    await sendMessage(
      chatId,
      `✅ Verified successfully!\nYour Voter ID: ${voter.voterId}\n
      go to vote\n
      https://voting-app-azure-alpha.vercel.app/voting
      `
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
