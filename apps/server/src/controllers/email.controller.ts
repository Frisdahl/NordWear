import { Request, Response } from "express";
import sgMail from "@sendgrid/mail";
import Stripe from "stripe";
import "dotenv/config";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const sendOrderConfirmation = async (req: Request, res: Response) => {
  const { session_id } = req.body;

  try {
    const session = await stripe.checkout.sessions.retrieve(
      session_id as string,
      {
        expand: ["line_items.data.price.product", "customer"],
      }
    );

    if (!session.customer_details?.email) {
      return res.status(400).json({ error: "Customer email not found" });
    }

    const msg = {
      to: session.customer_details.email,
      from: "nordwear.kundeservice@gmail.com", // This should be a verified sender in your SendGrid account
      subject: "Order Confirmation",
      html: `
        <h1>Tak for din ordre!</h1>
        <p>Din ordre er blevet bekræftet.</p>
        <h2>Ordredetaljer</h2>
        <h3>Kundeinformation</h3>
        <p><strong>Navn:</strong> ${session.customer_details.name}</p>
        <p><strong>Email:</strong> ${session.customer_details.email}</p>
        <h3>Leveringsadresse</h3>
        <p>${session.customer_details.address?.line1}${
        session.customer_details.address?.line2
          ? `, ${session.customer_details.address?.line2}`
          : ""
      }</p>
        <p>${session.customer_details.address?.postal_code} ${
        session.customer_details.address?.city
      }</p>
        <p>${session.customer_details.address?.country}</p>
        <ul>
          ${session.line_items?.data
            .map(
              (item: any) => `
            <li>
              <p>${item.description} - ${item.quantity} stk.</p>
              <p>Pris: ${item.price.unit_amount / 100} DKK</p>
            </li>
          `
            )
            .join("")}
        </ul>
        <h3>Total: ${(session.amount_total ?? 0) / 100} DKK</h3>
      `,
    };

    await sgMail.send(msg);
    res.status(200).json({ message: "Email sent" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
};