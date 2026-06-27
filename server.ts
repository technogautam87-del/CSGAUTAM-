import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import multer from "multer";

const app = express();
const PORT = 3000;

// Ensure upload directory exists
const UPLOADS_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Serve uploaded files statically
app.use("/uploads", express.static(UPLOADS_DIR));

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB file size limit
});

// Maximum payload size for JSON (since base64 image could be 100kb - 500kb)
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ limit: "15mb", extended: true }));

// Upload API Route
app.post("/api/upload", upload.single("file"), (req: any, res: any) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file was uploaded." });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    return res.json({
      status: "success",
      url: fileUrl,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return res.status(500).json({ error: error.message || "Failed to upload file." });
  }
});

// API Route to list all uploaded files
app.get("/api/uploads", (req, res) => {
  try {
    if (!fs.existsSync(UPLOADS_DIR)) {
      return res.json([]);
    }
    const files = fs.readdirSync(UPLOADS_DIR);
    const fileList = files.map(file => {
      const filePath = path.join(UPLOADS_DIR, file);
      const stat = fs.statSync(filePath);
      return {
        name: file,
        url: `/uploads/${file}`,
        size: stat.size,
        createdAt: stat.birthtime || stat.mtime
      };
    });
    // Sort by creation time desc
    fileList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return res.json(fileList);
  } catch (err: any) {
    console.error("Failed to list uploads:", err);
    return res.status(500).json({ error: err.message || "Failed to list uploads." });
  }
});

// API Route to delete an uploaded file
app.delete("/api/uploads/:filename", (req, res) => {
  try {
    const filename = req.params.filename;
    // Prevent directory traversal attacks
    if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
      return res.status(400).json({ error: "Invalid filename." });
    }
    const filePath = path.join(UPLOADS_DIR, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return res.json({ status: "success", message: "File deleted successfully from disk." });
    } else {
      return res.status(404).json({ error: "File not found on server." });
    }
  } catch (err: any) {
    console.error("Failed to delete file:", err);
    return res.status(500).json({ error: err.message || "Failed to delete file." });
  }
});

const CONFIG_FILE_PATH = path.join(process.cwd(), "global_homepage_config.json");
const GLOBAL_DATA_PATH = path.join(process.cwd(), "global_app_data.json");

// Helper to safely read global state json
function readGlobalData() {
  if (fs.existsSync(GLOBAL_DATA_PATH)) {
    try {
      const dataStr = fs.readFileSync(GLOBAL_DATA_PATH, "utf8");
      return JSON.parse(dataStr);
    } catch (e) {
      console.error("Error parsing global data file, returning empty:", e);
      return {};
    }
  }
  return {};
}

// Helper to write global state json
function writeGlobalData(data: any) {
  try {
    fs.writeFileSync(GLOBAL_DATA_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch (e) {
    console.error("Error writing global data file:", e);
  }
}

// API: Get all global App data fields
app.get("/api/global_data", (req, res) => {
  try {
    const data = readGlobalData();
    // Also include homepage config from its specific file if homepage config hasn't been migrated into global DB yet
    if (!data.homepageConfig && fs.existsSync(CONFIG_FILE_PATH)) {
      try {
        const homepageRaw = fs.readFileSync(CONFIG_FILE_PATH, "utf8");
        data.homepageConfig = JSON.parse(homepageRaw);
      } catch (err) {}
    }
    return res.json(data);
  } catch (error) {
    console.error("Error getting global data:", error);
    return res.status(500).json({ error: "Failed to read global data" });
  }
});

// API: Save/Update a specific data field globally (e.g. milestones, slides, publications etc.)
app.post("/api/global_data", (req, res) => {
  try {
    const { key, value } = req.body;
    if (!key) {
      return res.status(400).json({ error: "Missing 'key' parameter in payload" });
    }

    const currentData = readGlobalData();
    currentData[key] = value;
    
    // Synchronize homepage config both in the global file and individual file so nothing breaks
    if (key === "homepageConfig") {
      try {
        fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(value, null, 2), "utf8");
      } catch (err) {}
    }

    writeGlobalData(currentData);
    return res.json({ status: "success", message: `${key} saved globally!` });
  } catch (error) {
    console.error("Error writing global data:", error);
    return res.status(500).json({ error: "Failed to save data globally" });
  }
});

// API: Get global homepage config
app.get("/api/homepage", (req, res) => {
  try {
    const globalData = readGlobalData();
    if (globalData.homepageConfig) {
      return res.json(globalData.homepageConfig);
    }
    if (fs.existsSync(CONFIG_FILE_PATH)) {
      const data = fs.readFileSync(CONFIG_FILE_PATH, "utf8");
      return res.json(JSON.parse(data));
    }
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
    
    // Save both locations
    fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(config, null, 2), "utf8");
    
    const db = readGlobalData();
    db.homepageConfig = config;
    writeGlobalData(db);

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
