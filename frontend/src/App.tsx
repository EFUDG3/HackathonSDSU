import Sidebar from "./components/Sidebar.tsx";
import ChatDock from "./components/Chatdock.tsx";
import Statcards from "./components/Statcard.tsx";

import "./index.css";

export default function App() {
  return (
    <div className="app-layout">
      <Sidebar activeSidebar={true} />
      <main className="app-main">
        <header className="app-topbar">
          <h1>Dashboard</h1>
        </header>
        <section className="app-content">
          <p>Hello Club Officer!</p>
          <Statcards />
        </section>
      </main>
      <ChatDock />
    </div>
  );
}