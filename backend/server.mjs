import app from "./app.mjs";
import db from "./Config/database.mjs";
import dotenv from 'dotenv';
import { Server as SocketServer } from "socket.io";
import Document from "./Schema/documentSchema.mjs";
import jwt from "jsonwebtoken";
import User from "./Schema/userSchema.mjs";

dotenv.config();

const httpServer = app.listen(process.env.PORT, () => {
    console.log(`Listening on: ${process.env.PORT}`);
});

db();

const io = new SocketServer(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    }
});

io.on("connection", socket => {
    socket.on("first-document", async (token, id) => {
        try {
            const decode = await jwt.verify(token, process.env.JWT_SECRET);
            const found = await User.findById(decode._id);
            if (found.documents.includes(id) || found.collaborations.includes(id)) {
                const data = await Document.findById(id);
                socket.emit("first-document-get", data);
            } else {
                console.warn("User is not authorized to access this document");
                socket.emit("authorization-failed");
            }
            // Store the user ID associated with this socket
            socket.userId = decode._id;
        } catch (error) {
            console.error("Error while verifying token:", error.message);
            socket.emit("authorization-failed");
        }
    });

    socket.on("send-change", delta => {
        socket.broadcast.emit("recieved-change", delta);
    });

    socket.on("send-cursor", cursorIndex => {
        // Broadcast the cursor position to other users
        console.log("cursor sent");
        socket.broadcast.emit("recieve-cursor", { userId: socket.userId, cursorIndex });
    });

    socket.on("disconnect", () => {
        // Handle disconnection: Remove user's cursor data
        socket.broadcast.emit("remove-cursor", socket.userId);
    });

    socket.on("save-doc", async (id) => {
        console.log("id", id);
        try {
            const save = await Document.findByIdAndUpdate(id.id, { data: id.delta });
            console.log("document saved", save);
        } catch (error) {
            console.log(error);
            console.log("document not saved");
        }

    });
    console.log("User Connected");
});
