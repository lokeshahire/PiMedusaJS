import { defineRouteConfig } from "@medusajs/admin-sdk";
import {
  Container,
  Heading,
  Table,
  Button,
  Drawer,
  Toaster,
} from "@medusajs/ui";
import { Book, Trash } from "@medusajs/icons";
import { useEffect, useMemo, useState } from "react";

type Blog = {
  id: string;
  name: string;
  title: string;
  description: string;
  email: string;
  created_at: string;
  updated_at: string;
};

const CreateBlogForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      email: formData.get("email") as string,
    };

    try {
      const response = await fetch("/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create blog");
      }
      setError(null);
      onSuccess();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        name="name"
        placeholder="Creator Name"
        required
        className="border p-2 rounded"
      />
      <input
        type="text"
        name="title"
        placeholder="Title"
        required
        className="border p-2 rounded"
      />
      <textarea
        name="description"
        placeholder="Description"
        required
        className="border p-2 rounded"
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        required
        className="border p-2 rounded"
      />
      {error && <span className="text-red-600">{error}</span>}
      <Button type="submit">Create Blog</Button>
    </form>
  );
};

const BlogsPage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageLimit = 10;
  const [count, setCount] = useState(0);

  const pagesCount = useMemo(() => Math.ceil(count / pageLimit), [count]);
  const canNextPage = useMemo(
    () => currentPage < pagesCount,
    [currentPage, pagesCount]
  );
  const canPreviousPage = useMemo(() => currentPage > 1, [currentPage]);

  const fetchBlogs = () => {
    const query = new URLSearchParams({
      limit: `${pageLimit}`,
      page: `${currentPage}`,
    });

    fetch(`/blog?${query.toString()}`, { credentials: "include" })
      .then((res) => res.json())
      .then(({ posts, total }) => {
        setBlogs(posts);
        setCount(total);
        // console.log("Fetched blogs:", posts);
      })
      .catch((error) => console.error("Error fetching blogs:", error));
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/blog/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to delete blog");
      fetchBlogs();
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [currentPage]);

  const nextPage = () => {
    if (canNextPage) setCurrentPage((prev) => prev + 1);
  };

  const previousPage = () => {
    if (canPreviousPage) setCurrentPage((prev) => prev - 1);
  };

  return (
    <Container>
      <Toaster />
      <div className="flex justify-between items-center mb-4">
        <Heading level="h2">Blogs</Heading>
        <Drawer open={open} onOpenChange={setOpen}>
          <Drawer.Trigger asChild>
            <Button>Create Blog</Button>
          </Drawer.Trigger>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Create Blog Post</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <CreateBlogForm
                onSuccess={() => {
                  setOpen(false);
                  if (currentPage === 1) {
                    fetchBlogs();
                  } else {
                    setCurrentPage(1);
                  }
                }}
              />
            </Drawer.Body>
          </Drawer.Content>
        </Drawer>
      </div>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Title</Table.HeaderCell>
            <Table.HeaderCell>Creator</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {blogs.map((blog) => (
            <Table.Row key={blog.id}>
              <Table.Cell>{blog.title}</Table.Cell>
              <Table.Cell>{blog.name}</Table.Cell>
              <Table.Cell>{blog.description}</Table.Cell>
              <Table.Cell>{blog.email}</Table.Cell>

              <Table.Cell>
                <button
                  onClick={() => handleDelete(blog.id)}
                  className="text-red-600"
                >
                  <Trash />
                </button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <Table.Pagination
        count={count}
        pageSize={pageLimit}
        pageIndex={currentPage - 1}
        pageCount={pagesCount}
        canPreviousPage={canPreviousPage}
        canNextPage={canNextPage}
        previousPage={previousPage}
        nextPage={nextPage}
      />
    </Container>
  );
};

export const config = defineRouteConfig({
  label: "Blogs",
  icon: Book,
});

export default BlogsPage;
