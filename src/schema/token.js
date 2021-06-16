import mongoose from "mongoose";

const {Schema, model} = mongoose;

const tokenSchema = new Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
			unique: true,
		},
		token: {
			type: String,
			required: false,
		},
	},
	{timestamps: true}
);

export default model("Token", tokenSchema);
