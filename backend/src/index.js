import express from "express";
import dotenv from "dotenv"
import cors from "cors";

import path from "path"

import {connectDB} from "./lib/db.js"
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import cookieParser from "cookie-parser"
import { app, server } from "./lib/socket.js";

dotenv.config()

const PORT = process.env.PORT
const __dirname = path.resolve();

app.use(express.json({ limit: '10mb' })); // Increase JSON payload limit
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Increase URL-encoded payload limit

app.use(cookieParser());
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true,
}));

app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)

if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  app.get("*", (req, res)=>{
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  })
}

server.listen(5001, ()=>{
  console.log("server is up and running on port "+ PORT);
  connectDB();
})