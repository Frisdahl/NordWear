import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const validateGiftCard = async (req: Request, res: Response) => {
  const { code } = req.body;

  try {
    const giftCard = await prisma.giftCard.findUnique({
      where: { code },
    });

    if (!giftCard) {
      return res.status(404).json({ message: "Invalid gift card code" });
    }

    if (!giftCard.isEnabled) {
      return res.status(400).json({ message: "Gift card is disabled" });
    }

    if (giftCard.balance <= 0) {
      return res.status(400).json({ message: "Gift card has no balance" });
    }

    res.json(giftCard);
  } catch (error) {
    console.error("Error validating gift card:", error);
    res.status(500).json({ error: "Failed to validate gift card" });
  }
};

export const createGiftCard = async (req: Request, res: Response) => {
  const { code, amount, expiresAt } = req.body;

  try {
    const existing = await prisma.giftCard.findUnique({ where: { code } });
    if (existing) {
      return res.status(400).json({ message: "Code already exists" });
    }

    const amountInCents = Math.round(parseFloat(amount.replace(",", ".")) * 100);

    const giftCard = await prisma.giftCard.create({
      data: {
        code,
        balance: amountInCents,
        initialAmount: amountInCents,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    res.json(giftCard);
  } catch (error) {
    console.error("Error creating gift card:", error);
    res.status(500).json({ error: "Failed to create gift card" });
  }
};

export const getGiftCards = async (req: Request, res: Response) => {
  try {
    const giftCards = await prisma.giftCard.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(giftCards);
  } catch (error) {
    console.error("Error fetching gift cards:", error);
    res.status(500).json({ error: "Failed to fetch gift cards" });
  }
};
