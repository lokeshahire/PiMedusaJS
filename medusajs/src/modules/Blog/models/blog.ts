import { model } from "@medusajs/framework/utils";

const Blog = model.define("blog", {
  id: model.id().primaryKey(),
  name: model.text(),
  title: model.text(),
  description: model.text(),
  email: model.text(),
});

export default Blog;
