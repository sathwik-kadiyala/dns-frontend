import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './Pages/Home';
import RecordsPage from './Pages/RecordsPage';

import Login from './Components/Login';
import Register from './Components/Register';
import Navbar from './Components/Navbar';
import PrivateComponent from './Components/PrivateComponent';


function App() {

  const [darkMode, setDarkMode] = useState(false);
  const[auth,setAuth] = useState(false);

  return (
    <div className={`${darkMode && 'dark min-h-screen'} `}>
      <Router>

        <Navbar auth={auth} setAuth={setAuth} darkMode={darkMode} setDarkMode={setDarkMode} />
        <Routes>
        <Route element={<PrivateComponent />}>

          <Route path="/" exact element={<Home  />} />
          <Route path="/records" exact element={<RecordsPage  />} />
          </Route>
          <Route path="/login" element={<Login setAuth={setAuth}/>} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
