import express from "express";
import cors from "cors";
import "dotenv/config";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import aiRouter from "./routes/aiRoutes.js";

import { connectCloudinary } from "./configs/cloudinary.js";
import userRouter from "./routes/userRoutes.js";
import router from "./routes/webhook.js";

const app = express();

await connectCloudinary()
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

app.get("/", (req, res) => res.send("server is Live!!"));



app.use("/api/ai", aiRouter);
app.use("/api/user",userRouter);
app.use("/api/webhooks", router);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is Running at http://localhost:${PORT}`);
});