import React, { useState, useEffect } from 'react';
import { financialsAPI } from '../services/api';
import type { FinancialsResponse } from '../services/api';
import * as RosterModule from '../Pages/Roster';   // mind exact case
console.log('Roster exports →', Object.keys(RosterModule));
// @ts-ignore
window.__roster = RosterModule;


interface StatcardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  isLoading?: boolean;
}

const totalMembers = (RosterModule.members ?? []).length;

const Statcard: React.FC<StatcardProps> = ({ title, value, icon, color, isLoading }) => {
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
            {isLoading ? '...' : value}
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
  const [allFinancialData, setAllFinancialData] = useState<FinancialsResponse[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<FinancialsResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Use the same club ID as Finance.tsx
  const CLUB_ID = 1;

  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        setIsLoading(true);
        // Get all financial periods
        const allData = await financialsAPI.getAllByClubId(CLUB_ID);
        
        if (allData.length === 0) {
          setError("No financial data found");
          return;
        }
        
        // Sort by period_end date (most recent first)
        const sortedData = allData.sort((a, b) => 
          new Date(b.period_end).getTime() - new Date(a.period_end).getTime()
        );
        
        setAllFinancialData(sortedData);
        setSelectedPeriod(sortedData[0]); // Default to most recent
        setError(null);
      } catch (err) {
        console.error('Error fetching financial data:', err);
        setError('Failed to load balance');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFinancialData();
  }, []);

  // Handle period selection change
  const handlePeriodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value;
    const period = allFinancialData.find(p => p.id === selectedId);
    if (period) {
      setSelectedPeriod(period);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format currency
  const formatCurrency = (amount: number): string => {
    return `$${amount.toLocaleString()}`;
  };

  const formatMembers = (totalMembers: number): string => {
    return `${totalMembers.toLocaleString()}`;
  };

  const currentBalance = selectedPeriod ? Number(selectedPeriod.current_balance) : 0;

  const stats = [
    { 
      title: 'Total Members', 
      value: formatMembers(totalMembers), 
      icon: '👥',
      color: '#3B82F6',
      isLoading: false
    },
    { 
      title: 'Current Balance', 
      value: formatCurrency(currentBalance), 
      icon: '💰',
      color: '#1acf5c',
      isLoading: isLoading
    },
    { 
      title: 'Events This Month', 
      value: 5, 
      icon: '📅',
      color: '#F59E0B',
      isLoading: false
    }
  ];

  return (
    <div style={{ width: '100%' }}>
      {/* Period Selector */}
      {!isLoading && allFinancialData.length > 0 && (
        <div style={{
          background: '#ffffff',
          padding: '16px 20px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          <label htmlFor="statcard-period-select" style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#374151'
          }}>
            Financial Period:
          </label>
          <select
            id="statcard-period-select"
            value={selectedPeriod?.id || ''}
            onChange={handlePeriodChange}
            style={{
              padding: '8px 12px',
              fontSize: '14px',
              borderRadius: '6px',
              border: '2px solid #E5E7EB',
              background: '#ffffff',
              cursor: 'pointer',
              flex: '1',
              minWidth: '250px',
              fontWeight: '500'
            }}
          >
            {allFinancialData.map((period) => (
              <option key={period.id} value={period.id}>
                {formatDate(period.period_start)} - {formatDate(period.period_end)}
                {' '}(${Number(period.current_balance).toLocaleString()})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Stat Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        width: '100%'
      }}>
        {error && (
          <div style={{ 
            gridColumn: '1 / -1',
            color: '#EF4444', 
            padding: '10px',
            background: '#FEE2E2',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}
        {stats.map((stat, index) => (
          <Statcard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            isLoading={stat.isLoading}
          />
        ))}
      </div>
    </div>
  );
}