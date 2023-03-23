import mongoose from "mongoose";

// create a users model
const users = new mongoose.Schema({
	username: { type: String, required: true },
	password: { type: String, required: true },
	email: { type: String, required: true },
	socketId: { type: String, required: false },
	role: {
		type: String,
		required: true,
		default: "user",
		enum: ["admin", "editor", "user"],
	},
});

export default mongoose.model("users", users);
