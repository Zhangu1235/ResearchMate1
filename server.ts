import express from "express";
import http from "http";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { WebSocketServer, WebSocket } from "ws";

// Load environment variables
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Increase payload limit to handle large PDF uploads in base64
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // API Routes MUST be declared FIRST
  const { apiRouter } = await import("./src/routes.ts");
  app.use("/api", apiRouter);

  // Serve static assets / Vite development mode
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development (Vite) mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode...");
    const distPath = path.join(process.cwd(), "dist");
    
    // Serve static frontend build
    app.use(express.static(distPath));
    
    // Redirect all other queries to SPA frontend index.html
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const server = http.createServer(app);
  const wss = new WebSocketServer({ server, path: "/ws" });
  let wsClientCounter = 0;

  wss.on("connection", (socket) => {
    const clientId = ++wsClientCounter;
    console.log(`WebSocket client #${clientId} connected`);

    socket.send(JSON.stringify({
      type: "welcome",
      message: "ResearchMate websocket connected",
      clientId,
      timestamp: Date.now(),
    }));

    socket.on("message", (message) => {
      try {
        const data = JSON.parse(message.toString());

        if (data.type === "ping") {
          socket.send(JSON.stringify({ type: "pong", timestamp: Date.now() }));
          return;
        }

        socket.send(JSON.stringify({ type: "echo", received: data, timestamp: Date.now() }));
      } catch (error) {
        socket.send(JSON.stringify({ type: "error", message: "Unable to parse websocket payload." }));
      }
    });

    socket.on("close", () => {
      console.log(`WebSocket client #${clientId} disconnected`);
    });

    socket.on("error", (error) => {
      console.error(`WebSocket client #${clientId} error:`, error);
    });
  });

  const heartbeat = setInterval(() => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: "heartbeat", timestamp: Date.now() }));
      }
    });
  }, 30000);

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`ResearchMate backend listening on http://0.0.0.0:${PORT}`);
  });

  server.on("close", () => {
    clearInterval(heartbeat);
  });
}

startServer().catch((error) => {
  console.error("Failed to start ResearchMate server:", error);
  process.exit(1);
});
