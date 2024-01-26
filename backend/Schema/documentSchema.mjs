import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  data: Object,
  title:{
    type:String,
    required:true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user", // Assuming your user model is named "User"
    required: true
  },
  collaborators: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // Assuming your user model is named "User"
    }
  ]
});

const Document = mongoose.model("documents", documentSchema);

export default Document;
