import { model } from "@medusajs/framework/utils";
import DigitalProduct from "./digital-product";
import { MediaType } from "../types";

const DigitalProductMedia = model.define("digital_product_media", {
  id: model.id().primaryKey(),
  type: model.enum(MediaType),
  fileId: model.text(),
  mimeType: model.text(),
  digitalProduct: model.belongsTo(() => DigitalProduct, {
    mappedBy: "medias",
  }),
});

export default DigitalProductMedia;
