import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createFreeOrder = async (req: Request, res: Response) => {
  const { cart, customerId, giftCardCode, shippingDetails, customerDetails } = req.body;

  if (!cart || cart.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  if (!giftCardCode) {
    return res.status(400).json({ message: "Gift card code required for free order" });
  }

  try {
    const giftCard = await prisma.giftCard.findUnique({ where: { code: giftCardCode } });

    if (!giftCard || !giftCard.isEnabled) {
      return res.status(400).json({ message: "Invalid or disabled gift card" });
    }

    const cartTotal = cart.reduce(
        (acc: number, item: any) => acc + item.price * 100 * item.quantity,
        0
      );

    if (giftCard.balance < cartTotal) {
        return res.status(400).json({ message: "Insufficient gift card balance" });
    }

    // Create Order
    await prisma.$transaction(async (tx) => {
        const order = await tx.order.create({
            data: {
                customerId: customerId ? parseInt(customerId) : null,
                amount: cartTotal,
                currency: "dkk",
                status: "COMPLETED",
                paymentIntentId: `FREE-${Date.now()}-${Math.random().toString(36).substring(7)}`, // Dummy ID
                customerDetails: customerDetails || null,
                shippingDetails: shippingDetails || null,
                discountAmount: cartTotal,
                giftCardCode: giftCardCode,
                order_item: {
                    create: cart.map((item: any) => ({
                        productId: item.id,
                        quantity: item.quantity,
                        price: item.price,
                        sizeId: item.sizeId ? parseInt(item.sizeId) : null,
                        colorId: item.colorId ? parseInt(item.colorId) : null,
                    })),
                }
            }
        });

        await tx.giftCard.update({
            where: { code: giftCardCode },
            data: { balance: { decrement: cartTotal } }
        });

        res.json({ success: true, orderId: order.id });
    });

  } catch (error) {
    console.error("Error creating free order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};
