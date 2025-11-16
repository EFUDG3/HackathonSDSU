import React from "react";
import { Link } from "react-router-dom";

type SidebarProps = {
  /** whether the sidebar should have the "active" class */
  activeSidebar?: boolean;
};

const Sidebar: React.FC<SidebarProps> = ({ activeSidebar = false }) => {
  return (
    <div id="sidebar" className={activeSidebar ? "active" : ""}>
      <div className="logo">
        <Link to ="/">My Club Dashboard</Link>
      </div>

      <nav className="nav">
        <Link to="/">Dashboard</Link>
        <Link to="/Finance">Finance</Link>
        <Link to="/Roster">Roster</Link>
        <Link to="/Resources">Resource Library</Link>

      </nav>
    </div>
  );
};

export default Sidebar;

