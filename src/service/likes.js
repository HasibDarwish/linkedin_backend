import { Router } from "express";
import createError from "http-errors"
import PostModel from "../schema/post.js";

const LikesRouter = Router()

LikesRouter.post("/:postId/like", async (req, res, next) => {
    try {
        const id = req.params.postId
        const post = await PostModel.findById(id)
        if (post) {
            if (post.likes.filter(like => like.userId == req.body.userId)) {
                next(createError(400, "user has already liked this post before!"))
            }
            const postWithLike = await PostModel.findByIdAndUpdate(
                req.params.postId,
                {
                    $push: { likes: req.body }
                },
                {
                    runValidators: true, new: true
                }
            )
            res.send(postWithLike)
        } else {
            next(createError(404, `post with id: ${req.params.postId} not found!`))
        }

    } catch (error) {
        console.log(error)
        // if (error.message.includes("Validation failed")) {
        //     next(createError(400, error._message))
        // }
        // else {
        next(createError(500, error.message))
        // }

    }
})

LikesRouter.delete("/:postId/like", async (req, res, next) => {
    try {
        const post = await PostModel.findById(req.params.postId)
        if (post) {
            const like = post.likes.filter(like => like.userId == req.body.userId)[0]
            if (like) {
                await PostModel.findByIdAndUpdate(
                    req.params.postId,
                    {
                        $pull: {
                            likes: { _id: like._id }
                        }
                    },
                    {
                        new: true
                    }
                )
                res.status(201).send(`like  is successfully deleted!!`)
            } else {
                next(createError(404, `the user ${req.body.userId} has no likes to remove!`))
            }
        } else {
            next(createError(404, `post with id: ${req.params.postId} not found!`))
        }
    } catch (error) {
        console.log(error)
        next(createError(500, `An error occurred while deleting the like ${req.params.likeId} for the  post  ${req.params.postId}`))
    }
})

export default LikesRouter