import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { env } from "./config/env.js";
import { auth } from "./auth/index.js";
import { db } from "./db/index.js";
import { posts, users } from "./db/schema.js";
import { eq } from "drizzle-orm";

const app = new Hono();

// Apply CORS middleware
app.use("*", cors());

// Mount better-auth routes
app.on(["POST", "GET"], "/api/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

// Example: Public endpoint
app.get("/", (c) => {
  return c.json({
    message: "Welcome to the F1 Review Site API",
    endpoints: {
      auth: "/api/auth/*",
      posts: "/api/posts",
      users: "/api/users/:id",
    },
  });
});

// Example: Get all posts (public)
app.get("/api/posts", async (c) => {
  try {
    const allPosts = await db
      .select({
        id: posts.id,
        title: posts.title,
        content: posts.content,
        published: posts.published,
        createdAt: posts.createdAt,
        author: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
      })
      .from(posts)
      .leftJoin(users, eq(posts.authorId, users.id))
      .where(eq(posts.published, true));

    return c.json({ posts: allPosts });
  } catch (error) {
    return c.json({ error: "Failed to fetch posts" }, 500);
  }
});

// Example: Protected endpoint - Create a post
app.post("/api/posts", async (c) => {
  // Get session from better-auth
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  try {
    const body = await c.req.json();
    const { title, content, published = false } = body;

    if (!title) {
      return c.json({ error: "Title is required" }, 400);
    }

    const [newPost] = await db
      .insert(posts)
      .values({
        title,
        content,
        published,
        authorId: session.user.id,
      })
      .returning();

    return c.json({ post: newPost }, 201);
  } catch (error) {
    return c.json({ error: "Failed to create post" }, 500);
  }
});

// Example: Get user profile (protected)
app.get("/api/users/:id", async (c) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const userId = c.req.param("id");

  // Users can only view their own profile (you can modify this logic)
  if (session.user.id !== userId) {
    return c.json({ error: "Forbidden" }, 403);
  }

  try {
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        avatar: users.avatar,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json({ user });
  } catch (error) {
    return c.json({ error: "Failed to fetch user" }, 500);
  }
});

// Health check endpoint
app.get("/health", async (c) => {
  try {
    // Test database connection
    await db.select().from(users).limit(1);
    return c.json({ status: "healthy", database: "connected" });
  } catch (error) {
    return c.json({ status: "unhealthy", database: "disconnected" }, 503);
  }
});

// Start the server
serve(
  {
    fetch: app.fetch,
    port: env.PORT,
  },
  (info) => {
    console.log(`🚀 Server is running on http://localhost:${info.port}`);
    console.log(`📚 API Documentation: http://localhost:${info.port}`);
    console.log(`🔐 Auth endpoints: http://localhost:${info.port}/api/auth/*`);
  }
);
