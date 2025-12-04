export type ProductStatus = "ONLINE" | "OFFLINE" | "DRAFT";

export interface ShipmentSize {
  id?: number;
  weight?: number;
  height?: number;
  width?: number;
  productId?: number;
}

export interface ProductQuantity {
  id?: number;
  productId?: number;
  sizeId?: number;
  colorId?: number;
  quantity?: number;
}

export interface Product {
  id?: number;
  name: string;
  price: number;
  offer_price?: number;
  status: ProductStatus;
  category_Id: number;
  deleted_at?: Date;
  varenummer?: string;
  barkode?: string;
  imageUrl?: string;
  shipment_size?: ShipmentSize;
  product_quantity?: ProductQuantity[];
  description: string;
  variants: {
    size: string;
    price: number;
    stock: number;
  }[];
}

export interface Category {
  id: number;
  name: string;
}

export interface Color {
  id: number;
  name: string;
}

export interface Size {
  id: number;
  name: string;
}
