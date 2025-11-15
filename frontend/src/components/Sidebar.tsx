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
        <a href="/RSO Application">RSOApplication</a>
        <a href="/Room Reservation">RoomReservation</a>
        <a href="/Event Management">EventManagement</a>
        <a href="/Club Management">ProjectManagement</a>
        <a href="/Member Roster">MemberRoster</a>
        <a href="/Resource Library">ResourceLibrary</a>
      </nav>
    </div>
  );
};

export default Sidebar;

