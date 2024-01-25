import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const [documents, setDocuments] = useState([]);
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
    setDocuments(response.documents);
  };

  useEffect(() => {
    if (localStorage.getItem("authToken") === null) navigate("/login");

    fetchDocuments();
  }, [navigate]);

  return (
    <div>
      <Navbar />
      <div>
        <h2>Your Documents:</h2>
        <ul>
          {documents.map((document, index) => (
            <Link key={document._id} to={`/page/${encodeURIComponent(document._id)}`}>
              <li>{`doc${index + 1}`}</li>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;
