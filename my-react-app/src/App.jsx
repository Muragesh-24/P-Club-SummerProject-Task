import './index.css'
import App from './App.jsx'
import Authpage from './Components/Authpage.jsx'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';






import React from 'react'
import Mainpage from './Components/Mainpage.jsx';

function main() {

  const user=true; // many ways are there but here like use webtoken and save it in locan storage or cooki  then while checking this user a api call will go to backend where it will check where the user present in the  token will be verified 
     return (
   
       <Router>
      <Routes>
    
        <Route path="/" element={<Authpage/>} />

       
        <Route
          path="/main"
          element={user ? <Mainpage/> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
   
  )
}

export default main
