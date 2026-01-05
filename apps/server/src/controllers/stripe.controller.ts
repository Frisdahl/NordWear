import { Request, Response } from "express";
import Stripe from "stripe";
import "dotenv/config";
import { PrismaClient } from "@prisma/client"; // Import PrismaClient
import "express"; // Import to ensure custom type declarations for Express Request are picked up

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const prisma = new PrismaClient(); // Initialize PrismaClient

export const getCheckoutSession = async (req: Request, res: Response) => {
  const { session_id } = req.query;

  try {
    const session = await stripe.checkout.sessions.retrieve(
      session_id as string,
      {
        expand: ["line_items.data.price.product"],
      }
    );
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve session" });
  }
};

export const createCheckoutSession = async (req: Request, res: Response) => {
  const { cart, customerId, giftCardCode } = req.body; // Expect customerId and giftCardCode

  // ✅ 1. Pre-payment Stock Check
  try {
    for (const item of cart) {
      const pid = parseInt(item.id);
      const sid = item.selectedSizeId ? parseInt(item.selectedSizeId) : null;
      // Default to color 1 if missing
      const cid = item.selectedColorId ? parseInt(item.selectedColorId) : 1;
      const qty = parseInt(item.quantity) || 1;

      if (pid && sid) {
        const pq = await prisma.product_quantity.findFirst({
          where: { productId: pid, sizeId: sid, colorId: cid },
        });

        if (!pq || pq.quantity < qty) {
          return res.status(400).json({ 
            error: `Beklager, der er ikke nok på lager af ${item.name}. (Tilgængelig: ${pq?.quantity || 0})` 
          });
        }
      }
    }
  } catch (error) {
    console.error("Stock check error:", error);
    return res.status(500).json({ error: "Fejl ved lager-tjek" });
  }

  const line_items = cart.map((item: any) => ({
    price_data: {
      currency: "dkk",
      product_data: { 
        name: item.name,
        images: item.imageUrl ? [item.imageUrl] : [],
      },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }));

  const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";

  const condensedCart = cart.map((item: any) => {
    if (!item.id) {
      console.warn(`Item missing ID in cart: ${item.name}`);
    }
    return {
      id: item.id,
      quantity: item.quantity,
      price: item.price,
      colorId: item.selectedColorId || null,
      sizeId: item.selectedSizeId || null,
    };
  });

  const cartJson = JSON.stringify(condensedCart);
  if (cartJson.length > 500) {
    console.warn("Metadata 'cart' exceeds 500 characters. Order creation via webhook might fail.");
  }

  let discounts = undefined;
  let discountAmount = 0;

  if (giftCardCode) {
    const giftCard = await prisma.giftCard.findUnique({
      where: { code: giftCardCode },
    });

    if (giftCard && giftCard.isEnabled && giftCard.balance > 0) {
      const cartTotal = cart.reduce(
        (acc: number, item: any) => acc + item.price * 100 * item.quantity,
        0
      );
      discountAmount = Math.min(giftCard.balance, cartTotal);

      // Check if order is fully covered
      if (cartTotal - discountAmount <= 0) {
        return res.json({ freeOrder: true, giftCardCode });
      }

      // Create a unique coupon for this session
      if (discountAmount > 0) {
        const coupon = await stripe.coupons.create({
          amount_off: Math.round(discountAmount),
          currency: "dkk",
          duration: "once",
          name: `Gift Card ${giftCardCode}`,
        });
        discounts = [{ coupon: coupon.id }];
      }
    }
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items,
    discounts,
    success_url: `${clientUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${clientUrl}/cancel`,
    shipping_address_collection: {
      allowed_countries: ["DK", "SE", "DE", "NO", "NL", "FR", "BE"],
    },
    phone_number_collection: { enabled: true },
    metadata: {
      customerId: customerId ? customerId.toString() : "", 
      cart: cartJson,
      giftCardCode: giftCardCode || "",
      discountAmount: discountAmount.toString(),
    },
  });

  res.json({ url: session.url }); // <- brug url
};

// New webhook handler
export const stripeWebhookHandler = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"];
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig as string,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(`Processing checkout.session.completed for session: ${session.id}`);
        
        const customerId = session.metadata?.customerId;
        const cartItemsRaw = session.metadata?.cart;
        
        if (!cartItemsRaw) {
          console.error(`No cart items found in metadata for session ${session.id}`);
          break;
        }

        let cartItems;
        try {
          cartItems = JSON.parse(cartItemsRaw);
        } catch (e) {
          console.error(`Failed to parse cart metadata for session ${session.id}: ${cartItemsRaw}`);
          break;
        }

        if (Array.isArray(cartItems) && cartItems.length > 0) {
          // IMPORTANT: Use await here to ensure DB transaction finishes before responding
          await createOrderInDB(session, customerId, cartItems);
        } else {
          console.warn(`Cart items empty or invalid for session ${session.id}`);
        }
        break;

      case "payment_intent.succeeded":
        console.log(`PaymentIntent succeeded: ${event.data.object.id}`);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error: any) {
    console.error(`Error handling webhook event ${event.type}:`, error);
    // Return 500 so Stripe retries if it's a transient error
    return res.status(500).json({ error: error.message });
  }

  return res.json({ received: true });
};

