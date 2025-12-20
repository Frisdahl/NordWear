import axios from "axios";

const URL = "https://sandbox.shipmondo.com/api/public/v3";

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
