const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./config/db");
const colors = require("colors");
const morgan = require("morgan");

const chats = require("./data/data");

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(logger);
if ((process.env.NODE_ENV = "development")) {
  app.use(morgan("dev"));
}

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

app.listen(PORT, console.log(`server running on port ${PORT}`.yellow.bold));
