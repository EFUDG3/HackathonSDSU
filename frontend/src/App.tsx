import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar.tsx";
import ChatDock from "./components/Chatdock.tsx";
import Dashboard from "./Pages/Dashboard.tsx";
import Finance from "./Pages/Finance.tsx";
import Resources from "./Pages/Resources.tsx";
import Forms from "./Pages/Forms.tsx";

import "./index.css";

export default function App() {
  return (
    <BrowserRouter>
    <div className="app-layout">
      <Sidebar activeSidebar={true} />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/Finance" element={<Finance />} />
          <Route path="/Resources" element={<Resources />} />
          <Route path="/Forms" element={<Forms />} />
        </Routes>
      </main>
      <ChatDock />
    </div>
    </BrowserRouter>
  );
}