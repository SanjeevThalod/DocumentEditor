import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Components/Home';
import Login from './Components/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SignUp from './Components/SignUp';
import Document from './Components/Document';
import Page from './Components/Page';
import FreshDoc from './Components/FreshDoc';
import Collaborations from './Components/Collaborations';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="/newdocument" element={<FreshDoc/>}/>
        <Route path='/newdocuments' element={<Document/>}/>
        <Route path='/document/:id'/>
        <Route path='/colaborate' element={<Collaborations/>}/>
        <Route path='/page/:id' element={<Page/>}/>
      </Routes>
      <ToastContainer/>
    </Router>
  );
}

export default App;
