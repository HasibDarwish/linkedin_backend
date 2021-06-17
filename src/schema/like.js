import mongoose from "mongoose";

const { Schema, model } = mongoose;

export const likeSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: [true, "You need to send the Profile id!"],
            ref: "Profile",
            unique: true
        }
    },
    { timestamps: true }
);

export default model("like", likeSchema);