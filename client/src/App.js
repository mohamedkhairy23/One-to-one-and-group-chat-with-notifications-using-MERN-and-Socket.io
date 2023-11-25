import { useEffect } from "react";
import "./App.css";
import { Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import ChatPage from "./Pages/ChatPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  return (
    <div>
      {" "}
      <ToastContainer />
      <ScrollToTop />
      <Routes>
        <Route index={true} path="/" element={<HomePage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </div>
  );
}

export default App;
