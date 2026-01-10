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
    
        console.log("DEBUG Email: Line Items:", JSON.stringify(session.line_items?.data, null, 2));
    
        if (!session.customer_details?.email) {              return res.status(400).json({ error: "Customer email not found" });
            }
        
            const shippingAddress = (session as any).shipping_details?.address || 
                                    (session as any).collected_information?.shipping_details?.address || 
                                    session.customer_details?.address;
        
            const msg = {          to: session.customer_details.email,

          from: "nordwear.kundeservice@gmail.com",

          subject: `Ordre #${session.metadata?.orderId || "Bekræftelse"}`,

          html: `

            <!DOCTYPE html>

            <html>

            <head>

              <meta charset="utf-8">

              <meta name="viewport" content="width=device-width, initial-scale=1.0">

              <title>Ordrebekræftelse</title>

              <style>

                body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }

                .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 0; border-radius: 4px; overflow: hidden; }

                .header { background-color: #1c1c1c; padding: 30px; text-align: center; }

                .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 2px; }

                .content { padding: 40px 30px; }

                .greeting { font-size: 18px; color: #333333; margin-bottom: 20px; }

                .order-info { margin-bottom: 30px; color: #666666; font-size: 14px; line-height: 1.6; }

                .table-container { width: 100%; margin-bottom: 30px; }

                table { width: 100%; border-collapse: collapse; }

                th { text-align: left; padding: 10px; border-bottom: 2px solid #eeeeee; color: #333333; font-size: 12px; text-transform: uppercase; }

                td { padding: 15px 10px; border-bottom: 1px solid #eeeeee; color: #666666; font-size: 14px; }

                .total-row td { border-bottom: none; color: #333333; font-weight: 600; font-size: 16px; padding-top: 20px; }

                .footer { background-color: #f9f9f9; padding: 20px; text-align: center; color: #999999; font-size: 12px; }

                .button { display: inline-block; background-color: #1c1c1c; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-size: 14px; font-weight: 600; margin-top: 20px; }

                .address-section { margin-top: 30px; border-top: 1px solid #eeeeee; padding-top: 20px; }

                .address-block { margin-bottom: 20px; }

                .address-title { font-size: 14px; font-weight: 600; color: #333333; margin-bottom: 10px; text-transform: uppercase; }

                .address-text { font-size: 14px; color: #666666; line-height: 1.6; }

              </style>

            </head>

            <body>

              <div class="container">

                <div class="header">

                  <h1>NORDWEAR</h1>

                </div>

                <div class="content">

                  <h2 class="greeting">Tak for din ordre, ${session.customer_details.name}!</h2>

                  <p class="order-info">

                    Vi har modtaget din ordre og er gået i gang med at pakke den. Du modtager en mail mere, så snart pakken er på vej.

                  </p>

    

                                <div class="table-container">

    

                                  <table cellpadding="0" cellspacing="0">

    

                                    <thead>

    

                                      <tr>

    

                                        <th width="15%"></th>

    

                                        <th width="45%">Produkt</th>

    

                                        <th width="20%" style="text-align: center;">Antal</th>

    

                                        <th width="20%" style="text-align: right;">Pris</th>

    

                                      </tr>

    

                                    </thead>

    

                                                      <tbody>

    

                                                        ${session.line_items?.data

    

                                                          .map(

    

                                                            (item: any) => {

    

                                                              let imageUrl = item.price.product.images?.[0];

    

                                                              if (imageUrl && imageUrl.startsWith('/')) {

    

                                                                 imageUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}${imageUrl}`;

    

                                                              }

    

                                                              return `

    

                                                                                <tr>

    

                                                                                  <td style="vertical-align: middle;">

    

                                                                                    ${imageUrl ? `<img src="${imageUrl}" alt="${item.description}" width="50" style="border-radius: 4px; display: block; width: 50px; height: auto;">` : ''}

    

                                                                                  </td>

    

                                                                                  <td style="vertical-align: middle;">

    

                                                              <div style="font-weight: 600; color: #333;">${

    

                                                                item.description

    

                                                              }</div>

    

                                                            </td>

    

                                                            <td style="text-align: center; vertical-align: middle;">${item.quantity}</td>

    

                                                            <td style="text-align: right; vertical-align: middle;">${(

    

                                                              item.price.unit_amount / 100

    

                                                            ).toLocaleString("da-DK", {

    

                                                              minimumFractionDigits: 2,

    

                                                            })} kr.</td>

    

                                                          </tr>

    

                                                        `;

    

                                                            }

    

                                                          )

    

                                                          .join("")}

    

                                                        <tr class="total-row">

    

                                        <td colspan="3" style="text-align: right; padding-right: 20px;">Total</td>

    

                                        <td style="text-align: right;">${(

    

                                          (session.amount_total ?? 0) / 100

    

                                        ).toLocaleString("da-DK", {

    

                                          minimumFractionDigits: 2,

    

                                        })} kr.</td>

    

                                      </tr>

    

                                    </tbody>

    

                                  </table>

    

                                </div>

    

                  <div class="address-section">

                    <div class="address-block">

                      <div class="address-title">Leveringsadresse</div>

                      <div class="address-text">

                        ${session.customer_details.name}<br>

                        ${shippingAddress?.line1 || ''}<br>

                        ${

                          shippingAddress?.line2

                            ? `${shippingAddress?.line2}<br>`

                            : ""

                        }

                        ${shippingAddress?.postal_code || ''} ${

            shippingAddress?.city || ''

          }<br>

                        ${shippingAddress?.country || ''}

                      </div>

                    </div>

                  </div>

    

                  <div style="text-align: center;">

                    <a href="${

                      process.env.CLIENT_URL || "http://localhost:3000"

                    }" class="button" style="color: #ffffff;">Besøg butikken</a>

                  </div>

                </div>

                <div class="footer">

                  <p>&copy; ${new Date().getFullYear()} NordWear. Alle rettigheder forbeholdes.</p>

                  <p>Har du spørgsmål? Kontakt os på <a href="mailto:kontakt@nordwear.dk" style="color: #666; text-decoration: underline;">kontakt@nordwear.dk</a></p>

                </div>

              </div>

            </body>

            </html>

          `,

        };

    await sgMail.send(msg);
    res.status(200).json({ message: "Email sent" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
};

/**
 * Sends an order confirmation email directly using a Stripe Session object.
 * This version is designed to be called from backend logic (like webhooks) 
 * where req/res objects are not available or needed for the email trigger.
 */
export const sendOrderConfirmationEmailFromWebhook = async (session: Stripe.Checkout.Session) => {
  try {
    // Re-retrieve to ensure line items are expanded (they usually aren't in the webhook event object)
    const expandedSession = await stripe.checkout.sessions.retrieve(
      session.id,
      {
        expand: ["line_items.data.price.product"],
      }
    );

    console.log(`[Email] Sending confirmation for session: ${session.id}`);

    if (!expandedSession.customer_details?.email) {
      console.warn(`[Email] No customer email found for session: ${session.id}`);
      return false;
    }

    const shippingAddress = (expandedSession as any).shipping_details?.address || 
                            (expandedSession as any).collected_information?.shipping_details?.address || 
                            expandedSession.customer_details?.address;

    const msg = {
      to: expandedSession.customer_details.email,
      from: "nordwear.kundeservice@gmail.com",
      subject: `Ordrebekræftelse - NordWear`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 4px; overflow: hidden; }
            .header { background-color: #1c1c1c; padding: 30px; text-align: center; }
            .header h1 { color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 2px; }
            .content { padding: 40px 30px; }
            .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .table th { text-align: left; padding: 10px; border-bottom: 2px solid #eeeeee; }
            .table td { padding: 15px 10px; border-bottom: 1px solid #eeeeee; }
            .total { font-weight: bold; font-size: 18px; text-align: right; padding-top: 20px; }
            .footer { background-color: #f9f9f9; padding: 20px; text-align: center; color: #999999; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header"><h1>NORDWEAR</h1></div>
            <div class="content">
              <h2>Tak for din ordre, ${expandedSession.customer_details.name}!</h2>
              <p>Vi har modtaget din betaling og er gået i gang med at pakke din ordre.</p>
              
              <table class="table">
                <thead><tr><th>Produkt</th><th>Antal</th><th>Pris</th></tr></thead>
                <tbody>
                  ${expandedSession.line_items?.data.map((item: any) => `
                    <tr>
                      <td>${item.description}</td>
                      <td>${item.quantity}</td>
                      <td>${(item.price.unit_amount / 100).toLocaleString("da-DK")} kr.</td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
              
              <div class="total">Total: ${(expandedSession.amount_total! / 100).toLocaleString("da-DK")} kr.</div>

              <div style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
                <strong>Leveringsadresse:</strong><br>
                ${expandedSession.customer_details.name}<br>
                ${shippingAddress?.line1 || ''}<br>
                ${shippingAddress?.postal_code || ''} ${shippingAddress?.city || ''}
              </div>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} NordWear. Alle rettigheder forbeholdes.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await sgMail.send(msg);
    console.log(`[Email] Confirmation sent to ${expandedSession.customer_details.email}`);
    return true;
  } catch (error) {
    console.error("[Email] Error sending confirmation from webhook:", error);
    return false;
  }
};

