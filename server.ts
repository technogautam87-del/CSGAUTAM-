import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

// Maximum payload size for JSON (since base64 image could be 100kb - 500kb)
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ limit: "15mb", extended: true }));

const CONFIG_FILE_PATH = path.join(process.cwd(), "global_homepage_config.json");

// API: Get global homepage config
app.get("/api/homepage", (req, res) => {
  try {
    if (fs.existsSync(CONFIG_FILE_PATH)) {
      const data = fs.readFileSync(CONFIG_FILE_PATH, "utf8");
      return res.json(JSON.parse(data));
    }
    // Return empty object if no config file has been written yet,
    // so client can fall back to INITIAL_HOMEPAGE_CONFIG
    return res.json({ status: "none" });
  } catch (error) {
    console.error("Error reading global homepage config:", error);
    return res.status(500).json({ error: "Failed to read configuration" });
  }
});

// API: Update global homepage config
app.post("/api/homepage", (req, res) => {
  try {
    const config = req.body;
    if (!config || typeof config !== "object") {
      return res.status(400).json({ error: "Invalid configuration payload" });
    }
    fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(config, null, 2), "utf8");
    return res.json({ status: "success", message: "Homepage config published globally!" });
  } catch (error) {
    console.error("Error writing global homepage config:", error);
    return res.status(500).json({ error: "Failed to publish configuration globally" });
  }
});

// Setup Vite middleware in Development
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up Vite server in dev mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving static files in production mode from dist...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express server running globally on port ${PORT}`);
  });
}

setupVite();
