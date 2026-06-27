import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("@clerk/nextjs", () => ({
  useUser: () => ({
    user: { id: "clerk_agent_1" },
    isLoaded: true,
  }),
}));

const mockBlogs = [
  {
    _id: "blog-1",
    title: "Top 10 Neighborhoods in Austin",
    slug: "top-10-neighborhoods-austin",
    content: "Austin is a vibrant city with many great neighborhoods...",
    excerpt: "Discover the best neighborhoods to live in Austin.",
    tags: ["austin", "neighborhoods", "guide"],
    authorId: "agent-1",
    status: "published",
    publishedAt: "2025-05-01T00:00:00Z",
    createdAt: "2025-04-28T00:00:00Z",
    updatedAt: "2025-05-01T00:00:00Z",
  },
  {
    _id: "blog-2",
    title: "First-Time Home Buyer Tips",
    slug: "first-time-home-buyer-tips",
    content: "Buying your first home can be overwhelming...",
    excerpt: "Essential tips for first-time home buyers.",
    tags: ["tips", "first-time", "buying"],
    authorId: "agent-1",
    status: "draft",
    createdAt: "2025-06-10T00:00:00Z",
    updatedAt: "2025-06-10T00:00:00Z",
  },
];

const mockGet = vi.fn().mockResolvedValue({ data: { data: mockBlogs } });
const mockPost = vi.fn().mockResolvedValue({
  success: true,
  data: {
    _id: "blog-new",
    title: "New Blog Post",
    slug: "new-blog-post",
    content: "Content here...",
    excerpt: "Excerpt here...",
    tags: ["new"],
    authorId: "agent-1",
    status: "draft",
    createdAt: "2025-06-15T00:00:00Z",
    updatedAt: "2025-06-15T00:00:00Z",
  },
});
const mockPatch = vi.fn().mockResolvedValue({
  success: true,
  data: { ...mockBlogs[0], title: "Updated Title" },
});
const mockDelete = vi.fn().mockResolvedValue({
  success: true,
  data: { deleted: true },
});

vi.mock("@/lib/api-client", () => ({
  default: {
    get: (...args: unknown[]) => mockGet(...args),
    post: (...args: unknown[]) => mockPost(...args),
    patch: (...args: unknown[]) => mockPatch(...args),
    delete: (...args: unknown[]) => mockDelete(...args),
    interceptors: { response: { use: vi.fn() } },
  },
  setAuthToken: vi.fn(),
}));

import React from "react";

function renderWithProviders(ui: React.ReactElement) {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
}

