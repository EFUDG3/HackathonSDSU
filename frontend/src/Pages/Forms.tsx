interface FormLink {
  id: number;
  title: string;
  description: string;
  url: string;
  category: string;
  icon: string;
}

export default function Forms() {
  // Sample data - replace with API call later
  const forms: FormLink[] = [
    {
      id: 1,
      title: 'RSO Registration Application',
      description: 'Official application to register your student organization with the university. Required annually.',
      url: 'https://stuapp.sdsu.edu/RSO/Login/Intro',
      category: 'Administrative',
      icon: '📋'
    },
    {
      id: 2,
      title: 'Room Reservation Information',
      description: 'Information and forms to reserve campus facilities for club meetings and events.',
      url: 'https://sacd.sdsu.edu/student-life-leadership/student-organizations/info-for-rso/reserve-space',
      category: 'Facilities',
      icon: '🏢'
    },
    {
      id: 3,
      title: 'Reserve Room or Event Spaces',
      description: 'Reserve meeting rooms, event spaces, or classrooms for club activities and events.',
      url: 'https://stuapp.sdsu.edu/EAS/Customer/Start',
      category: 'Events',
      icon: '🎉'
    },
    {
      id: 4,
      title: 'Banking Information',
      description: 'Request funding allocation for club activities, events, or purchases.',
      url: 'https://as.sdsu.edu/stu-org-funding/banking/',
      category: 'Financial',
      icon: '💵'
    },
    {
      id: 5,
      title: 'Banking Request Form',
      description: 'Request funding allocation for club activities, events, or purchases.',
      url: 'https://as.sdsu.edu/files/stu-org-funding/banking/SO-AcctInfoRequest.pdf',
      category: 'Financial',
      icon: '💰'
    },
    {
      id: 6,
      title: 'Discord',
      description: 'Discord server for your club to facilitate communication among members.',
      url: 'https://discord.gg/gwSHaPV7z6',
      category: 'Membership',
      icon: '👥'
    }

  ];

  const handleLinkClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <header className="app-topbar">
        <h1>Forms & Applications</h1>
      </header>
      <section className="app-content">
        
        {/* Page Description */}
        <div style={{
          background: '#ffffff',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: '24px'
        }}>
          <p style={{ 
            margin: 0, 
            color: '#6B7280',
            fontSize: '16px',
            lineHeight: '1.6'
          }}>
            Access all required forms and applications for club operations. Click any card to open the form in a new tab.
          </p>
        </div>

        {/* Forms Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '20px'
        }}>
          {forms.map((form) => (
            <div
              key={form.id}
              onClick={() => handleLinkClick(form.url)}
              style={{
                background: '#ffffff',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                padding: '24px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: '2px solid transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
                e.currentTarget.style.borderColor = '#111827';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                e.currentTarget.style.borderColor = 'transparent';
              }}
            >
              {/* Icon and Category */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '16px'
              }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '12px',
                  background: '#F3F4F6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px'
                }}>
                  {form.icon}
                </div>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '600',
                  background: '#E5E7EB',
                  color: '#374151'
                }}>
                  {form.category}
                </span>
              </div>

              {/* Title */}
              <h3 style={{
                margin: '0 0 12px 0',
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#111827'
              }}>
                {form.title}
              </h3>

              {/* Description */}
              <p style={{
                margin: '0 0 16px 0',
                fontSize: '14px',
                color: '#6B7280',
                lineHeight: '1.6'
              }}>
                {form.description}
              </p>

              {/* Link indicator */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#3B82F6',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                <span>Open Form</span>
                <span style={{ fontSize: '16px' }}>→</span>
              </div>
            </div>
          ))}
        </div>

        {/* Help Section */}
        <div style={{
          background: '#FEF3C7',
          border: '2px solid #F59E0B',
          padding: '20px',
          borderRadius: '12px',
          marginTop: '32px'
        }}>
          <div style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-start'
          }}>
            <div style={{ fontSize: '24px' }}>💡</div>
            <div>
              <h4 style={{ 
                margin: '0 0 8px 0', 
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#92400E'
              }}>
                Need Help?
              </h4>
              <p style={{ 
                margin: 0, 
                fontSize: '14px',
                color: '#78350F',
                lineHeight: '1.6'
              }}>
                If you're having trouble accessing any forms or need assistance filling them out, contact the club administrator or visit the student activities office.
              </p>
            </div>
          </div>
        </div>

      </section>
    </>
  );
}