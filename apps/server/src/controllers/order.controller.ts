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
                        productId: parseInt(item.id),
                        quantity: parseInt(item.quantity),
                        price: Math.round(parseFloat(item.price) * 100),
                        sizeId: item.selectedSizeId ? parseInt(item.selectedSizeId) : null,
                        colorId: item.selectedColorId ? parseInt(item.selectedColorId) : null,
                    })),
                }
            }
        });

        // Decrement stock for each item
        for (const item of cart) {
            const pid = parseInt(item.id);
            const sid = item.selectedSizeId ? parseInt(item.selectedSizeId) : null;
            const cid = item.selectedColorId ? parseInt(item.selectedColorId) : null;
            const qty = parseInt(item.quantity) || 1;

            if (pid && sid && cid) {
                const pq = await tx.product_quantity.findFirst({
                    where: { productId: pid, sizeId: sid, colorId: cid },
                });

                if (pq) {
                    await tx.product_quantity.update({
                        where: { id: pq.id },
                        data: { quantity: { decrement: qty } },
                    });
                } else {
                    throw new Error(`Variant not found for Product: ${pid}, Size: ${sid}, Color: ${cid}. Order cancelled.`);
                }
            }
        }

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

export const searchOrders = async (req: Request, res: Response) => {
    const { q } = req.query;
    if (typeof q !== "string") {
        return res.status(400).json({ message: "Invalid search query" });
    }

    try {
        const orderId = parseInt(q);
        const where: any = { OR: [] };
        
        // Add ID search if it's a number
        if (!isNaN(orderId)) {
            where.OR.push({ id: { equals: orderId } });
        }

        // Add Status search ONLY if it matches a valid enum value
        const validStatuses = ["PENDING", "COMPLETED", "FAILED", "CANCELED"];
        const upperQuery = q.toUpperCase();
        if (validStatuses.includes(upperQuery)) {
             where.OR.push({ status: { equals: upperQuery as any } });
        }

        // Search in email/customer name via relations
        // This is more complex in Prisma but possible.
        // For simplicity, we stick to ID and Exact Status match for now.
        // If we want partial match on status, we can't because it's an ENUM in DB.

        // If no valid search criteria added (e.g. searching "shoes" which isn't ID or Status), return empty
        if (where.OR.length === 0) {
             return res.json([]);
        }

        const orders = await prisma.order.findMany({
            where,
            include: {
                order_item: {
                    include: {
                        product: true
                    }
                },
                customer: {
                    include: {
                        user: true
                    }
                }
            },
            orderBy: { created_at: 'desc' },
            take: 10
        });

        res.json(orders);
    } catch (error) {
        console.error("Error searching orders:", error);
        res.status(500).json({ error: "Failed to search orders" });
    }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        order_item: {
          include: {
            product: true,
            size: true,
            color: true,
          },
        },
        customer: {
            include: {
                user: true
            }
        }
      },
      orderBy: {
        created_at: "desc",
      },
    });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

export const getOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
        order_item: {
          include: {
            product: {
                include: {
                    images: true
                }
            },
            size: true,
            color: true,
          },
        },
        customer: {
          include: {
            user: true,
          },
        },
      },
    });
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: "Failed to fetch order" });
  }
};
