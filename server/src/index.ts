import express from "express";
import { Server } from "socket.io";
import http from "http";
import dotenv from "dotenv"

// load env
dotenv.config();

// Create Express server
const app = express();
const port = process.env.PORT;

// Create HTTP server
const server = new http.Server(app);
const socketio = new Server(server, { cors: { origin: "*" } });

// Create MongoDB connection
const mongodb = process.env.MONGODB;

