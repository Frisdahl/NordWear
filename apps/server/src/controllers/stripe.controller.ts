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

  const line_items = cart.map((item: any) => ({
    price_data: {
      currency: "dkk",
      product_data: { name: item.name },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }));

  const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";

  const condensedCart = cart.map((item: any) => ({
    id: item.id,
    quantity: item.quantity,
    selectedSize: item.selectedSize,
    price: item.price,
    colorId: item.colorId, // Assuming colorId is needed and passed
    sizeId: item.sizeId, // Assuming sizeId is needed and passed
    name: item.name // Include name for logging or easier debugging in webhook
  }));

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
      customerId: customerId ? customerId.toString() : null, // Pass customerId to webhook
      cart: JSON.stringify(condensedCart), // Pass condensed cart
      giftCardCode: giftCardCode || null,
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
      req.body, // Use req.body directly as it contains the raw buffer from express.raw()
      sig as string,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session;
      console.log(`Checkout session completed: ${session.id}`);
      // Ensure metadata exists and is parsed
      const customerId = session.metadata?.customerId;
      const cartItems = session.metadata?.cart
        ? JSON.parse(session.metadata.cart)
        : [];

      if (cartItems.length > 0) {
        await createOrderInDB(session, customerId, cartItems);
      } else {
        console.warn(
          "Missing cart items in session metadata for order creation."
        );
      }
      break;
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`PaymentIntent was successful: ${paymentIntent.id}`);
      // Handle successful payment here, e.g., fulfill the order
      break;
    case "payment_method.attached":
      const paymentMethod = event.data.object as Stripe.PaymentMethod;
      console.log(`PaymentMethod was attached: ${paymentMethod.id}`);
      // Handle payment method attached event
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  return res.json({ received: true });
};

// Function to create order in DB
const createOrderInDB = async (
  session: Stripe.Checkout.Session,
  customerId: string | undefined,
  cartItems: any[]
) => {
  const giftCardCode = session.metadata?.giftCardCode;
  const discountAmount = session.metadata?.discountAmount
    ? parseInt(session.metadata.discountAmount)
    : 0;

  try {
    await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          customerId: customerId ? parseInt(customerId) : null,
          amount: session.amount_total!,
          currency: session.currency!,
          status: "COMPLETED",
          paymentIntentId: session.payment_intent as string,
          customerDetails: (session.customer_details as any) || null,
          shippingDetails: ((session as any).shipping_details as any) || null,
          discountAmount: discountAmount,
          giftCardCode: giftCardCode || null,
          order_item: {
            create: cartItems.map((item: any) => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price,
              sizeId: item.sizeId ? parseInt(item.sizeId) : null,
              colorId: item.colorId ? parseInt(item.colorId) : null,
            })),
          },
        },
      });

      if (giftCardCode && discountAmount > 0) {
        await tx.giftCard.update({
          where: { code: giftCardCode },
          data: {
            balance: { decrement: discountAmount },
          },
        });
      }
      console.log("Order created successfully:", order.id);
    });
    // Here you might also send an email confirmation, update inventory, etc.

    // Also clear the user's cart on the client-side (this would be through a separate API call or a direct clear if it's not server-backed)
    // For now, this is server-side order creation. Client-side cart clearing is a different concern.
  } catch (error) {
    console.error("Error creating order in DB:", error);
  }
};
