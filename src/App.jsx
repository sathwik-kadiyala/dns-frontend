import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes,  useNavigate } from 'react-router-dom';
import Home from './Pages/Home';
import RecordsPage from './Pages/RecordsPage';

import Login from './Components/Login';
import Register from './Components/Register';
import Navbar from './Components/Navbar';
import PrivateComponent from './Components/PrivateComponent';
import Domains from './Components/Domains';


function App() {

  const navigate=useNavigate()

  const [darkMode, setDarkMode] = useState(false);
  const[auth,setAuth] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState(null);

  const handleSelectDomain = (domainid) => {
      setSelectedDomain(domainid);
      navigate('/records')
  };

  return (
    <div className={`${darkMode && 'dark h-screen'} `}>
   

        <Navbar auth={auth} setAuth={setAuth} darkMode={darkMode} setDarkMode={setDarkMode} />
        <Routes>
        <Route element={<PrivateComponent />}>

          <Route path="/" exact element={<Home  />} />
          <Route path="/domains" exact element={<Domains onSelectDomain={handleSelectDomain}  />} />
          <Route path="/records" exact element={<RecordsPage selectedDomain={selectedDomain}   />} />
          </Route>
          <Route path="/login" element={<Login setAuth={setAuth}/>} />
          <Route path="/register" element={<Register />} />
        </Routes>

    </div>
  );
}

export default App;
