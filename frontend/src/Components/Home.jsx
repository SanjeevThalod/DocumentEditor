import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { Link, useNavigate } from "react-router-dom";
import "../home.css";

const Home = () => {
  const [documents, setDocuments] = useState([]);
  const [colDoc, setColDoc] = useState([]);
  const navigate = useNavigate();

  const fetchDocuments = async () => {
    if (localStorage.getItem("authToken") === null) return;
    const data = await fetch("http://localhost:5000/api/fetchDocuments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: localStorage.getItem("_id"),
      }),
    });
    const response = await data.json();
    setDocuments(response.documents.documents);
    setColDoc(response.documents.collaborations);
  };

  const clickHandler = async (_id)=>{
    const dialog = document.getElementById("dialog");
    console.log(dialog);
    dialog.style.visibility = "visible";

    try {
      
    } catch (error) {
      
    }
  }

  useEffect(() => {
    if (localStorage.getItem("authToken") === null) navigate("/login");

    fetchDocuments();
  }, [navigate]);

  return (
    <div className="par">
      <Navbar />
      <div className="pare">
        <div className="conti">
          <h2>Owned Documents:</h2>
          <ul>
            {documents &&
              documents.map((document) => (
                <Link
                  key={document._id}
                  to={`/page/${encodeURIComponent(document._id)}`}
                >
                  <li>{`${document.title}`}</li>
                  <i onClick={()=>clickHandler(document._id)}>add</i>
                </Link>
              ))}
          </ul>
        </div>
        <div className="conti">
          <h2>Collaborated Documents</h2>
          <ul>
            {colDoc &&
              colDoc.map((document) => (
                <Link
                  key={document._id}
                  to={`/page/${encodeURIComponent(document._id)}`}
                >
                  <li>{`${document.title}`}</li>
                </Link>
              ))}
          </ul>
        </div>
      </div>
      <div id="dialog">
        <div>
          <label htmlFor="input">Search User:</label>
          <input type="text" ></input>
          <div className="res"></div>
          <i>x</i>
        </div>
      </div>
    </div>
  );
};

export default Home;
