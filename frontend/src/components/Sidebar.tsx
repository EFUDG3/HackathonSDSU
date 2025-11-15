import React from "react";

type SidebarProps = {
  /** whether the sidebar should have the "active" class */
  activeSidebar?: boolean;
};

const Sidebar: React.FC<SidebarProps> = ({ activeSidebar = false }) => {
  return (
    <div id="sidebar" className={activeSidebar ? "active" : ""}>
      <div className="logo">
        <a href="/">My Club Dashboard</a>
      </div>

      <nav className="nav">
        <a href="/dashboard">Dashboard</a>
        <a href="/Club Funds">Funds</a>
        <a href="/RSO Application">RSO Application</a>
        <a href="/Room Reservation">Room Reservation</a>
        <a href="/Event Management">Event Management</a>
        <a href="/Club Management">Project Management</a>
        <a href="/Member Roster">Member Roster</a>
        <a href="/Resource Library">Resource Library</a>
      </nav>
    </div>
  );
};

export default Sidebar;

