import digitalProductLoader from "./loaders/digital-product";
import DigitalProductModuleService from "./service";
import { Module } from "@medusajs/framework/utils";

export const DIGITAL_PRODUCT_MODULE = "digitalProduct";

export default Module(DIGITAL_PRODUCT_MODULE, {
  service: DigitalProductModuleService,

  loaders: [digitalProductLoader],
});
