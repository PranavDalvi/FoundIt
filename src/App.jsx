import { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { LoginPage } from "./components/login/LoginPage";
import { HomePage } from "./components/homePage/HomePage";
import { GeoLocation } from "./components/locationFetcher/GeoLocation";
import "./App.scss";
import { AuthContextProvider } from "./context/AuthContext";
import { FoundForm } from "./components/foundForm/FoundForm";
import { PastForms } from "./components/pastForms/PastForms";
import { Navbar } from "./components/navBar/Navbar";

function App() {
  return (
    <BrowserRouter>
      <div>
        <AuthContextProvider>
          <Navbar/>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/foundform" element={<FoundForm />} />
            <Route path="/lostform" element={<GeoLocation />} />
            <Route path="/pastform" element={<PastForms/>}/>
          </Routes>
        </AuthContextProvider>
      </div>
    </BrowserRouter>
  );
}

export default App;
