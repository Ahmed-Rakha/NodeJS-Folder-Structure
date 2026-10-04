import { MongoClient } from "mongodb";
import mongoose from "mongoose";
import { DB_URI, PORT, NODE_ENV } from "../config.js";

const client = new MongoClient(DB_URI);
export const DB = client.db("assignment_5");
export async function bootstrapDB(app) {
  try {
    await mongoose.connect(DB_URI);
    console.log(`Connected to DB successfully from NODE_ENV ${NODE_ENV}`);
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} from NODE_ENV ${NODE_ENV}`);
    });
  } catch (error) {
    console.log(`Error connecting to DB ${error}`);
  }
}
