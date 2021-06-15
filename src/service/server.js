import express from "express";
import listEndpoints from "express-list-endpoints";
import mongoose from "mongoose";
import cors from 'cors'
import profileRouter from './profile/index.js'
import {
	badRequestHandler,
	unAuthorizedHandler,
	forBiddenHandler,
	notFoundHandler,
	catchAllHandler,
} from "../errorHandler/index.js";


const server = express();
const { PORT, MONGO_CONNECTION } = process.env;


server.use(express.json())
server.use(cors())

server.use("/api", profileRouter)


server.use(badRequestHandler);
server.use(unAuthorizedHandler);
server.use(forBiddenHandler);
server.use(notFoundHandler);
server.use(catchAllHandler);


mongoose
	.connect(MONGO_CONNECTION, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	})
	.then(
		server.listen(PORT, () => {
			console.table(listEndpoints(server));
			console.table({"Running At Port Number": PORT});
		})
	);
