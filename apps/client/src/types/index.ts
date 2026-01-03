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
  color?: Color;
  size?: Size;
}

export interface ProductImage {
  id: number;
  url: string;
  isThumbnail: boolean;
  productId: number;
}

export interface Product {
  id?: number;
  name: string;
  price: number;
  offer_price?: number;
  status: ProductStatus;
  category_Id: number;
  category?: Category;
  deleted_at?: Date;
  varenummer?: string;
  barkode?: string;
  images?: ProductImage[];
  imageUrl?: string | null;
  colors?: string[];
  shipment_size?: ShipmentSize;
  product_quantity?: ProductQuantity[];
  description: string;
  variants: {
    size: string;
    price: number;
    stock: number;
  }[];
  selectedSize?: string;
  selectedSizeId?: number;
  selectedColorId?: number;
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
