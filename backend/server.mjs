import app from "./app.mjs";
import db from "./Config/database.mjs";
import dotenv from 'dotenv';
import {Server as SocketServer} from "socket.io";
import { findOrCreate } from "./Controllers/documentController.mjs";
import Document from "./Schema/documentSchema.mjs";
import { fetchById } from "./Controllers/userController.mjs";
import jwt from "jsonwebtoken";
import User from "./Schema/userSchema.mjs";

dotenv.config();

const httpServer = app.listen(process.env.PORT,()=>{
    console.log(`Listening on: ${process.env.PORT}`);
});

db();

const io = new SocketServer(httpServer,{
    cors:{
        origin:'*',
        methods:['GET','POST'],
    }
});

io.on("connection",socket=>{
    // socket.on("get-document",async documentId=>{
    //     const document = await findOrCreate(documentId);
    //     const data = "";
    //     socket.join(documentId)
    // });

    socket.on("first-document", async (token,id)=>{
        const decode = await jwt.verify(token,process.env.JWT_SECRET);
        const found = await User.findById(decode._id);
        if (found.documents.includes(id)) {
            const data = await Document.findById(id);
            socket.emit("first-document-get", data);
        } else {
            console.warn("User is not authorized to access this document");
            socket.emit("authorization-failed");
        }
    });

    socket.on("send-change",delta => {
        socket.broadcast.emit("recieved-change",delta);
    });

    socket.on("save-doc",async (id)=>{
        console.log("id",id);
        try {
            const save = await Document.findByIdAndUpdate(id.id, {data:id.delta});
            console.log("document saved", save);
        } catch (error) {
            console.log(error);
            console.log("document not saved");
        }
        
    })

    //socket.emit("load-document",document.data);

    // socket.on("send-changes",delta=>{
    //     //socket.broadcast.to(documentId).emit("recieve-change",delta);
    // });

    // socket.on("save-document", async data => {
    //     // await Document.findByIdAndUpdate(documentId,{data});
    // })
    console.log("User Connected");
});
