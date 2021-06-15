import mongoose from "mongoose";

const { Schema, model } = mongoose;

const postSchema = new Schema(
    {
        text: {
            type: String,
            required: [true, "Why no text :P ? "]
        },
        username: {
            type: String,
            default: "admin", // Can not get the idea of "username" atm
        },                  // so i set the default value to admin
        user: {
            type: Schema.Types.ObjectId, required: true, ref: "Profile"
        },
        image: {
            type: String,
            required: false,

        },
    },
    { timestamps: true }
);

export default model("Post", postSchema);