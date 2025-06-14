import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { createPostWorkflow } from "src/workflows/blog";
import { z } from "zod";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

const createPostSchema = z.object({
  name: z.string(),
  title: z.string(),
  description: z.string(),
  email: z.string(),
});

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { name = "", title = "", page = "1", limit = "10" } = req.query;
  const pageNum = Number(page);
  const limitNum = Number(limit);

  const { data: posts, metadata } = await req.scope.resolve("query").graph({
    entity: "blog",
    fields: ["id", "title", "name", "description", "email"],
    filters: {
      ...(name && { name: { $ilike: `%${name}%` } }),
      ...(title && { title: { $ilike: `%${title}%` } }),
    },
    pagination: {
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
    },
  });

  res.json({
    posts,
    total: metadata.count,
    totalPages: Math.ceil(metadata.count / limitNum),
    currentPage: pageNum,
  });
};

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { title, name, description, email } = createPostSchema.parse(req.body);

  const { result: post } = await createPostWorkflow(req.scope).run({
    input: { title, name, description, email },
  });
  res.json({ post });
}
