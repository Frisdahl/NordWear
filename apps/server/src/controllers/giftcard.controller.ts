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

export const getGiftCard = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const giftCard = await prisma.giftCard.findUnique({
      where: { id: parseInt(id) },
    });
    if (!giftCard) {
      return res.status(404).json({ error: "Gift card not found" });
    }
    res.json(giftCard);
  } catch (error) {
    console.error("Error fetching gift card:", error);
    res.status(500).json({ error: "Failed to fetch gift card" });
  }
};

export const updateGiftCard = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { code, amount, expiresAt, isEnabled } = req.body;

  try {
    const amountInCents = amount ? Math.round(parseFloat(amount.replace(",", ".")) * 100) : undefined;

    const giftCard = await prisma.giftCard.update({
      where: { id: parseInt(id) },
      data: {
        code,
        balance: amountInCents,
        initialAmount: amountInCents,
        expiresAt: expiresAt ? new Date(expiresAt) : undefined,
        isEnabled,
      },
    });

    res.json(giftCard);
  } catch (error) {
    console.error("Error updating gift card:", error);
    res.status(500).json({ error: "Failed to update gift card" });
  }
};

export const batchUpdateGiftCards = async (req: Request, res: Response) => {
  const { ids, data } = req.body;

  try {
    await prisma.giftCard.updateMany({
      where: {
        id: { in: ids },
      },
      data: data,
    });
    res.json({ message: "Gift cards updated successfully" });
  } catch (error) {
    console.error("Error batch updating gift cards:", error);
    res.status(500).json({ error: "Failed to batch update gift cards" });
  }
};

export const deleteGiftCards = async (req: Request, res: Response) => {
  const { ids } = req.body;

  try {
    await prisma.giftCard.deleteMany({
      where: {
        id: { in: ids },
      },
    });
    res.json({ message: "Gift cards deleted successfully" });
  } catch (error) {
    console.error("Error deleting gift cards:", error);
    res.status(500).json({ error: "Failed to delete gift cards" });
  }
};

export const searchGiftCards = async (req: Request, res: Response) => {
    const { q } = req.query;
    if (typeof q !== "string") {
        return res.status(400).json({ message: "Invalid search query" });
    }

    try {
        const giftCards = await prisma.giftCard.findMany({
            where: {
                code: {
                    contains: q,
                }
            },
            take: 10
        });
        res.json(giftCards);
    } catch (error) {
        console.error("Error searching gift cards:", error);
        res.status(500).json({ error: "Failed to search gift cards" });
    }
};