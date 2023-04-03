import dotenv from "dotenv";
import crypto from "crypto";

export var passport = require("passport");

// load env
dotenv.config();

const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

// hash function
export const Hash = (plaintext: string) => crypto.createHash("sha256")
    .update(plaintext)
    .digest("hex");

// hash the secret key
export const secretKey = Hash(`${process.env.SECRET_KEY}|${process.env.OP_CODE}`);

// jwt strategy
export const creds = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    jsonWebTokenOptions: {
        op: process.env.OP_CODE,
    },
    issuer: process.env.ISSUER,
    audience: process.env.AUDIENCE,
    secretOrKey: secretKey,
};

// use passport with jwt strategy
passport.use(
    new JwtStrategy(
        creds,
        (jwtPayload: any, done: any) => {
            return done(null, jwtPayload);
        }
    )
);

export const Auth = passport.authenticate("jwt", { session: false, failureRedirect: "/api/login/unauthorized" });

// create token for user session
export const createToken = (username: any, email: any) => {
    const newData = {
        op: process.env.OP_CODE,
        iss: process.env.ISSUER,
        aud: process.env.AUDIENCE,
        email: email,
        name: username,
        iat: Math.floor(new Date().getTime() / 1000),
        exp: Math.floor(new Date().getTime() / 1000 + 18000), // 5 hours
    };
    const jwt = require("jsonwebtoken");
    const token = jwt.sign(newData, secretKey); // sign user in with hashed secret key as jwt

    return token;
}