import { Router } from "express";
import createError from "http-errors"
import PostModel from "../schema/post.js";
import ProfileModel from "../schema/profile.js";
import multer from "multer"
import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"

const PostRouter = Router()

//~~~~~~~~~~~~~~~~~~~~~~~ POSTS SECTION~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

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

// Posting images 

const { CLOUDINARY_NAME, CLOUDINARY_KEY, CLOUDINARY_SECRET } = process.env
cloudinary.config({
    cloud_name: CLOUDINARY_NAME,
    api_key: CLOUDINARY_KEY,
    api_secret: CLOUDINARY_SECRET
})


// this comes from the library "multer-storage-cloudinary"
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "Build_Week_3",
        //     public_id: async (req, file) => {
        // here i can choose a custom public_id 
        //     }
    }

});


// https://dev.to/itsmefarhan/cloudinary-files-images-crud-operations-with-nodejs-express-multer-2147


PostRouter.post("/withImage", multer({ storage }).single("cover"), async (req, res, next) => {
    try {

        const user = await ProfileModel.findById(req.body.user)
        if (user) {

            let fileNameWithSlash = req.file.filename
            let indexOfSlash = fileNameWithSlash.indexOf("/")
            let fileNameWithoutSlash = fileNameWithSlash.slice(indexOfSlash + 1,)
            let body = {
                text: req.body.text,
                user: req.body.user,
                image: req.file.path,
                cloudinaryId: fileNameWithoutSlash
            }
            const newPost = new PostModel(body)
            const savedPost = await newPost.save()

            res.status(201).send(savedPost)
        }
        else {
            next(createError(404, `User with id: ${req.body.user} not found!`))
        }


    } catch (error) {
        console.log(error);
        next(createError(500, "An error occurred while posting with image "))
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
        const post = await PostModel.findById(req.params.postId)

        if (post) {
            // console.log(post + "  this is the Post");
            if (post.cloudinaryId) {
                console.log(post.cloudinaryId + "    this is the cloudinary id");
                await cloudinary.uploader.destroy(post.cloudinaryId
                    , function (result) { console.log(result) });
                // this just doesnt work somehow 
            } await PostModel.findByIdAndDelete(req.params.postId)
            res.status(204).send()

        } else {
            next(createError(404, `post with id: ${req.params.postId} not found!`))
        }
    } catch (error) {
        console.log(error);
        next(createError(500, "An error occurred while deleting the post"))
    }
})

//~~~~~~~~~~~~~~~~~~~~~~~ COMMENTS SECTION~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// gets all comments for a specific postId
PostRouter.get("/:postId/comment", async (req, res, next) => {
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
PostRouter.post("/:postId/comment", async (req, res, next) => {
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
        next(createError(500, `An error occurred while posting the comment for the  post with id ${req.params.postId}`))
    }
})

PostRouter.delete("/:postId/comment/:commentId", async (req, res, next) => {
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

PostRouter.put("/:postId/comment/:commentId", async (req, res, next) => {
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



export default PostRouter