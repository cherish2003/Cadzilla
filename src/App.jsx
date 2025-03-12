import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Header from "./components/Header";
import ModelViewer from "./components/ModelViewer";
import "./App.css";
import LandingPage from "./Pages/LandingPage";
import Dashboard from "./Pages/Dashboard";
import History from "./Pages/History";

function App() {
  const [modelUrl, setModelUrl] = useState(null);
  const [modelType, setModelType] = useState(null);

  const handleModelUpload = (url, type) => {
    setModelUrl(url);
    setModelType(type);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <LandingPage />
                {/* <UploadForm onModelUpload={handleModelUpload} />
                {modelUrl && (
                  <ModelViewer modelUrl={modelUrl} modelType={modelType} />
                )} */}
              </>
            }
          />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
