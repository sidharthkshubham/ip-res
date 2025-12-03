import "dotenv/config";
import express from "express";
import cors from "cors";
import validateRouter from "./routes/validate.js";
import banunbanRouter from "./routes/banunban.js";

const app = express();
const PORT = process.env.PORT || 3000;
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Express API" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.use("/api/v1", validateRouter);
app.use("/api/v1/b", banunbanRouter);
// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});


const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
