import { useState } from 'react';

interface Member {
  id: number;
  name: string;
  email: string;
  role: string;
  position?: string;
  joinDate: string;
  status: 'Active' | 'Inactive';
  major?: string;
}

export const members: Member[] = [
  // Officers
  { id: 1, name: 'Justin Pelak', email: 'jpelak3541@sdsu.edu', role: 'Officer', position: 'President', joinDate: '2024-08-15', status: 'Active', major: 'Computer Science' },
  { id: 2, name: 'Ethan fudge', email: 'efudge1952@sdsu.edu', role: 'Officer', position: 'Vice President', joinDate: '2024-08-15', status: 'Active', major: 'Computer Science' },
  { id: 3, name: 'Jay Mittal', email: 'jmittal2031@sdsu.edu', role: 'Officer', position: 'Treasurer', joinDate: '2024-08-15', status: 'Active', major: 'Business Administration' },
  { id: 4, name: 'Aadi Bery', email: 'abery5498@sdsu.edu', role: 'Officer', position: 'Chief Technical Officer', joinDate: '2024-08-15', status: 'Active', major: 'Computer Science' },
  { id: 5, name: 'Andrei Magno', email: 'amango2134@sdsu.edu', role: 'Officer', position: 'Marketing', joinDate: '2024-08-15', status: 'Active', major: 'Marketing' },
  { id: 6, name: 'Patrick Dowell', email: 'pdowell6453@sdsu.edu', role: 'Officer', position: 'Deputy Officer', joinDate: '2024-08-15', status: 'Active', major: 'Computer Science' },
  { id: 7, name: 'Laura Wetherhold', email: 'lwetherhold5469@sdsu.edu', role: 'Officer', position: 'Secretary', joinDate: '2024-08-15', status: 'Active', major: 'Computer Science' },
  
  // Members
  { id: 8, name: 'David Kim', email: 'david.kim@sdsu.edu', role: 'Member', joinDate: '2024-01-10', status: 'Active', major: 'Computer Science' },
  { id: 9, name: 'Sofia Martinez', email: 'sofia.martinez@sdsu.edu', role: 'Member', joinDate: '2024-01-12', status: 'Active', major: 'Data Science' },
  { id: 10, name: 'Ryan Thompson', email: 'ryan.thompson@sdsu.edu', role: 'Member', joinDate: '2024-02-05', status: 'Active', major: 'Electrical Engineering' },
  { id: 11, name: 'Priya Sharma', email: 'priya.sharma@sdsu.edu', role: 'Member', joinDate: '2024-02-15', status: 'Active', major: 'Computer Engineering' },
  { id: 12, name: 'Lucas Brown', email: 'lucas.brown@sdsu.edu', role: 'Member', joinDate: '2024-03-01', status: 'Active', major: 'Mathematics' },
  { id: 13, name: 'Olivia Davis', email: 'olivia.davis@sdsu.edu', role: 'Member', joinDate: '2024-03-10', status: 'Active', major: 'Computer Science' },
  { id: 14, name: 'Ethan Garcia', email: 'ethan.garcia@sdsu.edu', role: 'Member', joinDate: '2024-03-20', status: 'Active', major: 'Software Engineering' },
  { id: 15, name: 'Zoe Anderson', email: 'zoe.anderson@sdsu.edu', role: 'Member', joinDate: '2024-04-05', status: 'Active', major: 'Information Technology' },
  { id: 16, name: 'Nathan Lee', email: 'nathan.lee@sdsu.edu', role: 'Member', joinDate: '2024-04-12', status: 'Inactive', major: 'Computer Science' },
  { id: 17, name: 'Isabella Taylor', email: 'isabella.taylor@sdsu.edu', role: 'Member', joinDate: '2024-05-01', status: 'Active', major: 'Cybersecurity' },
  { id: 18, name: 'Marcus Washington', email: 'marcus.washington@sdsu.edu', role: 'Member', joinDate: '2024-05-15', status: 'Active', major: 'Computer Science' },
  { id: 19, name: 'Hannah White', email: 'hannah.white@sdsu.edu', role: 'Member', joinDate: '2024-05-20', status: 'Active', major: 'Data Science' },
  { id: 20, name: 'Carlos Ramirez', email: 'carlos.ramirez@sdsu.edu', role: 'Member', joinDate: '2024-06-01', status: 'Active', major: 'Information Systems' },
  { id: 21, name: 'Maya Singh', email: 'maya.singh@sdsu.edu', role: 'Member', joinDate: '2024-06-10', status: 'Active', major: 'Computer Engineering' },
  { id: 22, name: 'Jackson Miller', email: 'jackson.miller@sdsu.edu', role: 'Member', joinDate: '2024-06-15', status: 'Active', major: 'Software Engineering' },
  { id: 23, name: 'Amelia Moore', email: 'amelia.moore@sdsu.edu', role: 'Member', joinDate: '2024-07-01', status: 'Active', major: 'Computer Science' },
  { id: 24, name: 'Tyler Jackson', email: 'tyler.jackson@sdsu.edu', role: 'Member', joinDate: '2024-07-05', status: 'Active', major: 'Cybersecurity' },
  { id: 25, name: 'Lily Thomas', email: 'lily.thomas@sdsu.edu', role: 'Member', joinDate: '2024-07-12', status: 'Active', major: 'Mathematics' },
  { id: 26, name: 'Benjamin Harris', email: 'benjamin.harris@sdsu.edu', role: 'Member', joinDate: '2024-07-20', status: 'Active', major: 'Data Science' },
  { id: 27, name: 'Ava Martin', email: 'ava.martin@sdsu.edu', role: 'Member', joinDate: '2024-08-01', status: 'Active', major: 'Computer Science' },
  { id: 28, name: 'Daniel Lopez', email: 'daniel.lopez@sdsu.edu', role: 'Member', joinDate: '2024-08-05', status: 'Active', major: 'Information Technology' },
  { id: 29, name: 'Grace Clark', email: 'grace.clark@sdsu.edu', role: 'Member', joinDate: '2024-08-10', status: 'Active', major: 'Software Engineering' },
  { id: 30, name: 'Noah Rodriguez', email: 'noah.rodriguez@sdsu.edu', role: 'Member', joinDate: '2024-08-15', status: 'Active', major: 'Computer Engineering' },
  { id: 31, name: 'Mia Lewis', email: 'mia.lewis@sdsu.edu', role: 'Member', joinDate: '2024-08-20', status: 'Active', major: 'Electrical Engineering' },
  { id: 32, name: 'Alexander Walker', email: 'alexander.walker@sdsu.edu', role: 'Member', joinDate: '2024-09-01', status: 'Active', major: 'Computer Science' },
  { id: 33, name: 'Charlotte Hall', email: 'charlotte.hall@sdsu.edu', role: 'Member', joinDate: '2024-09-05', status: 'Active', major: 'Data Science' },
  { id: 34, name: 'Samuel Allen', email: 'samuel.allen@sdsu.edu', role: 'Member', joinDate: '2024-09-10', status: 'Inactive', major: 'Information Systems' },
  { id: 35, name: 'Ella Young', email: 'ella.young@sdsu.edu', role: 'Member', joinDate: '2024-09-15', status: 'Active', major: 'Cybersecurity' },
  { id: 36, name: 'Henry King', email: 'henry.king@sdsu.edu', role: 'Member', joinDate: '2024-09-20', status: 'Active', major: 'Computer Science' },
  { id: 37, name: 'Scarlett Wright', email: 'scarlett.wright@sdsu.edu', role: 'Member', joinDate: '2024-09-25', status: 'Active', major: 'Software Engineering' },
  { id: 38, name: 'Sebastian Hill', email: 'sebastian.hill@sdsu.edu', role: 'Member', joinDate: '2024-10-01', status: 'Active', major: 'Computer Engineering' },
  { id: 39, name: 'Aria Scott', email: 'aria.scott@sdsu.edu', role: 'Member', joinDate: '2024-10-05', status: 'Active', major: 'Mathematics' },
  { id: 40, name: 'Matthew Green', email: 'matthew.green@sdsu.edu', role: 'Member', joinDate: '2024-10-10', status: 'Active', major: 'Data Science' },
  { id: 41, name: 'Chloe Adams', email: 'chloe.adams@sdsu.edu', role: 'Member', joinDate: '2024-10-15', status: 'Active', major: 'Computer Science' },
  { id: 42, name: 'Andrew Baker', email: 'andrew.baker@sdsu.edu', role: 'Member', joinDate: '2024-10-20', status: 'Active', major: 'Information Technology' },
  { id: 43, name: 'Victoria Nelson', email: 'victoria.nelson@sdsu.edu', role: 'Member', joinDate: '2024-10-25', status: 'Active', major: 'Software Engineering' },
  { id: 44, name: 'Christopher Carter', email: 'christopher.carter@sdsu.edu', role: 'Member', joinDate: '2024-11-01', status: 'Active', major: 'Computer Science' },
  { id: 45, name: 'Penelope Mitchell', email: 'penelope.mitchell@sdsu.edu', role: 'Member', joinDate: '2024-11-05', status: 'Active', major: 'Cybersecurity' },
  { id: 46, name: 'Joshua Perez', email: 'joshua.perez@sdsu.edu', role: 'Member', joinDate: '2024-11-10', status: 'Active', major: 'Data Science' },
  { id: 47, name: 'Luna Roberts', email: 'luna.roberts@sdsu.edu', role: 'Member', joinDate: '2024-11-15', status: 'Active', major: 'Computer Engineering' },
  { id: 48, name: 'Dylan Turner', email: 'dylan.turner@sdsu.edu', role: 'Member', joinDate: '2024-01-20', status: 'Active', major: 'Computer Science' },
  { id: 49, name: 'Stella Phillips', email: 'stella.phillips@sdsu.edu', role: 'Member', joinDate: '2024-01-25', status: 'Active', major: 'Software Engineering' },
  { id: 50, name: 'Isaac Campbell', email: 'isaac.campbell@sdsu.edu', role: 'Member', joinDate: '2024-02-01', status: 'Active', major: 'Information Systems' },
  { id: 51, name: 'Hazel Parker', email: 'hazel.parker@sdsu.edu', role: 'Member', joinDate: '2024-02-10', status: 'Inactive', major: 'Mathematics' },
  { id: 52, name: 'Gabriel Evans', email: 'gabriel.evans@sdsu.edu', role: 'Member', joinDate: '2024-02-15', status: 'Active', major: 'Computer Science' },
  { id: 53, name: 'Aurora Edwards', email: 'aurora.edwards@sdsu.edu', role: 'Member', joinDate: '2024-02-20', status: 'Active', major: 'Data Science' },
  { id: 54, name: 'Julian Collins', email: 'julian.collins@sdsu.edu', role: 'Member', joinDate: '2024-03-05', status: 'Active', major: 'Cybersecurity' },
  { id: 55, name: 'Violet Stewart', email: 'violet.stewart@sdsu.edu', role: 'Member', joinDate: '2024-03-12', status: 'Active', major: 'Computer Science' },
  { id: 56, name: 'Owen Sanchez', email: 'owen.sanchez@sdsu.edu', role: 'Member', joinDate: '2024-03-18', status: 'Active', major: 'Software Engineering' },
  { id: 57, name: 'Nora Morris', email: 'nora.morris@sdsu.edu', role: 'Member', joinDate: '2024-03-25', status: 'Active', major: 'Information Technology' },
  { id: 58, name: 'Levi Rogers', email: 'levi.rogers@sdsu.edu', role: 'Member', joinDate: '2024-04-01', status: 'Active', major: 'Computer Engineering' },
  { id: 59, name: 'Eleanor Reed', email: 'eleanor.reed@sdsu.edu', role: 'Member', joinDate: '2024-04-08', status: 'Active', major: 'Data Science' },
  { id: 60, name: 'Wyatt Cook', email: 'wyatt.cook@sdsu.edu', role: 'Member', joinDate: '2024-04-15', status: 'Active', major: 'Computer Science' },
  { id: 61, name: 'Lucy Morgan', email: 'lucy.morgan@sdsu.edu', role: 'Member', joinDate: '2024-04-22', status: 'Active', major: 'Mathematics' },
  { id: 62, name: 'Jack Bell', email: 'jack.bell@sdsu.edu', role: 'Member', joinDate: '2024-05-05', status: 'Active', major: 'Cybersecurity' },
  { id: 63, name: 'Zara Murphy', email: 'zara.murphy@sdsu.edu', role: 'Member', joinDate: '2024-05-12', status: 'Active', major: 'Computer Science' },
  { id: 64, name: 'Grayson Bailey', email: 'grayson.bailey@sdsu.edu', role: 'Member', joinDate: '2024-05-18', status: 'Active', major: 'Software Engineering' },
  { id: 65, name: 'Brooklyn Rivera', email: 'brooklyn.rivera@sdsu.edu', role: 'Member', joinDate: '2024-05-25', status: 'Active', major: 'Data Science' },
  { id: 66, name: 'Leo Cooper', email: 'leo.cooper@sdsu.edu', role: 'Member', joinDate: '2024-06-05', status: 'Active', major: 'Information Systems' },
  { id: 67, name: 'Savannah Richardson', email: 'savannah.richardson@sdsu.edu', role: 'Member', joinDate: '2024-06-12', status: 'Inactive', major: 'Computer Engineering' },
  { id: 68, name: 'Connor Cox', email: 'connor.cox@sdsu.edu', role: 'Member', joinDate: '2024-06-18', status: 'Active', major: 'Computer Science' },
  { id: 69, name: 'Claire Howard', email: 'claire.howard@sdsu.edu', role: 'Member', joinDate: '2024-06-25', status: 'Active', major: 'Electrical Engineering' },
  { id: 70, name: 'Ezra Ward', email: 'ezra.ward@sdsu.edu', role: 'Member', joinDate: '2024-07-08', status: 'Active', major: 'Software Engineering' },
  { id: 71, name: 'Skylar Torres', email: 'skylar.torres@sdsu.edu', role: 'Member', joinDate: '2024-07-15', status: 'Active', major: 'Computer Science' },
  { id: 72, name: 'Adrian Peterson', email: 'adrian.peterson@sdsu.edu', role: 'Member', joinDate: '2024-07-22', status: 'Active', major: 'Data Science' },
  { id: 73, name: 'Aaliyah Gray', email: 'aaliyah.gray@sdsu.edu', role: 'Member', joinDate: '2024-08-02', status: 'Active', major: 'Cybersecurity' },
  { id: 74, name: 'Caleb Ramirez', email: 'caleb.ramirez@sdsu.edu', role: 'Member', joinDate: '2024-08-08', status: 'Active', major: 'Information Technology' },
  { id: 75, name: 'Ellie James', email: 'ellie.james@sdsu.edu', role: 'Member', joinDate: '2024-08-15', status: 'Active', major: 'Computer Science' },
  { id: 76, name: 'Cameron Watson', email: 'cameron.watson@sdsu.edu', role: 'Member', joinDate: '2024-08-22', status: 'Active', major: 'Software Engineering' },
  { id: 77, name: 'Paisley Brooks', email: 'paisley.brooks@sdsu.edu', role: 'Member', joinDate: '2024-09-02', status: 'Active', major: 'Computer Engineering' },
  { id: 78, name: 'Nolan Kelly', email: 'nolan.kelly@sdsu.edu', role: 'Member', joinDate: '2024-09-08', status: 'Active', major: 'Mathematics' },
  { id: 79, name: 'Addison Sanders', email: 'addison.sanders@sdsu.edu', role: 'Member', joinDate: '2024-09-15', status: 'Active', major: 'Data Science' },
  { id: 80, name: 'Austin Price', email: 'austin.price@sdsu.edu', role: 'Member', joinDate: '2024-09-22', status: 'Active', major: 'Computer Science' },
  { id: 81, name: 'Kinsley Bennett', email: 'kinsley.bennett@sdsu.edu', role: 'Member', joinDate: '2024-10-02', status: 'Active', major: 'Cybersecurity' },
  { id: 82, name: 'Ian Wood', email: 'ian.wood@sdsu.edu', role: 'Member', joinDate: '2024-10-08', status: 'Inactive', major: 'Information Systems' },
  { id: 83, name: 'Naomi Barnes', email: 'naomi.barnes@sdsu.edu', role: 'Member', joinDate: '2024-10-15', status: 'Active', major: 'Computer Science' },
  { id: 84, name: 'Colton Ross', email: 'colton.ross@sdsu.edu', role: 'Member', joinDate: '2024-10-22', status: 'Active', major: 'Software Engineering' },
  { id: 85, name: 'Madelyn Henderson', email: 'madelyn.henderson@sdsu.edu', role: 'Member', joinDate: '2024-11-02', status: 'Active', major: 'Data Science' },
  { id: 86, name: 'Dominic Coleman', email: 'dominic.coleman@sdsu.edu', role: 'Member', joinDate: '2024-11-08', status: 'Active', major: 'Computer Engineering' },
  { id: 87, name: 'Aubrey Jenkins', email: 'aubrey.jenkins@sdsu.edu', role: 'Member', joinDate: '2024-11-15', status: 'Active', major: 'Computer Science' },
  { id: 88, name: 'Miles Perry', email: 'miles.perry@sdsu.edu', role: 'Member', joinDate: '2024-01-18', status: 'Active', major: 'Electrical Engineering' },
  { id: 89, name: 'Kennedy Powell', email: 'kennedy.powell@sdsu.edu', role: 'Member', joinDate: '2024-01-25', status: 'Active', major: 'Information Technology' },
  { id: 90, name: 'Axel Long', email: 'axel.long@sdsu.edu', role: 'Member', joinDate: '2024-02-02', status: 'Active', major: 'Computer Science' },
  { id: 91, name: 'Genesis Patterson', email: 'genesis.patterson@sdsu.edu', role: 'Member', joinDate: '2024-02-12', status: 'Active', major: 'Software Engineering' },
  { id: 92, name: 'Easton Hughes', email: 'easton.hughes@sdsu.edu', role: 'Member', joinDate: '2024-02-18', status: 'Active', major: 'Data Science' },
  { id: 93, name: 'Ivy Flores', email: 'ivy.flores@sdsu.edu', role: 'Member', joinDate: '2024-03-02', status: 'Active', major: 'Cybersecurity' },
  { id: 94, name: 'Jaxon Washington', email: 'jaxon.washington@sdsu.edu', role: 'Member', joinDate: '2024-03-15', status: 'Active', major: 'Computer Science' },
  { id: 95, name: 'Emilia Butler', email: 'emilia.butler@sdsu.edu', role: 'Member', joinDate: '2024-03-22', status: 'Active', major: 'Mathematics' },
  { id: 96, name: 'Bryson Simmons', email: 'bryson.simmons@sdsu.edu', role: 'Member', joinDate: '2024-04-02', status: 'Active', major: 'Information Systems' },
  { id: 97, name: 'Valentina Foster', email: 'valentina.foster@sdsu.edu', role: 'Member', joinDate: '2024-04-12', status: 'Active', major: 'Computer Science' },
  { id: 98, name: 'Declan Gonzales', email: 'declan.gonzales@sdsu.edu', role: 'Member', joinDate: '2024-04-18', status: 'Inactive', major: 'Software Engineering' },
  { id: 99, name: 'Alice Bryant', email: 'alice.bryant@sdsu.edu', role: 'Member', joinDate: '2024-05-02', status: 'Active', major: 'Data Science' },
  { id: 100, name: 'Beckett Alexander', email: 'beckett.alexander@sdsu.edu', role: 'Member', joinDate: '2024-05-15', status: 'Active', major: 'Computer Engineering' },
  { id: 101, name: 'Ruby Russell', email: 'ruby.russell@sdsu.edu', role: 'Member', joinDate: '2024-05-22', status: 'Active', major: 'Computer Science' },
  { id: 102, name: 'Silas Griffin', email: 'silas.griffin@sdsu.edu', role: 'Member', joinDate: '2024-06-02', status: 'Active', major: 'Cybersecurity' },
  { id: 103, name: 'Willow Diaz', email: 'willow.diaz@sdsu.edu', role: 'Member', joinDate: '2024-06-15', status: 'Active', major: 'Information Technology' },
  { id: 104, name: 'Beau Hayes', email: 'beau.hayes@sdsu.edu', role: 'Member', joinDate: '2024-06-22', status: 'Active', major: 'Software Engineering' },
  { id: 105, name: 'Iris Myers', email: 'iris.myers@sdsu.edu', role: 'Member', joinDate: '2024-07-02', status: 'Active', major: 'Computer Science' },
  { id: 106, name: 'Rowan Ford', email: 'rowan.ford@sdsu.edu', role: 'Member', joinDate: '2024-07-15', status: 'Active', major: 'Data Science' },
  { id: 107, name: 'Everly Hamilton', email: 'everly.hamilton@sdsu.edu', role: 'Member', joinDate: '2024-07-25', status: 'Active', major: 'Electrical Engineering' },
];


