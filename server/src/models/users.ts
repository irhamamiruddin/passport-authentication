import mongoose from "mongoose";

// create a users model
const users = new mongoose.Schema({
	username: { type: String, required: true },
	password: { type: String, required: true },
	email: { type: String, required: true },
	socketId: { type: String, required: false }, // socket id for the user
	role: {
		type: String,
		required: true,
		default: "user",
		enum: ["admin", "editor", "user"],
	},
	createdAt: { type: Date, required: true, default: Date.now },
	verified: { type: Boolean, required: true, default: false }, // verified by using 6 digits number that were send through email
	verificationCode: { type: String, required: false }, // 6 digits number that were send through email
	approved: { type: Boolean, required: true, default: false }, // approval by the admin
	reason: { type: String, required: false }, // reason for not being approved
	lastEdit: { type: Date, required: false }, // last edit date
	lastEditBy: { type: String, required: false }, // the person who last edit
});

export default mongoose.model("users", users);
