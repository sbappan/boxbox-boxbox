import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { env } from "./config/env.js";
import { auth } from "./auth/index.js";
import { db } from "./db/index.js";
import { users, races } from "./db/schema.js";
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
      users: "/api/users/:id",
      races: "/api/races",
    },
  });
});

// Get all races (public)
app.get("/api/races", async (c) => {
  try {
    const allRaces = await db
      .select({
        id: races.id,
        slug: races.slug,
        name: races.name,
        latestRace: races.latestRace,
      })
      .from(races);

    return c.json(allRaces);
  } catch (error) {
    console.error("Failed to fetch races:", error);
    return c.json({ error: "Failed to fetch races" }, 500);
  }
});

// Get race by slug (public)
app.get("/api/races/:slug", async (c) => {
  const slug = c.req.param("slug");

  try {
    const [race] = await db
      .select({
        id: races.id,
        slug: races.slug,
        name: races.name,
        latestRace: races.latestRace,
      })
      .from(races)
      .where(eq(races.slug, slug))
      .limit(1);

    if (!race) {
      return c.json({ error: "Race not found" }, 404);
    }

    return c.json({ race });
  } catch (error) {
    console.error("Failed to fetch race:", error);
    return c.json({ error: "Failed to fetch race" }, 500);
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
    console.log(`🏁 Races endpoint: http://localhost:${info.port}/api/races`);
  }
);
