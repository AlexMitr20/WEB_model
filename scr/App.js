import React, { useState, useEffect } from 'react';
import './App.css';
import { Routes, Route, Link } from "react-router-dom";
import Menu from './Pages/Menu';
import Dialogs from './Pages/Dialogs';
import WorkFile from './Pages/WorkFile';
import Navbar from './Pages/navbar';
import Aboutus from './Pages/Aboutus';
import { UserProvider } from './Pages/UserContext'; 

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading ? (
        <div className="loading-screen" style={{ backgroundColor: 'black' }}>
          Загрузка...
        </div>
      ) : (
        <>
          <UserProvider>
            <Navbar />
            <Routes>
              <Route path="/Menu" element={<Menu />} />
              <Route path="/Dialogs" element={<Dialogs />} />
              <Route path="/WorkFile" element={<WorkFile />} />
              <Route path="/About" element={<Aboutus />} />
            </Routes>
          </UserProvider>
        </>
      )}
    </>
  );
}

export default App;
