import model from "../models/users";
import { Hash, createToken } from "../lib/passport";

const LoginController = {
    login: async (req: any, res: any) => {
        return new Promise((resolve: any, reject: any) => {
            // Find the user by email address or username
            model.findOne({ $or: [{ email: req.body.username }, { username: req.body.username }] })
                .then((data: any) => {
                    if (data) {
                        if (data.password === Hash(req.body.password)) {

                            // create token and login user
                            const token = createToken(data.username, data.email);
                            res.send({
                                message: "Login Successful!",
                                email: data.email, // get user email
                                token: token, // send token to client
                                role: data.role, // get user role 
                                verified: data.verified, // get user verification status
                                approved: data.approved // get user approval status
                            });
                            resolve(data);
                        } else {
                            res.send({ message: "Login Failed! Incorrect Password." });
                        }
                    } else {
                        res.send({ message: "Unknown email address." });
                    }


                })
                .catch((err: any) => {
                    res.send(err);
                    reject(err);
                });
        });
    },

    getToken: async (req: any, res: any) => {
        const data = {
            op: process.env.OP_CODE,
            iss: process.env.ISSUER,
            aud: process.env.AUDIENCE,
            email: req.user.email,
            name: req.user.username,
            iat: Math.floor(new Date().getTime() / 1000),
            exp: Math.floor(new Date().getTime() / 1000 + 18000), // 5 hours
        }

        // sign user in with hashed secret key as jwt

    },

    logout: async (req: any, res: any) => {
        req.logout();
        res.send("You have been logged out.");
    },
};

export default LoginController;