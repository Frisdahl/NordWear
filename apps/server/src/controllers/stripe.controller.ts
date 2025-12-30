import { Request, Response } from "express";
import Stripe from "stripe";
import "dotenv/config";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const getCheckoutSession = async (req: Request, res: Response) => {
  const { session_id } = req.query;

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id as string, {
      expand: ["line_items.data.price.product"],
    });
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve session" });
  }
};

export const createCheckoutSession = async (req: Request, res: Response) => {
  const { cart } = req.body;

  const line_items = cart.map((item: any) => ({
    price_data: {
      currency: "dkk",
      product_data: { name: item.name },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }));

  const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items,
    success_url: `${clientUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${clientUrl}/cancel`,
  });

  res.json({ url: session.url }); // <- brug url
};
