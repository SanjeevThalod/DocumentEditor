import React, { useCallback, useEffect, useState} from 'react';
import Quill from 'quill';
import '../quills.css';
import "quill/dist/quill.snow.css";
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';

const TOOLBAR_OPTION= [
    [{header:[1,2,3,4,5,6,false]}],
    [{font:[]}],
    [{list:"ordered"},{list:"bullet"}],
    ["bold","italic","underline"],
    [{color:[]},{background:[]}],
    [{script:"sub"},{script:"super"}],
    [{align:[]}],
    ["image","blockquote","code-block"],
    ["clean"],
]

const Document = () => {
    const [socket,setSocket] = useState();
    const [quill,setQuill] = useState();
    const {id: documentId} = useParams();
    const SAVE_INTERVAL_MS = 20000;
    const wrapperRef = useCallback((wrapper)=>{
        if(wrapper == null) return;
        wrapper.innerHTML = "";
        const editor = document.createElement('div');
        wrapper.append(editor);
        const q = new Quill(editor,{theme:"snow", modules:{toolbar:TOOLBAR_OPTION}});
        setQuill(q);
    },[]);

    useEffect(()=>{
        const s = io("http://localhost:5000");
        setSocket(s);

        return ()=>{
            s.disconnect();
        }
    },[]);

    useEffect(()=>{
        if(socket == null ||  quill == null) return ;
        const handler = (delta,oldDelta,source)=>{
            if(source !== 'user') return ;
            socket.emit("send-changes",delta);
            console.log(delta);
        };
        quill.on('text-change',handler);
        console.log(quill.contents);

        return ()=>{
            quill.off("text-change",handler);
        }
    },[socket,quill]);

    useEffect(()=>{
        if(socket == null || quill == null) return ;
        const handler = (delta)=>{
            quill.updateContents(delta);
        }
        socket.on("recieve-change",handler);

        return ()=>{
            socket.off("recieve-change",handler);
        }
    },[socket,quill]);
    useEffect(()=>{
        if(socket == null || quill == null ) return;

        socket.emit("get-document",documentId);
        socket.once("load-document",document=>{
            quill.setContents(document);
            quill.enable();
        })
    },[quill,socket,documentId]);
    useEffect(()=>{
        if(socket == null || quill == null) return ;
        const interval = setInterval(()=>{
            socket.emit("save-document",quill.getContents());
        },SAVE_INTERVAL_MS)

        return ()=>{
            clearInterval(interval);
        }
    },[socket,quill,documentId]);
    return (
        <div className='textContainer' ref={wrapperRef}>
            
        </div>
    );
};

export default Document;