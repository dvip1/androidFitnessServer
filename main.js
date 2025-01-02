import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import logger from "morgan";
import mongoose from "mongoose";
import connectDB from "./configs/connect.js";
import userRoute from "./routes/userRoute.js";
dotenv.config();
const app = express();


app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

connectDB();

//routes
app.use("/user", userRoute);

app.get("/", (req,res)=>{
    res.send("Hello World");
})

const PORT = process.env.PORT || 5000;
mongoose.connection.once("open", () => {
     console.log("connected to db");
    app.listen(PORT, () => {
        console.log(`server started at ${PORT}`);
    });
});


mongoose.connection.on("error", (error) => {
    console.log(error);
});
