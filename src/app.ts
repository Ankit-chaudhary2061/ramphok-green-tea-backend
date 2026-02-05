import express from "express";
import authRoutes from "./routes/auth-routes";
import productRoutes from "./routes/product-routes";

const app = express();
app.use(express.json());

// Auth routes
app.use("/auth", authRoutes);

// Product routes
app.use("/api/products", productRoutes); 

export default app;