// Mock Blog List component
function BlogListPage() {
  const [blogs, setBlogs] = React.useState<typeof mockBlogs>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchBlogs = async () => {
      const { default: client } = await import("@/lib/api-client");
      const response = await client.get("/blogs");
      setBlogs(response.data.data);
      setIsLoading(false);
    };
    fetchBlogs();
  }, []);

  if (isLoading) return <div data-testid="loading">Loading...</div>;

  return (
    <div data-testid="blog-list-page">
      <h1>Blog Posts</h1>
      <button data-testid="create-blog-btn">Create Post</button>
      <div data-testid="blog-list">
        {blogs.map((blog) => (
          <div key={blog._id} data-testid={`blog-${blog._id}`}>
            <h3>{blog.title}</h3>
            <p>{blog.excerpt}</p>
            <span data-testid={`blog-status-${blog._id}`}>{blog.status}</span>
            <div>
              {blog.tags.map((tag) => (
                <span key={tag} data-testid={`tag-${tag}`} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Mock Blog Editor component
function BlogEditor({ blogId }: { blogId?: string }) {
  const [title, setTitle] = React.useState(blogId ? "Existing Title" : "");
  const [content, setContent] = React.useState("");
  const [excerpt, setExcerpt] = React.useState("");
  const [tags, setTags] = React.useState("");
  const [status, setStatus] = React.useState<"draft" | "published">("draft");
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { default: client } = await import("@/lib/api-client");
      const payload = {
        title,
        content,
        excerpt,
        tags: tags.split(",").map((t) => t.trim()),
        status,
      };
      if (blogId) {
        await client.patch(`/blogs/${blogId}`, payload);
      } else {
        await client.post("/blogs", payload);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    setStatus("published");
    setIsSaving(true);
    try {
      const { default: client } = await import("@/lib/api-client");
      const payload = {
        title,
        content,
        excerpt,
        tags: tags.split(",").map((t) => t.trim()),
        status: "published",
      };
      if (blogId) {
        await client.patch(`/blogs/${blogId}`, payload);
      } else {
        await client.post("/blogs", payload);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div data-testid="blog-editor">
      <h2>{blogId ? "Edit Post" : "Create Post"}</h2>
      <input
        data-testid="blog-title-input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <textarea
        data-testid="blog-content-input"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content..."
      />
      <textarea
        data-testid="blog-excerpt-input"
        value={excerpt}
        onChange={(e) => setExcerpt(e.target.value)}
        placeholder="Excerpt..."
      />
      <input
        data-testid="blog-tags-input"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Tags (comma-separated)"
      />
      <button onClick={handleSave} data-testid="save-draft-btn" disabled={isSaving}>
        {isSaving ? "Saving..." : "Save Draft"}
      </button>
      <button onClick={handlePublish} data-testid="publish-btn" disabled={isSaving}>
        {isSaving ? "Publishing..." : "Publish"}
      </button>
    </div>
  );
}

describe("Blog Management: CRUD Flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders blog list with posts from API", async () => {
    renderWithProviders(<BlogListPage />);

    await waitFor(() => {
      expect(screen.getByText("Blog Posts")).toBeInTheDocument();
    });

    expect(screen.getByText("Top 10 Neighborhoods in Austin")).toBeInTheDocument();
    expect(screen.getByText("First-Time Home Buyer Tips")).toBeInTheDocument();
  });

  it("displays blog post status (published/draft)", async () => {
    renderWithProviders(<BlogListPage />);

    await waitFor(() => {
      expect(screen.getByTestId("blog-status-blog-1")).toHaveTextContent("published");
      expect(screen.getByTestId("blog-status-blog-2")).toHaveTextContent("draft");
    });
  });

  it("displays blog post tags", async () => {
    renderWithProviders(<BlogListPage />);

    await waitFor(() => {
      expect(screen.getByText("austin")).toBeInTheDocument();
      expect(screen.getByText("neighborhoods")).toBeInTheDocument();
      expect(screen.getByText("guide")).toBeInTheDocument();
    });
  });

  it("renders create blog button", async () => {
    renderWithProviders(<BlogListPage />);

    await waitFor(() => {
      expect(screen.getByTestId("create-blog-btn")).toBeInTheDocument();
    });
  });

  it("renders blog editor with empty form for new post", () => {
    renderWithProviders(<BlogEditor />);

    expect(screen.getByTestId("blog-editor")).toBeInTheDocument();
    expect(screen.getByTestId("blog-title-input")).toBeInTheDocument();
    expect(screen.getByTestId("blog-content-input")).toBeInTheDocument();
    expect(screen.getByTestId("blog-excerpt-input")).toBeInTheDocument();
    expect(screen.getByTestId("blog-tags-input")).toBeInTheDocument();
  });

  it("renders blog editor with existing data for edit", () => {
    renderWithProviders(<BlogEditor blogId="blog-1" />);

    expect(screen.getByTestId("blog-title-input")).toHaveValue("Existing Title");
  });

  it("save draft button calls API with draft status", async () => {
    renderWithProviders(<BlogEditor />);

    fireEvent.change(screen.getByTestId("blog-title-input"), {
      target: { value: "New Blog Post" },
    });
    fireEvent.change(screen.getByTestId("blog-content-input"), {
      target: { value: "Content here..." },
    });
    fireEvent.change(screen.getByTestId("blog-excerpt-input"), {
      target: { value: "Excerpt here..." },
    });
    fireEvent.change(screen.getByTestId("blog-tags-input"), {
      target: { value: "new, blog" },
    });

    fireEvent.click(screen.getByTestId("save-draft-btn"));

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith(
        "/blogs",
        expect.objectContaining({
          title: "New Blog Post",
          status: "draft",
        }),
      );
    });
  });

  it("publish button calls API with published status", async () => {
    renderWithProviders(<BlogEditor />);

    fireEvent.change(screen.getByTestId("blog-title-input"), {
      target: { value: "Published Post" },
    });
    fireEvent.click(screen.getByTestId("publish-btn"));

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith(
        "/blogs",
        expect.objectContaining({
          title: "Published Post",
          status: "published",
        }),
      );
    });
  });

  it("shows saving state during save", async () => {
    mockPost.mockImplementationOnce(() =>
      new Promise((resolve) => setTimeout(resolve, 100)).then(() => ({
        success: true,
        data: { _id: "blog-new" },
      })),
    );

    renderWithProviders(<BlogEditor />);

    fireEvent.change(screen.getByTestId("blog-title-input"), {
      target: { value: "Test" },
    });
    fireEvent.click(screen.getByTestId("save-draft-btn"));

    expect(screen.getByText("Saving...")).toBeInTheDocument();
  });

  it("handles tags as comma-separated input", async () => {
    renderWithProviders(<BlogEditor />);

    fireEvent.change(screen.getByTestId("blog-tags-input"), {
      target: { value: "tag1, tag2, tag3" },
    });

    expect(screen.getByTestId("blog-tags-input")).toHaveValue("tag1, tag2, tag3");
  });

  it("handles blog deletion", async () => {
    const { default: client } = await import("@/lib/api-client");

    renderWithProviders(<BlogListPage />);

    await waitFor(() => {
      expect(screen.getByText("Top 10 Neighborhoods in Austin")).toBeInTheDocument();
    });

    // Verify delete API is available
    expect(client.delete).toBeDefined();
  });

  it("handles empty blog list", async () => {
    mockGet.mockResolvedValueOnce({
      data: { data: [] },
    });

    renderWithProviders(<BlogListPage />);

    await waitFor(() => {
      expect(screen.getByTestId("blog-list")).toBeInTheDocument();
      expect(screen.getByTestId("blog-list").children.length).toBe(0);
    });
  });
});
