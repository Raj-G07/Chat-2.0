//const express = require('express')//
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import userRoute from "./routes/userRoute.js"
import postRoute from "./routes/postRoute.js"
import messageRoute from "./routes/messageRoute.js"
import cookieParser from "cookie-parser";
import cors from "cors"
import path from "path"
import {app ,server} from "./socket/socket.js"
dotenv.config({});


const PORT= process.env.PORT || 5000;
const __dirname= path.resolve()

app.use(express.urlencoded({extended:true}))
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}))

app.use("/api/v1/user",userRoute);
app.use("/api/v1/post",postRoute)
app.use("/api/v1/message",messageRoute)

server.listen(PORT,()=>{
    connectDB();
    console.log(`Server listen at port ${PORT}`)
})