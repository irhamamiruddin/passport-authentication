import express from "express";
import { Server } from "socket.io";
import http from "http";
import dotenv from "dotenv"
import mongoose from "mongoose";
import UserRoutes from "./routes/users";
import cors from "cors";

// load env
dotenv.config();

// Create Express server
const app = express();
const port = process.env.PORT;

// Create HTTP server
const server = new http.Server(app);
const socketio = new Server(server, { cors: { origin: "*" } });

// Create socket.io connection
socketio.on("connection", (socket: any) => {
    console.log("Socket connected", socket.id);
});

// Create CORS options
const httpOptions: any = { cors: { origin: "*" } };
app.use(cors(httpOptions));

// Create routes
app.use("/api/users", UserRoutes);

// Create MongoDB connection using mongoose
const mongodb = process.env.MONGODB_URI;
mongoose.connect(mongodb as string).then((connection: any) => {
    console.log("MongoDB connected", mongodb);

    // Start Express server
    server.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
});
