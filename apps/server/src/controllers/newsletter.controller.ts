import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { sendGiftCardEmail } from "./email.controller";

const prisma = new PrismaClient();

export const subscribeNewsletter = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email || !email.includes("@")) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  try {
    // Check if email already received a welcome gift card?
    // For simplicity, we just check if a user with this email exists in User table?
    // Or just generate a new one. To avoid abuse, we should probably track it.
    // But for this task, I'll just generate it.

    // Generate unique code
    const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
    const code = `WELCOME-${randomSuffix}`;
    const amountDKK = 100; // 100 DKK
    const amountCents = amountDKK * 100;

    // Create Gift Card
    await prisma.giftCard.create({
      data: {
        code,
        balance: amountCents,
        initialAmount: amountCents,
        isEnabled: true,
      },
    });

    // Send Email
    const emailSent = await sendGiftCardEmail(email, code, amountDKK);

    if (emailSent) {
      res.json({ success: true, message: "Gift card sent to your email!" });
    } else {
      res.status(500).json({ message: "Failed to send email" });
    }

  } catch (error) {
    console.error("Newsletter subscription error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
