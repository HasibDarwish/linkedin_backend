import express from "express";
import listEndpoints from "express-list-endpoints";
import mongoose from "mongoose";
import cors from "cors";
import profileRouter from "./service/profile.js";
import experienceRouter from "./service/experience.js";
import PostRouter from "./service/post.js";
import tokenRouter from './authentication/index.js'
import CommentsRouter from "./service/comments.js";
import LikesRouter from "./service/likes.js";
import AuthorizeUser from './authentication/authorization.js'
import { trackEndpoints } from "./log/index.js";

import {
	badRequestHandler,
	unAuthorizedHandler,
	forBiddenHandler,
	notFoundHandler,
	catchAllHandler,
} from "./errorHandler/index.js";



const server = express();
const { PORT, MONGO_CONNECTION_ATLAS } = process.env;

server.use(trackEndpoints);

server.use(express.json());
server.use(cors());

server.use("/api", tokenRouter);

server.use(AuthorizeUser);
server.use("/api", profileRouter);
server.use("/api", experienceRouter);
server.use("/api/posts", PostRouter);
server.use("/api/posts", CommentsRouter);
server.use("/api/posts", LikesRouter);

server.use(badRequestHandler);
server.use(unAuthorizedHandler);
server.use(forBiddenHandler);
server.use(notFoundHandler);
server.use(catchAllHandler);

mongoose
	.connect(MONGO_CONNECTION_ATLAS, {
		useCreateIndex: true,
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	})
	.then(
		server.listen(PORT, () => {
			console.table(listEndpoints(server));
			console.table({ "Running At Port Number": PORT });
		})
	);
