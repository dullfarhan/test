import mongoose from "mongoose";

const connectDB = async (DATABASE_URL, DATABASE) => {
	try{
		const DB_OPTIONS = {
		    dbName: DATABASE
		}
		mongoose.set("strictQuery", false);
		await mongoose.connect(DATABASE_URL, DB_OPTIONS);
		console.log("Database Connected Successfully..");
	} catch (err) {
		console.log(err);
	}
}

export default connectDB;