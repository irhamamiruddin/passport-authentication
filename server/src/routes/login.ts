import { Router } from "express";
import LoginController from "../controller/login";
import { Auth } from "../lib/passport";

const app = Router();

// Send a login request through normal method
app.post("/", (req: any, res: any) => {
    LoginController.login(req, res);
});

// Send a login request through passport
// app.post("/", Auth);

// Get session token created by passport-jwt
app.get("/token", (req: any, res: any) => {
    LoginController.getToken(req, res);
});

// Respond to an unauthorized request
app.get("/unauthorized", (req: any, res: any) => {
    res.status(401).send("You are not authorized to view this page.");
});

// Logout
app.post("/logout", (req: any, res: any) => {
    LoginController.logout(req, res);
});

export default app;