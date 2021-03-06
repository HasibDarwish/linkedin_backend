import mongoose from "mongoose";
const { Schema, model } = mongoose;
import { commentSchema } from "./comments.js";
import { likeSchema } from "./like.js";

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
            default: "no image uploaded yet :/"
        },
        cloudinaryId: {
            type: String,
            required: false
        },
        comments: [
            {
                type: commentSchema,
                required: false,
            },
        ],
        likes: [
            {
                type: likeSchema,
                required: false,
                unique: true
            }
        ]
    },
    { timestamps: true }
);

export default model("Post", postSchema);