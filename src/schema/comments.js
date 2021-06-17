import mongoose from "mongoose";

const { Schema, model } = mongoose;

export const commentSchema = new Schema(
    {
        text: {
            type: String,
            required: [true, "Why no text :P ? "]
        },
        userId: {
            type: Schema.Types.ObjectId, required: [true, "You need to send the Profile id!"], ref: "Profile"
        }
    },
    { timestamps: true }
);

export default model("Comment", commentSchema);