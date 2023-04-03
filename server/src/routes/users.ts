// User routes
import { Router } from "express";
import UserController from "../controller/users";

const app = Router();

// Get all users
app.get("/", (req: any, res: any) => {
	UserController.getAllUsers(req, res);
});

// Get a user by passing the id in the url
app.get("/getUser/:id", (req: any, res: any) => {
	UserController.getUser(req.params.id, req, res);
});

// Get a user without passing the id in the url
app.get("/getUser", (req: any, res: any) => {
	UserController.getUser(req.body._id, req, res);
});

// Insert a new user
app.post("/", (req: any, res: any) => {
	UserController.insertUser(req, res);
});

// Register a new user
app.post("/register", (req: any, res: any) => {
	UserController.registerUser(req, res);
});

// Verify a user
app.put("/verify", (req: any, res: any) => {
	UserController.verifyUser(req, res);
});

// Update a user by passing the id in the url
app.put("/:id", (req: any, res: any) => {
	UserController.updateUser(req.params.id, req, res)
});

// Update user without passing id in the url
app.put("/", (req: any, res: any) => {
	UserController.updateUser(req.body._id, req, res)
});

// Reset password
app.post("/resetPassword", (req: any, res: any) => {
	UserController.resetPassword(req, res);
});

// Change to new password if verification code match the one in the database for the user
app.post("/updatePassword", (req: any, res: any) => {
	UserController.updatePassword(req, res);
});

// Delete a user by passing the id in the url
app.delete("/:id", (req: any, res: any) => {
	UserController.deleteUser(req.params.id, req, res)
});

// Delete user without passing id in the url
app.delete("/", (req: any, res: any) => {
	UserController.deleteUser(req.body._id, req, res)
});

// delete many users
app.delete("/deleteMany", (req: any, res: any) => {
	UserController.deleteMany(req, res)
});

// approve user
app.post("/approve", (req: any, res: any) => {
	UserController.approveUser(req, res);
});

export default app;
