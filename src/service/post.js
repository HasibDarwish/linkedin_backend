import { Router } from "express";
import createError from "http-errors"
import PostModel from "../schema/post.js";
import ProfileModel from "../schema/profile.js";

const PostRouter = Router()


PostRouter.post("/", async (req, res, next) => {

    try {
        const user = await ProfileModel.findById(req.body.user)
        if (user) {
            const newPost = new PostModel(req.body)
            const savedPost = await newPost.save()

            res.status(201).send(savedPost)
        }
        else {
            next(createError(404, `User with id: ${req.body.user} not found!`))
        }


    } catch (error) {
        console.log(error)
        if (error.name === "ValdidationError") {
            next(createError(400, error))
        } else {
            next(createError(500, "An error occurred while saving the post "))
        }

    }
})



PostRouter.get("/", async (req, res, next) => {
    try {
        const posts = await PostModel.find()
        if (posts.length > 0) {
            res.send(posts)
        } else { res.send("There are no posts yet :D ") }

    } catch (error) {
        console.log(error, "error while fetching the posts");
        next(error)
    }
})

PostRouter.get("/:postId", async (req, res, next) => {
    try {
        const id = req.params.postId
        const post = await PostModel.findById(id).populate("user")
        if (post) {
            res.send(post)
        } else {
            next(createError(404, `post with id: ${req.params.postId} not found!`))
        }

    } catch (error) {
        console.log(error)
        next(createError(500, `An error occurred while getting a specific post with id ${req.params.postId}`))
    }
})



PostRouter.put("/:postId", async (req, res, next) => {
    try {

        const post = await PostModel.findByIdAndUpdate(req.params.postId, req.body, {
            runValidators: true,
            new: true
        })
        if (post) {
            res.send(post)
        } else {
            next(createError(404, `post with id: ${req.params.postId} not found!`))
        }
    } catch (error) {
        console.log(error);
        next(createError(500, "An error occurred while modifying the post"))
    }


})



PostRouter.delete("/:postId", async (req, res, next) => {
    try {
        const post = await PostModel.findByIdAndDelete(req.params.postId)

        if (post) {
            res.status(204).send()
        } else {
            next(createError(404, `post with id: ${req.params.postId} not found!`))
        }
    } catch (error) {

        next(createError(500, "An error occurred while deleting the post"))
    }
})





export default PostRouter