import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();
const url = process.env.URL

const db = async ()=>{
    try {    
        await mongoose.connect(url);
        console.log(`Connected to DB`);
    } catch (error) {
        console.log(`Error Occured: ${error}`);
    }
}

export default db;