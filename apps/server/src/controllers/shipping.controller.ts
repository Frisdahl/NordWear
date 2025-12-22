import { Request, Response } from "express";
import {
  getShipmondoProducts as getShipmondoProductsService,
  getShipmentOptions as getShipmentOptionsService,
  getShipmentRates as getShipmentRatesService,
} from "../services/shipping.service";

export const getShipmondoProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user_id = process.env.SHIPMONDO_SANDBOX_USER_ID || "";
    const password = process.env.SHIPMONDO_SANDBOX_PASSWORD || "";
    if (!user_id || !password) {
      res
        .status(500)
        .json({ message: "Shipmondo credentials are not configured." });
      return;
    }
    const data = await getShipmondoProductsService(user_id, password);
    res.status(200).json(data);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    res
      .status(500)
      .json({ message: "Error fetching shipmondo products", error: msg });
  }
};

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

export const getShipmentRates = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      sender_country_code,
      sender_zipcode,
      receiver_country_code,
      receiver_zipcode,
      product_codes,
      weight,
    } = req.body;
    if (
      typeof sender_country_code !== "string" ||
      typeof sender_zipcode !== "string" ||
      typeof receiver_country_code !== "string" ||
      typeof receiver_zipcode !== "string" ||
      !Array.isArray(product_codes) ||
      typeof weight !== "number"
    ) {
      res.status(400).json({ message: "Invalid or missing body params." });
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
    const data = await getShipmentRatesService(
      user_id,
      password,
      sender_country_code,
      sender_zipcode,
      receiver_country_code,
      receiver_zipcode,
      product_codes as string[],
      weight
    );
    res.status(200).json(data);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    res
      .status(500)
      .json({ message: "Error fetching shipment rates", error: msg });
  }
};
