import express from "express";
const app = express();
import dotenv from "dotenv";
import http from "http";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

import WebSocket, { WebSocketServer } from "ws";

/** initiial */
const serverNode = http.createServer((req, res) => {
  // Set the response header
  res.writeHead(200, { "Content-Type": "text/plain" });

  // Send the response body
  res.end("Server running");
});
serverNode.listen(process.env.PORT as any, "0.0.0.0", () => {
  console.log(`Server running at http://localhost:${process.env.PORT}/`);
});

const server = new WebSocketServer({
  port: Number(process.env.SOCKET_PORT) || 8081,
});

const clients = new Set() as Set<WebSocket>;

server.on("connection", (socket) => {
  clients.add(socket);
  console.log("New connection — total clients:", clients.size);

  socket.on("message", (message) => {
    clients.forEach((client, index) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(`${message?.toString()}`);
      }
    });
  });

  socket.on("close", () => {
    clients.delete(socket);
    console.log("Client disconnected — total clients:", clients.size);
  });

  socket.on("error", (error) => {
    console.error(`Socket error: ${error.message}`);
  });
});

console.log(
  "WebSocket server is running on ws://localhost:" + process.env.SOCKET_PORT
);