// Function to create order in DB
const createOrderInDB = async (
  session: Stripe.Checkout.Session,
  customerId: string | undefined,
  cartItems: any[]
) => {
  const giftCardCode = session.metadata?.giftCardCode || null;
  const discountAmount = session.metadata?.discountAmount
    ? parseInt(session.metadata.discountAmount)
    : 0;
  const paymentIntentId = session.payment_intent as string || `SESSION-${session.id}`;

  console.log(`Starting DB transaction for order. Session: ${session.id}, Items: ${cartItems.length}`);

  try {
    await prisma.$transaction(async (tx) => {
      // ✅ Idempotency Check: prevent duplicate orders for the same payment intent
      const existingOrder = await tx.order.findUnique({
        where: { paymentIntentId: paymentIntentId }
      });

      if (existingOrder) {
        console.log(`Order already exists for paymentIntentId: ${paymentIntentId}. Skipping.`);
        return;
      }

      // Create the order
      let parsedCustomerId: number | null = null;
      if (customerId && customerId !== "null" && customerId !== "undefined" && customerId !== "") {
        const parsed = parseInt(customerId);
        if (!isNaN(parsed)) {
          parsedCustomerId = parsed;
        }
      }

      const order = await tx.order.create({
        data: {
          customerId: parsedCustomerId,
          amount: session.amount_total || 0,
          currency: session.currency || "dkk",
          status: "COMPLETED",
          paymentIntentId: paymentIntentId,
          customerDetails: (session.customer_details as any) || null,
          shippingDetails: (session as any).shipping_details || (session as any).collected_information?.shipping_details || null,
          discountAmount: discountAmount,
          giftCardCode: giftCardCode,
          order_item: {
              const pid = parseInt(item.id);
              const priceRaw = parseFloat(item.price);
              if (isNaN(pid)) {
                console.error(`Invalid Product ID found in cart item:`, item);
                throw new Error(`Invalid Product ID: ${item.id}`);
              }
              if (isNaN(priceRaw)) {
                console.error(`Invalid Price found in cart item:`, item);
                throw new Error(`Invalid Price for product ${pid}`);
              }
              return {
                productId: pid,
                quantity: parseInt(item.quantity) || 1,
                price: Math.round(priceRaw * 100), // convert to cents
                sizeId: item.sizeId ? parseInt(item.sizeId) : null,
                colorId: item.colorId ? parseInt(item.colorId) : null,
              };
          },
        },
      });

      // Update gift card if applicable
      if (giftCardCode && discountAmount > 0) {
        console.log(`Updating gift card ${giftCardCode}, decrementing ${discountAmount}`);
        await tx.giftCard.update({
          where: { code: giftCardCode },
          data: {
            balance: { decrement: discountAmount },
          },
        });
      }

      // Decrement stock for each item
      for (const item of cartItems) {
        const pid = parseInt(item.id);
        const sid = item.sizeId ? parseInt(item.sizeId) : null;
        // Default to color 1 if missing, as the product service hardcodes color 1 for everything
        const cid = item.colorId ? parseInt(item.colorId) : 1; 
        const qty = parseInt(item.quantity) || 1;

        if (pid && sid) {
          // Find the product_quantity record
          const pq = await tx.product_quantity.findFirst({
            where: {
              productId: pid,
              sizeId: sid,
              colorId: cid,
            },
          });

          if (pq) {
            await tx.product_quantity.update({
              where: { id: pq.id },
              data: {
                quantity: {
                  decrement: qty,
                },
              },
            });
            console.log(`Decremented stock for product ${pid}, size ${sid}, color ${cid} by ${qty}`);
          } else {
            console.warn(`Variant not found for Product: ${pid}, Size: ${sid}, Color: ${cid}. Stock not decremented.`);
          }
        }
      }
      
      console.log(`Order created successfully. DB ID: ${order.id}`);
    }, {
      timeout: 10000 // 10s timeout for the transaction
    });
  } catch (error) {
    console.error(`Transaction failed for session ${session.id}:`, error);
    throw error; // Re-throw so the caller (webhook handler) catches it
  }
};
