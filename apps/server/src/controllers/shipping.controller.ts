import { Request, Response } from "express";
import { getShipmentOptions as getShipmentOptionsService } from "../services/shipping.service";

export const getShipmentOptions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { country_code, product_code, zipcode, address, city } = req.query;

    if (
      typeof country_code !== "string" ||
      typeof product_code !== "string" ||
      typeof zipcode !== "string" ||
      typeof address !== "string" ||
      typeof city !== "string"
    ) {
      res.status(400).json({ message: "Invalid or missing query params." });
      return;
    }

    const user_id = process.env.SHIPMONDO_SANDBOX_USER_ID || "";
    const password = process.env.SHIPMONDO_SANDBOX_PASSWORD || "";
    if (!user_id || !password) {
      res
        .status(500)
        .json({ message: "Shipmondo credentials are not configured." });
      return;
    }

    const data = await getShipmentOptionsService(
      user_id,
      password,
      country_code,
      product_code,
      zipcode,
      address,
      city
    );

    res.status(200).json(data);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    res
      .status(500)
      .json({ message: "Error fetching shipment options", error: msg });
  }
};
