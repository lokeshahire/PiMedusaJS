import {
  validateAndTransformBody,
  defineMiddlewares,
} from "@medusajs/framework/http";
import { createFindParams } from "@medusajs/medusa/api/utils/validators";
import { validateAndTransformQuery } from "@medusajs/framework/http";
import { createDigitalProductsSchema } from "./validation-schemas";
import multer from "multer";

export const GetCustomSchema = createFindParams();

const upload = multer({ storage: multer.memoryStorage() });

export default defineMiddlewares({
  routes: [
    {
      matcher: "/admin/digital-products",
      method: "POST",
      middlewares: [validateAndTransformBody(createDigitalProductsSchema)],
    },
    {
      matcher: "/admin/digital-products/upload**",
      method: "POST",
      middlewares: [upload.array("files")],
    },
    {
      matcher: "/admin/subscriptions",
      method: "GET",
      middlewares: [
        validateAndTransformQuery(GetCustomSchema, {
          defaults: [
            "id",
            "subscription_date",
            "expiration_date",
            "status",
            "metadata.*",
            "orders.*",
            "customer.*",
          ],
          isList: true,
        }),
      ],
    },
  ],
});
