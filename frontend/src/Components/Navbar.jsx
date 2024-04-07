import React, { useState } from "react";
import "../Navbar.css";
import { Link } from "react-router-dom";
import logo from "./logo.png";
import create from "./create.png";
import avatar from "./frame.png";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Implement your logout logic here
    // For example, clearing user session data and redirecting to login page
    localStorage.clear("username");
    // Redirect to login page or any other desired action
    navigate("/login");

  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <div className="navbar">
      <div className="navbar2">
        <div className="item1">
          <div>
            <img src={logo} alt="img" />
          </div>
          {/* <Link to={"/colaborate"}>
            <div>Collaborations</div>
          </Link> */}
        </div>
        <div className="item2">
          <div className="new">
            <img src={create} alt="img" />
            <Link to="/newdocument">New</Link>
          </div>
          <div className="avatar" onClick={toggleDropdown}>
            <img src={avatar} alt="img" />
            <div>{localStorage.getItem("username")}</div>
            {dropdownVisible && (
              <div className="dropdown-content">
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
