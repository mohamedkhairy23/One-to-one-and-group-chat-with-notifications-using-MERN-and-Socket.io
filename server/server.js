const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const chats = require("./data/data");
const app = express();

app.get("/", (req, res) => {
  res.send("API is Running Successfully");
});

app.get("/api/chat", (req, res) => {
  res.send(chats);
});

app.get("/api/chat/:id", (req, res) => {
  res.send(chats.find((c) => c._id === req.params.id));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`server running on port ${PORT}`));
