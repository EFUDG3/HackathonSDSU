import React from 'react';

interface StatcardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
}

const Statcard: React.FC<StatcardProps> = ({ title, value, icon, color }) => {
  return (
    <div style={{
        background: '#ffffff',
        borderRadius: '8px',
        padding : '24px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column'
    }}>
        {/* Icon container */}
        <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        background: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px'
      }}>
        {icon}
      </div>

      {/* Value */}
        <div style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#111827',

        }}>
            {value}
        </div>
        {/* Title */}
        <div style={{
            fontSize: '16px',
            color: '#6B7280',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
        }}>
            {title}
        </div>
    </div>
  );
};

export default function Statcards() {
    const stats = [
    { title: 'Total Members', 
      value: 150, icon: '👥',
      color: '#3B82F6' },
    { title: 'Moneys!!!', 
      value: 10000, icon: '💰',
      color: '#1acf5c' },
    { title: 'Events This Month', 
      value: 5, icon: '📅',
      color: '#F59E0B'}
    ];

    return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginTop: '24px',
        width: '100%'
    }}>
      {stats.map((stat, index) => (
        <Statcard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
        />
      ))}
    </div>  
);
}

        