require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.route");
const fileRoutes = require("./routes/file.route");
const cors = require("cors");
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

connectDB();

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/uploads", express.static("uploads"));

app.listen(5890, () => console.log("Server running on port 5890"));
