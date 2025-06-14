import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { BLOG_MODULE } from "src/modules/Blog";
import BlogModuleService from "src/modules/Blog/service";

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const blogModuleService: BlogModuleService = req.scope.resolve(BLOG_MODULE);
  await blogModuleService.deletePosts(req.params.id);
  res.json({ success: true });
}
