import React, { useCallback, useEffect, useState } from 'react';
import Quill from 'quill';
import '../quills.css';
import "quill/dist/quill.snow.css";
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';

const TOOLBAR_OPTIONS = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ align: [] }],
    ["image", "blockquote", "code-block"],
    ["clean"],
];

const Document = () => {
    const [socket, setSocket] = useState();
    const [quill, setQuill] = useState();
    const { id: documentId } = useParams();

    const wrapperRef = useCallback((wrapper) => {
        if (wrapper == null) return;
        wrapper.innerHTML = "";
        const editor = document.createElement('div');
        wrapper.append(editor);
        const q = new Quill(editor, { theme: "snow", modules: { toolbar: TOOLBAR_OPTIONS } });
        setQuill(q);
    }, []);

    useEffect(() => {
        const s = io("http://localhost:5000");
        setSocket(s);

        return () => {
            s.disconnect();
        };
    }, []);

    useEffect(() => {
        if (socket == null || quill == null) return;

        
        const handler = (delta, oldDelta, source) => {
            console.log("text change detected",delta);
            if (source === 'user') {
                socket.emit("send-changes", delta);
            }
        };
    
        quill.on('text-change', handler);
    
        return () => {
            quill.off('text-change', handler);
        };
    }, [socket, quill]);
    

    useEffect(() => {
        if (socket == null || quill == null) return;

        const handler = (delta) => {
            quill.updateContents(delta);
        };

        socket.on("recieve-changes", handler);

        return () => {
            socket.off("recieve-changes", handler);
        };
    }, [socket, quill]);

    useEffect(() => {
        if (socket == null || quill == null) return;

        socket.emit("get-document", documentId);
        socket.once("load-document", document => {
            quill.setContents(document);
            quill.enable();
        });
    }, [quill, socket, documentId]);

    useEffect(() => {
        if (socket == null || quill == null) return;
    
        const handler = (range, oldRange, source) => {
            if (range) {
                console.log("User cursor is on", range.index);
                socket.emit("send-cursor", range.index);
            } else {
                console.log("Cursor not in the editor");
                // Handle cursor loss (optional)
            }
        };
    
        quill.on('selection-change', handler);
    
        return () => {
            quill.off('selection-change', handler);
        };
    }, [socket, quill]);

    useEffect(() => {
        if (socket == null || quill == null) return;

        const handler = (cursorData) => {
            const cursorElement = document.querySelector(`#cursor-${cursorData.userId}`);
            if (cursorElement) {
                cursorElement.style.top = `${cursorData.cursorIndex}px`; // Adjust styling based on your UI design
            } else {
                const newCursorElement = document.createElement('div');
                newCursorElement.id = `cursor-${cursorData.userId}`;
                newCursorElement.className = 'cursor';
                newCursorElement.style.top = `${cursorData.cursorIndex}px`;
                document.querySelector('.textContainer').appendChild(newCursorElement);
            }
        };

        socket.on("recieve-cursor", handler);

        return () => {
            socket.off("recieve-cursor", handler);
        };
    }, [socket, quill]);

    useEffect(() => {
        if (socket == null || quill == null) return;

        const interval = setInterval(() => {
            console.log('saving');
            socket.emit("save-doc", { id: documentId, delta: quill.getContents() });
            console.log('saved');
        }, 20000);

        return () => clearInterval(interval);
    }, [socket, quill, documentId]);

    return (
        <div className='textContainer' ref={wrapperRef}></div>
    );
};

export default Document;
