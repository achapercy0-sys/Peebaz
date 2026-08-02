const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const crypto = require("crypto");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

let sharedDataStore = {
  // your data or routes here
};

// If running locally, use server.listen. For Vercel, export the app/server.
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = server;

