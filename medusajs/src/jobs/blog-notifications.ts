import { MedusaContainer } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export default async function blogNotificationsJob(container: MedusaContainer) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);

  logger.info("Starting blog notifications scheduled job");

  try {
    // Get recent blog posts (last 24 hours)
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const { data: recentPosts } = await query.graph({
      entity: "blog",
      fields: ["id", "title", "name", "created_at"],
      filters: {
        created_at: {
          $gte: oneDayAgo.toISOString(),
        },
      },
    });

    logger.info(
      `Found ${recentPosts.length} new blog posts in the last 24 hours`
    );

    // Process each post
    for (const post of recentPosts) {
      logger.info(`Processing blog post: "${post.title}" by ${post.name}`);
      // Add your notification logic here
    }

    logger.info("Blog notifications scheduled job completed successfully");
  } catch (error) {
    logger.error("Error in blog notifications scheduled job:", error);
    throw error;
  }
}

export const config = {
  name: "blog-notifications",
  schedule: "0 0 * * *", // Run daily at midnight
  //   schedule: "*/10 * * * * *", // Run every 10 seconds
};
