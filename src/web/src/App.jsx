import "./app.scss";
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
 
 
 
import TabSwitchPage2 from "./pages2/TabSwitchPage";
 
import PageHistory2 from "./pages2/PageHistory";
import PageMoney2 from "./pages2/PageMoney";
import PagePlay2 from "./pages2/PagePlay"; 
import PageDemo from "./pages2/PageDemo"; 

 
import WhiteBook from "./cpage/WhiteBook";

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const location = useLocation();

  useEffect(() => {
    console.log("App.jsx: useEffect");
    window.clearProgress();
  }, []);

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    const userInfoObj = JSON.parse(userInfo);

    const timer = setInterval(() => {
      setProgress((prev) => prev + 10);
    }, 300);

    if (progress >= 100) {
      if (!userInfoObj || !userInfoObj.userCount || !userInfoObj.userName) {
        setIsLogin(false);
      } else {
        setIsLogin(true);
      }
      setLoading(false);
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [progress]);

  const handleLoadingPageClick = () => {
    setLoading(false);
  };

  // Skip loading for /info and default / paths
  const isInfoPage = location.pathname.startsWith("/info") || location.pathname === "/";
  if (isInfoPage) {
    return (
      <Routes>
        {/* Redirect default path / to /info */}
        <Route path="/" element={<Navigate to="/info" replace />} />
        <Route path="/info" element={<WhiteBook />} /> 
      </Routes>
    );
  }

 

  return (
    <div className="flex justify-center w-full">
      <Routes>
       
        {/* v2 Routes */}
        <Route path="/v2" element={<TabSwitchPage2 />}>
          <Route path="/v2" element={<Navigate to="/v2/play" replace />} />
          <Route path="money" element={<PageMoney2 />} />
          <Route path="play" element={<PagePlay2 />} />
          <Route path="history" element={<PageHistory2 />} /> 
          <Route path="demo" element={<PageDemo />} /> 
        </Route>
 
      </Routes>
    </div>
  );
}

export default App;
