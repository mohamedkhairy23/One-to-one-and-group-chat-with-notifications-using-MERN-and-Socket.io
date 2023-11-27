import { useEffect } from "react";
import "./App.css";
import { Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import ChatPage from "./Pages/ChatPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Protect from "./Protect";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  return (
    <div className="App">
      {" "}
      <ToastContainer />
      <ScrollToTop />
      <Routes>
        <Route index={true} path="/" element={<HomePage />} />
        <Route path="" element={<Protect />}>
          <Route path="/chats" element={<ChatPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
