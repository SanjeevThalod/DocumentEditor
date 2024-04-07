import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { Link, useNavigate } from "react-router-dom";
import "../home.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ... (imports and styling)

const Home = () => {
  const [documents, setDocuments] = useState([]);
  const [colDoc, setColDoc] = useState([]);
  const [user, setUser] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [docId,setDocId] = useState("");
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

  const clickHandler = async (_id) => {
    if(localStorage.getItem("authToken") == null) return;
    const dialog = document.getElementById("dialog");
    const pare = document.getElementById("pare");
    pare.style.blurr = 0.4;
    dialog.style.visibility = "visible";

    try {
      const res = await fetch("http://localhost:5000/api/users", {
        method: "GET",
      });
      const data = await res.json();
      setUser(data.users);
      setDocId(_id);
    } catch (error) {
      console.log(error);
    }
  };

  const addHandler = async (userId)=>{
    if(localStorage.getItem("authToken") == null) return;
    try {
      const res = await fetch("http://localhost:5000/api/addColl",{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
        },
        body:JSON.stringify({
          _id:docId,
          adder:userId
        })
      });

      const data = await res.json();
      console.log(data);
      const dialog = document.getElementById("dialog");
      toast.success("Collaborater added");
      dialog.style.visibility = "hidden";
    } catch (error) {
      console.log(error);
    }
  }

  const clickhand = () => {
    const dialog = document.getElementById("dialog");
    const pare = document.getElementById("pare");
    pare.style.blurr = 0;
    dialog.style.visibility = "hidden";
    setDocId("");
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    if (localStorage.getItem("authToken") === null) navigate("/login");

    fetchDocuments();
  }, [navigate]);

  const filteredUsers = user.filter(
    (userData) =>
      userData.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userData.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="par">
      <Navbar />
      <div className="pare" id="pare">
        <div className="conti">
          <h2>Your Documents:</h2>
          <ul>
            {documents &&
              documents.map((document) => (
                <li key={document._id}>
                  <Link
                    to={`/page/${encodeURIComponent(document._id)}`}
                  >{`${document.title}`}</Link>
                  <i onClick={() => clickHandler(document._id)}>add</i>
                </li>
              ))}
          </ul>
        </div>
        <div className="conti">
          <h2>Collaborated Documents</h2>
          <ul>
            {colDoc &&
              colDoc.map((document) => (
                <li key={document._id}>
                  <Link
                    to={`/page/${encodeURIComponent(document._id)}`}
                  >{`${document.title}`}</Link>
                </li>
              ))}
          </ul>
        </div>
      </div>
      <div id="dialog">
        <div>
          <label htmlFor="input">Search User:</label>
          <input type="text" value={searchTerm} onChange={handleSearch} />
          <div className="res">
            {/* Display filtered user data */}
            {filteredUsers.map((userData) => (
              <div key={userData._id} className="users">
                <div>{`${userData.name} - ${userData.email}`}</div>
                <div onClick={()=>addHandler(userData._id)}>add</div>
              </div>
            ))}
          </div>
          <div id="cross" onClick={clickhand}>
            x
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Home;
