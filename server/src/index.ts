import express from "express";
import { Server } from "socket.io";
import http from "http";
import dotenv from "dotenv"
import mongoose from "mongoose";
import UserRoutes from "./routes/users";
import LoginRoutes from "./routes/login";
import cors from "cors";
import { passport, Auth } from "./lib/passport";

// load env
dotenv.config();

// Create Express server
const app = express();
const port = process.env.PORT;

// use json
app.use(express.json());

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

// const secret = process.env.SECRET_KEY;
// const session = require("express-session");
// const jwt = require("jsonwebtoken");

// Create routes
app.use("/api/users", UserRoutes);
app.use("/api/login", LoginRoutes);

// Create session
// app.use(session({
//     secret: secret,
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: false }
// }));
// app.use(passport.session());
// app.use(passport.initialize());

// Create MongoDB connection using mongoose
const mongodb = process.env.MONGODB_URI || "";
mongoose.connect(mongodb).then((connection: any) => {
    console.log("MongoDB connected", mongodb);

    // Start Express server
    server.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
});
