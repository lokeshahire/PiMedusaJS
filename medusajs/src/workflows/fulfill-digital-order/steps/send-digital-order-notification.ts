import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import {
  INotificationModuleService,
  IFileModuleService,
} from "@medusajs/framework/types";
import { ModuleRegistrationName } from "@medusajs/framework/utils";
import {
  DigitalProductOrder,
  MediaType,
} from "../../../modules/digital-product/types";
import digitalProductOrder from "../../../links/digital-product-order";

type SendDigitalOrderNotificationStepInput = {
  digital_product_order: DigitalProductOrder;
};

export const sendDigitalOrderNotificationStep = createStep(
  "send-digital-order-notification",
  async (
    {
      digital_product_order: digitalProductOrder,
    }: SendDigitalOrderNotificationStepInput,
    { container }
  ) => {
    const notificationModuleService: INotificationModuleService =
      container.resolve(ModuleRegistrationName.NOTIFICATION);
    const fileModuleService: IFileModuleService = container.resolve(
      ModuleRegistrationName.FILE
    );

    // TODO assemble notification

    const notification = await notificationModuleService.createNotifications({
      to: digitalProductOrder.order?.email ?? "",
      template: "digital-order-template",
      channel: "email",
      data: {
        products: digitalProductOrder.products, // or use the correct property containing the products
      },
    });

    return new StepResponse(notification);
  }
);
