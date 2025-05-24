import { OrderDTO, InferTypeOf } from "@medusajs/framework/types";
import DigitalProductOrder from "../models/digital-product-order";

export enum MediaType {
  MAIN = "main",
  PREVIEW = "preview",
}

export enum OrderStatus {
  PENDING = "pending",
  SENT = "sent",
}

export type DigitalProduct = {
  id: string;
  name: string;
  product_variant?: { product_id: string };
};

export type DigitalProductOrder = InferTypeOf<typeof DigitalProductOrder> & {
  order?: OrderDTO;
};
