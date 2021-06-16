import mongoose from "mongoose";

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
		username: {
			type: Schema.Types.ObjectId, required: true, ref: "Profile",
		},

		image: {
			type: String,
			required: false,
			default: "https://source.unsplash.com/random",
		},
	},
	{timestamps: true}
);

export default model("Experience", experienceSchema);
