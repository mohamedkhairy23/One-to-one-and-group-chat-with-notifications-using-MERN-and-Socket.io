const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./config/db");
const colors = require("colors");
const morgan = require("morgan");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const userRoutes = require("./routes/userRoutes");
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

app.use("/api/user", userRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`server running on port ${PORT}`.yellow.bold));