export const sendGiftCardEmail = async (
  email: string,
  code: string,
  amount: number
) => {
  try {
    const msg = {
      to: email,
      from: "nordwear.kundeservice@gmail.com",
      subject: "Her er dit gavekort!",
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; color: #1c1c1c;">
          <h1>Velkommen til NordWear!</h1>
          <p>Tak fordi du tilmeldte dig vores nyhedsbrev.</p>
          <p>Som lovet er her dit gavekort, som giver dig en rabat på din næste ordre:</p>
          
          <div style="background-color: #f2f1f0; padding: 20px; margin: 20px 0; border-radius: 8px;">
            <h2 style="margin: 0; font-size: 24px;">${amount} DKK</h2>
            <p style="margin: 10px 0 0; font-weight: bold; font-size: 18px; letter-spacing: 2px;">${code}</p>
          </div>

          <p>Brug koden ved betaling for at indløse din rabat.</p>
          <a href="${
            process.env.CLIENT_URL || "http://localhost:3000"
          }" style="display: inline-block; background-color: #1c1c1c; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin-top: 20px;">Shop Nu</a>
        </div>
      `,
    };

    await sgMail.send(msg);
    console.log(`Gift card email sent to ${email}`);
    return true;
  } catch (error) {
    console.error("Error sending gift card email:", error);
    return false;
  }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  try {
    const resetLink = `${
      process.env.CLIENT_URL || "http://localhost:3000"
    }/reset-password?token=${token}`;

    const msg = {
      to: email,
      from: "nordwear.kundeservice@gmail.com",
      subject: "Nulstilling af adgangskode",
      html: `
        <div style="font-family: Arial, sans-serif; color: #1c1c1c;">
          <h1>Nulstil adgangskode</h1>
          <p>Vi har modtaget en anmodning om at nulstille din adgangskode.</p>
          <p>Klik på knappen nedenfor for at nulstille den. Linket er gyldigt i 15 minutter.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="display: inline-block; background-color: #1c1c1c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Nulstil Adgangskode</a>
          </div>

          <p>Hvis du ikke har anmodet om dette, kan du se bort fra denne email.</p>
        </div>
      `,
    };

    await sgMail.send(msg);
    console.log(`Password reset email sent to ${email}`);
    return true;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return false;
  }
};
