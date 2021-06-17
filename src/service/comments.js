import { Router } from "express";
import createError from "http-errors"
import PostModel from "../schema/post.js";

const CommentsRouter = Router()

CommentsRouter.get("/:postId/comment", async (req, res, next) => {
    try {
        const id = req.params.postId
        const post = await PostModel.findById(id)
        if (post) {
            res.send(post.comments ? post.comments : "there are no comments yet :D")
        } else {
            next(createError(404, `post with id: ${req.params.postId} not found!`))
        }

    } catch (error) {
        console.log(error)
        next(createError(500, `An error occurred while getting the comments for the  post with id ${req.params.postId}`))
    }
})
// posts a comment for a specific postId
CommentsRouter.post("/:postId/comment", async (req, res, next) => {
    try {
        const id = req.params.postId
        const post = await PostModel.findById(id)
        if (post) {
            const postWithComment = await PostModel.findByIdAndUpdate(
                req.params.postId,
                {
                    $push: { comments: req.body }
                },
                {
                    runValidators: true, new: true
                }
            )
            res.send(postWithComment)
        } else {
            next(createError(404, `post with id: ${req.params.postId} not found!`))
        }

    } catch (error) {
        console.log(error)
        // if (error.message.includes("Validation failed")) {
        //     next(createError(400, error._message))
        // }
        // else {
        next(createError(500, error.errors.comments.errors.text.message))
        // }

    }
})

CommentsRouter.delete("/:postId/comment/:commentId", async (req, res, next) => {
    try {
        const post = await PostModel.findById(req.params.postId)
        if (post) {
            const comment = post.comments.filter(comment => comment._id == req.params.commentId)[0]
            if (comment) {
                await PostModel.findByIdAndUpdate(
                    req.params.postId,
                    {
                        $pull: {
                            comments: { _id: req.params.commentId }
                        }
                    },
                    {
                        new: true
                    }
                )
                res.status(201).send(`comment with id:${req.params.commentId} is successfully deleted!!`)
            } else {
                next(createError(404, `comment with id: ${req.params.commentId} not found!`))
            }
        } else {
            next(createError(404, `post with id: ${req.params.postId} not found!`))
        }
    } catch (error) {
        console.log(error)
        next(createError(500, `An error occurred while deleting the comment ${req.params.commentId} for the  post  ${req.params.postId}`))
    }
})

CommentsRouter.put("/:postId/comment/:commentId", async (req, res, next) => {
    try {
        const post = await PostModel.findById(req.params.postId)
        if (post) {
            const comment = post.comments.filter(comment => comment._id == req.params.commentId)[0]
            if (comment) {
                const updatedPost = await PostModel.findOneAndUpdate(
                    { _id: req.params.postId, "comments._id": req.params.commentId },
                    {
                        $set: { "comments.$.text": req.body.text }
                    }
                    , {
                        runValidators: true,
                        new: true
                    }
                )

                res.status(201).send(updatedPost.comments)
            } else {
                next(createError(404, `comment with id: ${req.params.commentId} not found!`))
            }
        } else {
            next(createError(404, `post with id: ${req.params.postId} not found!`))
        }
    } catch (error) {
        console.log(error)
        next(createError(500, `An error occurred while deleting the comment ${req.params.commentId} for the  post  ${req.params.postId}`))
    }
})

export default CommentsRouter