export default function Roster() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All');

  
  // Filter members based on search and role filter
  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.major?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'All' || member.role === filterRole;
    return matchesSearch && matchesRole;
  });

  // Separate officers and members
  const officers = filteredMembers.filter(m => m.role === 'Officer');
  const regularMembers = filteredMembers.filter(m => m.role === 'Member');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <>
      <header className="app-topbar">
        <h1>Club Roster</h1>
      </header>
      <section className="app-content">
        
        {/* Summary Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div style={{
            background: '#ffffff',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#3B82F6' }}>
              {members.filter(m => m.status === 'Active').length}
            </div>
            <div style={{ fontSize: '14px', color: '#6B7280', marginTop: '8px' }}>
              ACTIVE MEMBERS
            </div>
          </div>
          
          <div style={{
            background: '#ffffff',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#10B981' }}>
              {officers.length}
            </div>
            <div style={{ fontSize: '14px', color: '#6B7280', marginTop: '8px' }}>
              OFFICERS
            </div>
          </div>
          
          <div style={{
            background: '#ffffff',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#F59E0B' }}>
              {members.length}
            </div>
            <div style={{ fontSize: '14px', color: '#6B7280', marginTop: '8px' }}>
              TOTAL MEMBERS
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div style={{
          background: '#ffffff',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: '24px',
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <input
            type="text"
            placeholder="Search by name, email, or major..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: '1',
              minWidth: '250px',
              padding: '10px 16px',
              fontSize: '14px',
              border: '2px solid #E5E7EB',
              borderRadius: '8px',
              outline: 'none'
            }}
          />
          
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            style={{
              padding: '10px 16px',
              fontSize: '14px',
              border: '2px solid #E5E7EB',
              borderRadius: '8px',
              background: '#ffffff',
              cursor: 'pointer',
              minWidth: '150px'
            }}
          >
            <option value="All">All Roles</option>
            <option value="Officer">Officers Only</option>
            <option value="Member">Members Only</option>
          </select>

          <button style={{
            padding: '10px 20px',
            background: '#111827',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            + Add Member
          </button>
        </div>

        {/* Officers Section */}
        {officers.length > 0 && (
          <div style={{
            background: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            marginBottom: '24px'
          }}>
            <div style={{
              padding: '20px',
              borderBottom: '2px solid #E5E7EB',
              background: '#F9FAFB'
            }}>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#111827' }}>
                👑 Officers
              </h2>
            </div>
            
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F9FAFB' }}>
                  <th style={{ 
                    padding: '16px 20px', 
                    textAlign: 'left', 
                    fontSize: '12px', 
                    color: '#6B7280', 
                    textTransform: 'uppercase',
                    fontWeight: '600'
                  }}>
                    Name
                  </th>
                  <th style={{ 
                    padding: '16px 20px', 
                    textAlign: 'left', 
                    fontSize: '12px', 
                    color: '#6B7280', 
                    textTransform: 'uppercase',
                    fontWeight: '600'
                  }}>
                    Position
                  </th>
                  <th style={{ 
                    padding: '16px 20px', 
                    textAlign: 'left', 
                    fontSize: '12px', 
                    color: '#6B7280', 
                    textTransform: 'uppercase',
                    fontWeight: '600'
                  }}>
                    Email
                  </th>
                  <th style={{ 
                    padding: '16px 20px', 
                    textAlign: 'left', 
                    fontSize: '12px', 
                    color: '#6B7280', 
                    textTransform: 'uppercase',
                    fontWeight: '600'
                  }}>
                    Major
                  </th>
                  <th style={{ 
                    padding: '16px 20px', 
                    textAlign: 'left', 
                    fontSize: '12px', 
                    color: '#6B7280', 
                    textTransform: 'uppercase',
                    fontWeight: '600'
                  }}>
                    Join Date
                  </th>
                  <th style={{ 
                    padding: '16px 20px', 
                    textAlign: 'center', 
                    fontSize: '12px', 
                    color: '#6B7280', 
                    textTransform: 'uppercase',
                    fontWeight: '600'
                  }}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {officers.map((officer) => (
                  <tr key={officer.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                      {officer.name}
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: '14px' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500',
                        background: '#DBEAFE',
                        color: '#1E40AF'
                      }}>
                        {officer.position}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: '14px', color: '#6B7280' }}>
                      {officer.email}
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: '14px', color: '#374151' }}>
                      {officer.major}
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: '14px', color: '#6B7280' }}>
                      {formatDate(officer.joinDate)}
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500',
                        background: officer.status === 'Active' ? '#D1FAE5' : '#FEE2E2',
                        color: officer.status === 'Active' ? '#065F46' : '#991B1B'
                      }}>
                        {officer.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Members Section */}
        {regularMembers.length > 0 && (
          <div style={{
            background: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '20px',
              borderBottom: '2px solid #E5E7EB',
              background: '#F9FAFB'
            }}>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#111827' }}>
                👥 Members
              </h2>
            </div>
            
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F9FAFB' }}>
                  <th style={{ 
                    padding: '16px 20px', 
                    textAlign: 'left', 
                    fontSize: '12px', 
                    color: '#6B7280', 
                    textTransform: 'uppercase',
                    fontWeight: '600'
                  }}>
                    Name
                  </th>
                  <th style={{ 
                    padding: '16px 20px', 
                    textAlign: 'left', 
                    fontSize: '12px', 
                    color: '#6B7280', 
                    textTransform: 'uppercase',
                    fontWeight: '600'
                  }}>
                    Email
                  </th>
                  <th style={{ 
                    padding: '16px 20px', 
                    textAlign: 'left', 
                    fontSize: '12px', 
                    color: '#6B7280', 
                    textTransform: 'uppercase',
                    fontWeight: '600'
                  }}>
                    Major
                  </th>
                  <th style={{ 
                    padding: '16px 20px', 
                    textAlign: 'left', 
                    fontSize: '12px', 
                    color: '#6B7280', 
                    textTransform: 'uppercase',
                    fontWeight: '600'
                  }}>
                    Join Date
                  </th>
                  <th style={{ 
                    padding: '16px 20px', 
                    textAlign: 'center', 
                    fontSize: '12px', 
                    color: '#6B7280', 
                    textTransform: 'uppercase',
                    fontWeight: '600'
                  }}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {regularMembers.map((member) => (
                  <tr key={member.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                      {member.name}
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: '14px', color: '#6B7280' }}>
                      {member.email}
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: '14px', color: '#374151' }}>
                      {member.major}
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: '14px', color: '#6B7280' }}>
                      {formatDate(member.joinDate)}
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500',
                        background: member.status === 'Active' ? '#D1FAE5' : '#FEE2E2',
                        color: member.status === 'Active' ? '#065F46' : '#991B1B'
                      }}>
                        {member.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* No Results Message */}
        {filteredMembers.length === 0 && (
          <div style={{
            background: '#ffffff',
            padding: '40px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <p style={{ fontSize: '18px', color: '#6B7280', margin: 0 }}>
              No members found matching your search criteria
            </p>
          </div>
        )}

      </section>
    </>
  );
}