// import express from 'express';
import dotenv from "dotenv";
import connectDb from './db/index.js';

// const app = express();
dotenv.config({
    path:"./env"    
})

connectDb();

// app.get("/",(req,res)=>{
//     res.send("Hello World");
// })

// const port = 3000;

// app.listen(port,()=>{
//     console.log(`listening to port : ${port}`)
// })