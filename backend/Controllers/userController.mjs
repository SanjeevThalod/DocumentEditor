import Document from "../Schema/documentSchema.mjs";
import User from "../Schema/userSchema.mjs";
import sendToken from "../Utils/sendToken.mjs";

const createUser = async(req,res)=>{

    try {
        const {name,email,password} = req.body;
    
        const unique = await User.findOne({email});
        if(unique) res.status(400).json({"Error":"Email already registered"});
    
        const create = await User.create({name,email,password});
    
        sendToken(create,201,res);
    } catch (error) {
        res.status(400).json({"Error":error});
    }
};

const loginUser = async(req,res)=>{
    try {
        const {email,password} = req.body;

        const findUser = await User.findOne({email});
        if(!findUser) res.status(400).json({"success":"false","error":"email not registered"});

        const match = await findUser.comparePassword(password);

        if(!match) res.status(400).json({"success":"false","error":"password did not match"});

        sendToken(findUser,200,res);
    } catch (error) {
        res.status(400).json({"success":"false","error":"server error"});
    }
}

const getUser = async(req,res)=>{
    const {name,email} = req.body
    try {
        const users = await User.find({
            $or: [
                { name: { $regex: new RegExp(name, 'i') } },
                { email: { $regex: new RegExp(email, 'i') } }
            ]
        }).select('-password');

        res.status(200).json({ success: true, users });
    } catch (error) {
        res.status(400).json({success:false,error});
    }
}

export { createUser, loginUser, getUser }; 