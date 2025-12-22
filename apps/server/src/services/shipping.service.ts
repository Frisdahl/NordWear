import axios from "axios";

const URL = "https://sandbox.shipmondo.com/api/public/v3";

export const getShipmondoProducts = async (
  user_id: string,
  password: string
) => {
  try {
    const response = await axios.get(`${URL}/products`, {
      auth: {
        username: user_id,
        password: password,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching products:", error.response?.data);
    } else {
      console.error("Error fetching products:", error);
    }
    throw error;
  }
};

export const getShipmentOptions = async (
  user_id: string,
  password: string,
  country_code: string,
  product_code: string,
  zipcode: string,
  address: string,
  city: string
) => {
  try {
    const response = await axios.get(`${URL}/service_point/service_points`, {
      auth: {
        username: user_id,
        password: password,
      },
      params: {
        country_code,
        product_code,
        zipcode,
        address,
        city,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching shipment options:", error.response?.data);
    } else {
      console.error("Error fetching shipment options:", error);
    }
    throw error;
  }
};

export const getShipmentRates = async (
  user_id: string,
  password: string,
  sender_country_code: string,
  sender_zipcode: string,
  receiver_country_code: string,
  receiver_zipcode: string,
  product_codes: string[],
  weight: number
) => {
  try {
    const promises = product_codes.map((product_code) =>
      axios.post(
        `${URL}/quotes`,
        {
          sender: {
            country_code: sender_country_code,
            zip_code: sender_zipcode,
          },
          receiver: {
            country_code: receiver_country_code,
            zip_code: receiver_zipcode,
          },
          product_code: product_code,
          parcels: [
            {
              weight: weight / 1000, // Convert grams to kg
            },
          ],
        },
        {
          auth: {
            username: user_id,
            password: password,
          },
        }
      )
    );

    const responses = await Promise.all(promises);
    return responses.map((response) => response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching shipping rates:", error.response?.data);
    } else {
      console.error("Error fetching shipping rates:", error);
    }
    throw error;
  }
};
