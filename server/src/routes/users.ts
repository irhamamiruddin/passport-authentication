// User routes
import { Router } from "express";
import users from "../models/users";
import UserController from "../controller/users";

const app = Router();

// Get all users
app.get("/", (req: any, res: any) => {
	UserController.getUsers(req, res);
});

// Insert a new user
app.post("/id", (req: any, res: any) => {
	// console.log("hihi", req.body);
	UserController.insertUser(req.body).then((data: any) => {
		console.log(data);
		res.send({ data: data });
	});
});

export default app;
