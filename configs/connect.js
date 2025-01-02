import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

let db_url = "";
console.log("This thigns" + db_url);
if (process.env.NODE_ENV === "pro")
    db_url = process.env.REMOTE_DATABASE_URL || "";
else db_url = process.env.MONGO_SECRET_URI;

console.log("what's DB URL" + db_url);
mongoose.set("strictQuery", false);
const connectDB = async () => {
    try {
        await mongoose.connect(db_url);
    } catch (error) {
        console.log(error);
    }
};
export default connectDB;
