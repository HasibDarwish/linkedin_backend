import mongoose from "mongoose";

const {Schema, model} = mongoose;

const logSchema = new Schema(
	{
		TOKEN: String,
		EMAIL: String,
		REQUEST_METHOD: {
			type: String,
			required: true,
		},
		USER_AGENT: {
			type: String,
			required: true,
		},
		ACCEPT_ENCODING: {
			type: String,
			required: true,
		},
		BASE_URL: {
			type: String,
			required: true,
		},
		ROUTE_URL: {
			type: String,
			required: true,
		},
	},
	{timestamps: true}
);

export default model("Log", logSchema);
