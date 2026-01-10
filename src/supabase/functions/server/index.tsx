import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Seed dummy data if database is empty
async function seedDummyData() {
  try {
    const existingRights = await kv.getByPrefix("ip_right_");
    
    // Only seed if no data exists
    if (existingRights.length === 0) {
      const dummyData = [
        {
          id: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
          title: "AI-Powered Image Recognition System",
          description: "Advanced machine learning algorithm for real-time object detection and classification in images and video streams",
          ipfsHash: "QmX7K8FvXz9GpQH5J2M3N4P6R8T9W1Y3Z5B7C",
          category: "Patent",
          applicantAddress: "0xEf1A91cCb29C85135EA58F6f800B6e66a5459589",
          transactionHash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
          timestamp: Date.now() - 86400000 * 5, // 5 days ago
          createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        },
        {
          id: "0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c",
          title: "TechVision Brand Logo & Identity",
          description: "Complete corporate brand identity including logo design, color scheme, and visual guidelines for technology company",
          ipfsHash: "QmY8L9GwYa0HqRJ6K3N5O7Q9S1U4X6Y8A0C2D",
          category: "Trademark",
          applicantAddress: "0xEf1A91cCb29C85135EA58F6f800B6e66a5459589",
          transactionHash: "0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c",
          timestamp: Date.now() - 86400000 * 10, // 10 days ago
          createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
        },
        {
          id: "0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d",
          title: "Blockchain DApp Source Code",
          description: "Decentralized application for supply chain management with smart contract integration",
          ipfsHash: "QmZ9M0HxZb1IsKL7N6P8R0T2V5W7X9Z1B3E5F",
          category: "Copyright",
          applicantAddress: "0xEf1A91cCb29C85135EA58F6f800B6e66a5459589",
          transactionHash: "0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d",
          timestamp: Date.now() - 86400000 * 15, // 15 days ago
          createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
        },
        {
          id: "0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e",
          title: "Quantum Encryption Protocol",
          description: "Novel cryptographic protocol utilizing quantum key distribution for secure communications",
          ipfsHash: "QmA1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R",
          category: "Patent",
          applicantAddress: "0xEf1A91cCb29C85135EA58F6f800B6e66a5459589",
          transactionHash: "0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e",
          timestamp: Date.now() - 86400000 * 20, // 20 days ago
          createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
        },
        {
          id: "0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f",
          title: "EcoGreen Product Design",
          description: "Sustainable packaging design for eco-friendly consumer products with biodegradable materials",
          ipfsHash: "QmB2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S",
          category: "Design Patent",
          applicantAddress: "0xEf1A91cCb29C85135EA58F6f800B6e66a5459589",
          transactionHash: "0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f",
          timestamp: Date.now() - 86400000 * 25, // 25 days ago
          createdAt: new Date(Date.now() - 86400000 * 25).toISOString(),
        },
      ];

      for (const ipRight of dummyData) {
        await kv.set(`ip_right_${ipRight.id}`, ipRight);
      }

      console.log("Dummy IP rights data seeded successfully");
    }
  } catch (error: any) {
    console.error("Error seeding dummy data:", error.message);
  }
}

// Initialize dummy data on startup
seedDummyData();

// Health check endpoint
app.get("/make-server-5565b361/health", (c) => {
  return c.json({ status: "ok" });
});

// Save IP right to database
app.post("/make-server-5565b361/ip-rights", async (c) => {
  try {
    const body = await c.req.json();
    const { id, title, description, ipfsHash, category, applicantAddress, transactionHash, timestamp } = body;

    if (!id || !title || !transactionHash) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    const ipRight = {
      id,
      title,
      description,
      ipfsHash,
      category,
      applicantAddress,
      transactionHash,
      timestamp,
      createdAt: new Date().toISOString(),
    };

    await kv.set(`ip_right_${id}`, ipRight);

    return c.json({ success: true, ipRight });
  } catch (error: any) {
    console.error("Error saving IP right:", error.message);
    return c.json({ error: error.message || "Failed to save IP right" }, 500);
  }
});

// Get all IP rights
app.get("/make-server-5565b361/ip-rights", async (c) => {
  try {
    const ipRights = await kv.getByPrefix("ip_right_");
    
    // Sort by timestamp (newest first)
    const sortedIpRights = ipRights.sort((a, b) => {
      return (b.timestamp || 0) - (a.timestamp || 0);
    });

    return c.json({ success: true, ipRights: sortedIpRights });
  } catch (error: any) {
    console.error("Error fetching IP rights:", error.message);
    return c.json({ error: error.message || "Failed to fetch IP rights" }, 500);
  }
});

// Get single IP right by ID
app.get("/make-server-5565b361/ip-rights/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const ipRight = await kv.get(`ip_right_${id}`);

    if (!ipRight) {
      return c.json({ error: "IP right not found" }, 404);
    }

    return c.json({ success: true, ipRight });
  } catch (error: any) {
    console.error("Error fetching IP right:", error.message);
    return c.json({ error: error.message || "Failed to fetch IP right" }, 500);
  }
});

// Delete IP right (optional - for cleanup)
app.delete("/make-server-5565b361/ip-rights/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`ip_right_${id}`);

    return c.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting IP right:", error.message);
    return c.json({ error: error.message || "Failed to delete IP right" }, 500);
  }
});

// Update IP right ownership (for transfers)
app.put("/make-server-5565b361/ip-rights/:id/transfer", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const { newOwner, txHash } = body;

    if (!newOwner || !txHash) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    // Get existing IP right
    const ipRight = await kv.get(`ip_right_${id}`);
    
    if (!ipRight) {
      return c.json({ error: "IP right not found" }, 404);
    }

    // Update with new owner
    const updatedIpRight = {
      ...ipRight,
      applicantAddress: newOwner,
      lastTransferHash: txHash,
      lastTransferDate: Date.now(),
    };

    await kv.set(`ip_right_${id}`, updatedIpRight);

    return c.json({ success: true, ipRight: updatedIpRight });
  } catch (error: any) {
    console.error("Error transferring IP right:", error.message);
    return c.json({ error: error.message || "Failed to transfer IP right" }, 500);
  }
});

Deno.serve(app.fetch);