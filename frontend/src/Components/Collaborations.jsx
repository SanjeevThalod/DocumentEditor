import React, { useEffect, useState } from "react";
import "../coll.css";

const Collaborations = () => {
  const [allCollaborators, setAllCollaborators] = useState();
  const [currCollaborators, setCurrCollaborators] = useState();
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async () => {
    if (!localStorage.getItem("authToken")) return;

    try {
      const currResponse = await fetch("http://localhost:5000/api/fetchColl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: localStorage.getItem("_id"),
        }),
      });

      const allResponse = await fetch("http://localhost:5000/api/users", {
        method: "GET",
      });

      const currData = await currResponse.json();
      const allData = await allResponse.json();

      if (currData && currData.data.collaborations) {
        // Set current collaborators when data is fetched
        setCurrCollaborators(currData.data.collaborations);
        console.log("Current Collaborators:", currData.data.collaborations);
      }

      if (allData && allData.users) {
        // Set all collaborators when data is fetched
        setAllCollaborators(allData.users);
        console.log("All Collaborators:", allData.users);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter all collaborators based on the search query and exclude those in currCollaborators
  const searchResults =
    allCollaborators &&
    allCollaborators.filter(
      (collaborator) =>
        (collaborator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          collaborator.email
            .toLowerCase()
            .includes(searchQuery.toLowerCase())) &&
        currCollaborators &&
        !currCollaborators.some(
          (currCollaborator) => currCollaborator._id === collaborator._id
        )
    );

  return (
    <div className="cont">
      <input
        className="inp"
        type="text"
        placeholder="Search collaborators..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div className="tch">
        {searchResults &&
          searchResults.map((collaborator) => (
            <div key={collaborator._id} className="sele">
              Name: {collaborator.name}
              <br />
              Email: {collaborator.email}
              <span className="add">add</span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Collaborations;
