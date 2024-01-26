import Document from '../Schema/documentSchema.mjs';
import User from '../Schema/userSchema.mjs';

const fetchDocuments = async (req, res) => {
    try {
        const userId = req.body._id;
        const user = await User.findById(userId).populate([
            {
                path: 'documents',
                select: '-password',
            },
            {
                path: 'collaborations',
                select: '-password',
            }
        ]);

        if (!user) res.status(404).json({ "success": "false", "error occured": "not found user documents" });

        const documents = user;
        res.status(200).json({ success: true, documents });
    } catch (error) {
        res.status(400).json({ success: false, error });
    }
}


const fetchCollDoc = async (req, res) => {
    try {
        const userId = req.body._id;

        const docs = await User.findById(userId).populate({
            path: "collaborations",
            select: "-password"
        });

        res.status(200).json({ success: true, documents: docs.collaborations });
    } catch (error) {
        res.status(400).json({ success: false, error });
    }
}

const fetchDocById = async (req, res) => {
    try {
        const docId = req.params._id;
        const doc = await Document.findById(docId);

        res.status(200).json({ success: true, doc });
    } catch (error) {
        res.status(400).json({ success: false, error });
    }
}

const createDocument = async (req, res) => {
    try {
        const userId = req.body._id;
        const title = req.body.title;
        const data = req.body.data;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        const newDocument = await Document.create({ data, owner: userId, title });

        await User.findByIdAndUpdate(userId, { $push: { documents: newDocument._id } }, { new: true });

        res.status(200).json({ success: true, message: 'Document added successfully', newDocument });
    } catch (error) {
        res.status(400).json({ success: false, error });
    }
}

const deleteDocument = async (req, res) => {
    try {
        const userId = req.body._id;
        const documentIdToDelete = req.params._id;

        const user = await User.findByIdAndUpdate(userId, { $pull: { documents: documentIdToDelete } }, { new: true });

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        const documentToDelete = await Document.findById(documentIdToDelete);

        if (!documentToDelete) {
            return res.status(404).json({ success: false, error: 'Document not found' });
        }

        await Document.findByIdAndDelete(documentIdToDelete);

        res.status(200).json({ success: true, message: 'Document deleted successfully', user });
    } catch (error) {
        res.status(400).json({ success: false, error });
    }
}

const addCollaborator = async (req, res) => {
    try {
        const docId = req.body._id;
        const adder = req.body.adder;

        const adderUpdate = await User.findByIdAndUpdate(
            adder,
            { $push: { collaborations: docId } },
            { new: true }
        );

        const updateDoc = await Document.findByIdAndUpdate(
            docId,
            { $push: { collaborators: adder } },
            { new: true }
        );

        res.json({ success: true, message: "Collaborator added successfully", updateDoc });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export { fetchDocuments, fetchCollDoc, fetchDocById, createDocument, deleteDocument, addCollaborator };
