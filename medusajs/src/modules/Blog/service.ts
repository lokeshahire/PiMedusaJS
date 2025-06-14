import { MedusaService } from "@medusajs/framework/utils";
import Blog from "./models/blog";

class BlogModuleService extends MedusaService({
  Blog,
}) {
  async createPosts(data: {
    title: string;
    name: string;
    description: string;
    email: string;
  }) {
    return await this.createBlogs(data);
  }

  async deletePosts(id: string) {
    return await this.deleteBlogs(id);
  }
}

export default BlogModuleService;
