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

const fetchDocuments = async(req,res)=>{
    try {
        const userId = req.body._id;
        const user = await User.findById(userId).populate({
            path: 'documents',
            model: 'document'
        });

        if(!user) res.status(404).json({"success":"false","error occured":"not found user documents"});

        const documents = user.documents;
        res.status(200).json({success:true,documents});
    } catch (error) {
        res.status(400).json({success:false,error});
    }
}

const fetchById = async (req,res)=>{
    try {
        const docId = req.body.id;
        const doc = await Document.findById(docId);

        res.status(200).json({success:true,doc});
    } catch (error) {
        res.status(400).json({success:false,error});
    }
}

const addDocument = async (req,res)=>{
    try {
        const userId = req.body._id;
        const data = req.body.data;

        // Create a new document
        const newDocument = await Document.create({ data });

        // Find the user by ID and push the new document to the 'documents' array
        const user = await User.findByIdAndUpdate(userId, { $push: { documents: newDocument._id } }, { new: true });

        res.status(200).json({ success: true, message: 'Document added successfully', newDocument });
    } catch (error) {
        res.status(400).json({ success: false, error });
    }
}

const deleteDocument = async (req, res) => {
    try {
        const userId = req.body._id;
        const documentIdToDelete = req.params.documentId; // Assuming you pass the document ID in the request parameters

        // Find the user by ID and pull the document ID from the 'documents' array
        const user = await User.findByIdAndUpdate(userId, { $pull: { documents: documentIdToDelete } }, { new: true });

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        // Delete the document itself
        await Document.findByIdAndDelete(documentIdToDelete);

        res.status(200).json({ success: true, message: 'Document deleted successfully', user });
    } catch (error) {
        res.status(400).json({ success: false, error });
    }
}

const fetchCollaborater = async (req, res) => {
    try {
        const userId = req.body.id;

        const data = await User.findById(userId).populate('collaborations');

        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error:', error);
        res.status(400).json({ success: false, error: error.message });
    }
};



const addCollaborater = async (req,res)=>{
    try {
        const userId = req.body.id;
        const adder = req.body.adder;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $push: { collaborations: adder } },
            { new: true } 
        );

        res.json({ success: true, message: "Collaborator added successfully", updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export { createUser, loginUser, getUser, fetchDocuments, addDocument, deleteDocument, fetchById, fetchCollaborater, addCollaborater }; 