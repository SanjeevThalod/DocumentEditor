import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email: {
        type: String,
        required: true,
        unique: true, 
        lowercase: true, 
        trim: true 
    },
    password: {
        type: String,
        required: true
    },
    documents:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'documents'
    }]
    ,
    collaborations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }]
});

// hashing
userSchema.pre("save", async function (next) {
    if(!this.isModified("password")){
      next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

// comparing
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}

// Generating Token
userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
        expiresIn: "10d" 
    });
    return token;
};

const User = mongoose.model("user",userSchema);

export default User;