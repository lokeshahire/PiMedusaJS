import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { BLOG_MODULE } from "src/modules/Blog";
import BlogModuleService from "src/modules/Blog/service";

type CreatePostWorkflowInput = {
  title: string;
  name: string;
  description: string;
  email: string;
};
const createPostStep = createStep(
  "create-post",
  async (input: CreatePostWorkflowInput, { container }) => {
    const blogModuleService: BlogModuleService = container.resolve(BLOG_MODULE);
    const post = await blogModuleService.createPosts(input);
    return new StepResponse(post, post);
  },
  async (post, { container }) => {
    const blogModuleService: BlogModuleService = container.resolve(BLOG_MODULE);
    await blogModuleService.deletePosts(post.id);
  }
);
export const createPostWorkflow = createWorkflow(
  "create-post",
  (postInput: CreatePostWorkflowInput) => {
    const post = createPostStep(postInput);
    return new WorkflowResponse(post);
  }
);
