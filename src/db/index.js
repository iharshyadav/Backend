import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDb=async ()=>{
  try {
    const connectionInstance=await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
    console.log(`\n MONGO_DB CONNECTED !! DB HOST ${connectionInstance.connection.host}`)
  } catch (error) {
    console.error("MONGO DB Connection ",error);
    process.exit(1);
  }
};

export default connectDb;