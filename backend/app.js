import express from 'express'

import dotenv from "dotenv";
dotenv.config()

import connectDB from './db/connectdb'

import cors from "cors";

//Setup Express App
const app = express()

// Set up CORS
app.use(cors());
app.use('/public', express.static(__dirname + '/public'));

//Set Midleware
applyPassportStrategy(passport);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
//Load Routes
app.use("/", serverRoutes);

import bodyParser from "body-parser";
import passport from "passport";
import { applyPassportStrategy } from "./middlewares/passport";

import serverRoutes from "./routes/serverRoutes";

// Get port from environment and store in Express.
const port = process.env.PORT || '3000'
app.listen(port, () => {
    console.log(`Server listining at http://localhost:${port}`)
})

//Database Connection
const DATABASE_URL = process.env.DB_URL || 'mongodb://127.0.0.1:27017'
const DATABASE = process.env.DB || ''
connectDB(DATABASE_URL, DATABASE);