import React from 'react';
import '../Navbar.css';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <div className='navbar'>
            <div className='item1'>
                <div>
                    My Documents
                </div>
                <Link to={'/colaborate'}>
                <div>
                    Collaborations
                </div>
                </Link>
            </div>
            <div className='item2'>
                <Link to='/newdocument'>Add document</Link>
            </div>
        </div>
    );
};

export default Navbar;