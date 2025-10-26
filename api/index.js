import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import express from "express";
import bodyParser from "body-parser";

const app = express();

import users from "../controller/user.js";
import auth from "../controller/auth.js";
import movie from "../controller/movie.js";
import genre from "../controller/genre.js";

//To prevent CORS errors
app.use(cors());

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
app.use(bodyParser.json({ limit: "10mb" }));

//Connecting mongoDB
import "../utils/mongodb.js"; //Database

//App routes to handle requests
app.use("/api/movies", movie);
app.use("/api/genres", genre);
app.use("/api/users", users);
app.use("/api/auth", auth);

export default app;