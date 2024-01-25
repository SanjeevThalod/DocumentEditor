import Document from '../Schema/documentSchema.mjs';

const findOrCreate = async (id)=>{
    try {
        if(id == null) return;

        const document = await Document.findById({id});
        if(document) return document;

        return await Document.create({_id:id,data:""});
    } catch (error) {
        
    }
};

export {findOrCreate};