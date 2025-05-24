import { LoaderOptions } from "@medusajs/framework/types";

export default async function digitalProductLoader({
  container,
}: LoaderOptions) {
  const logger = container.resolve("logger");

  logger.info("[DIGITAL PRODUCT] Just started the Medusa application!");
}
