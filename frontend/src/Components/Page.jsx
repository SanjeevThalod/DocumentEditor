import React, { useCallback, useEffect, useState } from 'react';
import Quill from 'quill';
import '../quills.css';
import { useParams } from 'react-router-dom';
import 'quill/dist/quill.snow.css';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

const TOOLBAR_OPTION = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['bold', 'italic', 'underline'],
  [{ color: [] }, { background: [] }],
  [{ script: 'sub' }, { script: 'super' }],
  [{ align: [] }],
  ['image', 'blockquote', 'code-block'],
  ['clean'],
];


const Page = () => {
  const [quill, setQuill] = useState(null);
  const [data, setData] = useState([]);
  const { id } = useParams();
  const [socket,setSocket] = useState();
  const navigate = useNavigate();
  
  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return;
    wrapper.innerHTML = '';
    const editor = document.createElement('div');
    wrapper.append(editor);
    const q = new Quill(editor, { theme: 'snow', modules: { toolbar: TOOLBAR_OPTION } });
    setQuill(q);
  }, []);
  
  
  // connection to socket io
  useEffect(()=>{
    if(localStorage.getItem("authToken") === null) navigate("/login");
    const s = io("http://localhost:5000");
    setSocket(s);
  
    return ()=>{
      s.disconnect();
    }
  },[]);

  // first sent
  useEffect(()=>{
    if(socket == null || quill == null || !quill.getContents()) return;
    socket.emit("first-document",localStorage.getItem("authToken"),id);
    const handler = (delta)=>{
      quill.setContents(delta.data);
    }
    socket.on("first-document-get",handler);
    const handler2 = ()=>{
      const d = {
        "ops": [
          { "insert": "You are not authorized to access this file.\n", "attributes": { "color": "red" } }
        ]
      }      
      quill.setContents(d);
      const interval = setInterval(()=>{
        navigate("/");
      },1500)
    }
    socket.on("authorization-failed",handler2);
  },[socket,quill]);

  // send changes
  useEffect(()=>{
    if(socket == null || quill == null) return;
    const handler = (delta,oldDelta,source)=>{
      if(source !== 'user') return ;
      socket.emit("send-change",delta);
    }
    quill.on("text-change",handler);
    return ()=>{
      quill.off("text-change",handler);
    }
  },[quill,socket]);

  // recieve change
  useEffect(()=>{
    if(socket == null || quill == null) return ;
    const handler = (delta)=>{
      quill.updateContents(delta);
    }
    socket.on("recieved-change",handler);
    return ()=>{
      socket.off("recieved-change",handler);
    }
  },[socket,quill]);

  // save-doc
  useEffect(()=>{
    const inteval = setInterval(()=>{
      if(socket == null || quill == null) return ;
      socket.emit("save-doc",{ id:id, delta: quill.getContents() });
    },8000);

    return ()=>{
      clearInterval(inteval);
    }
  },[socket,quill,id]);


  return <div className='textContainer' ref={wrapperRef}></div>;
};

export default Page;
