import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  data:Object
});

const Document = mongoose.model("document", documentSchema);

export default Document;
