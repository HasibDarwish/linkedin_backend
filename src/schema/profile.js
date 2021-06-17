import mongoose from "mongoose";
import experienceModel from "./experience.js";

const { Schema, model } = mongoose;

const experienceSchema = new Schema(
	{
		role: {
			type: String,
			required: true,
		},
		company: {
			type: String,
			required: true,
		},
		startDate: {
			type: String,
			required: true,
		},
		endDate: {
			type: String,
			default: null,
		},
		description: {
			type: String,
			required: true,
		},
		area: {
			type: String,
			required: true,
		},
		image: {
			type: String,
			required: false,
			default: "https://source.unsplash.com/random",
		},
	},
	{ timestamps: true }
);

const profileSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		surname: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		bio: {
			type: String,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		area: {
			type: String,
			required: true,
		},
		image: {
			type: String,
			required: false,
			default: "https://source.unsplash.com/random",
		},
		username: {
			type: String,
			required: true,
			unique: true,
		},
		experiences: [
			{
				type: experienceSchema,
				required: false,
			},
		],
	},
	{ timestamps: true }
);

export default model("Profile", profileSchema);
