import { useState, useEffect } from 'react';
import Statcards from "../components/Statcard";
import { financialsAPI, transactionsAPI } from '../services/api';
import type { FinancialsResponse, TransactionResponse } from '../services/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export default function Dashboard() {
  const [financialData, setFinancialData] = useState<FinancialsResponse | null>(null);
  const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const CLUB_ID = 1; // TODO: Replace with actual club ID from auth

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch most recent financial period
        const allFinancials = await financialsAPI.getAllByClubId(CLUB_ID);
        if (allFinancials.length > 0) {
          const sorted = allFinancials.sort((a, b) => 
            new Date(b.period_end).getTime() - new Date(a.period_end).getTime()
          );
          setFinancialData(sorted[0]);
        }
        
        // Fetch recent transactions
        const allTransactions = await transactionsAPI.getByClubId(CLUB_ID);
        const sorted = allTransactions.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setTransactions(sorted);
        
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper to determine if category is expense
  const isExpenseCategory = (category: string) => {
    const expenseCategories = ['food', 'giveaway', 'uniforms'];
    return expenseCategories.includes(category.toLowerCase());
  };

  // Helper to determine if category is revenue
  const isRevenueCategory = (category: string) => {
    const revenueCategories = ['donation', 'donations', 'fundraising', 'sponsorship'];
    return revenueCategories.includes(category.toLowerCase());
  };

  // Calculate spending by category for pie chart
  const getSpendingData = () => {
    if (!transactions.length) {
      return [];
    }

    const categoryMap: { [key: string]: number } = {};
    
    transactions.forEach(t => {
      const amount = Number(t.amount);
      const category = t.category || 'Other';
      
      // Only include expenses in spending breakdown
      if (isExpenseCategory(category)) {
        categoryMap[category] = (categoryMap[category] || 0) + Math.abs(amount);
      }
    });

    const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];
    return Object.entries(categoryMap).map(([name, value], idx) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      color: colors[idx % colors.length]
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number | string) => {
    return Math.abs(Number(amount)).toLocaleString();
  };

  const spendingData = getSpendingData();
  const totalSpending = spendingData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div>
      <header className="app-topbar">
        <h1>Dashboard</h1>
      </header>
      <section className="app-content">
        <p style={{ fontSize: '18px', marginBottom: '24px', color: '#6B7280' }}>
          Hello Club Officer!
        </p>
        
        <Statcards />

        {/* Recent Activity & Spending Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '24px',
          marginTop: '24px'
        }}>
          
          {/* Recent Transactions Card */}
          <div style={{
            background: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '20px',
              borderBottom: '1px solid #E5E7EB',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>
                Recent Transactions
              </h3>
              <a href="/finance" style={{
                color: '#3b82f6',
                fontSize: '14px',
                fontWeight: '600',
                textDecoration: 'none'
              }}>
                View All →
              </a>
            </div>

            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>
                Loading...
              </div>
            ) : transactions.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>
                No recent transactions
              </div>
            ) : (
              <div style={{ padding: '12px' }}>
                {transactions.slice(0, 5).map((transaction) => {
                  const amount = Number(transaction.amount);
                  const isIncome = isRevenueCategory(transaction.category);
                  
                  return (
                    <div key={transaction.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 8px',
                      borderRadius: '8px',
                      marginBottom: '4px',
                      transition: 'background 0.2s',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#F9FAFB'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: isIncome ? '#D1FAE5' : '#FEE2E2',
                          fontSize: '18px'
                        }}>
                          {isIncome ? '↑' : '↓'}
                        </div>
                        <div>
                          <div style={{ fontWeight: '600', fontSize: '14px', color: '#111827' }}>
                            {transaction.description || 'Transaction'}
                          </div>
                          <div style={{ fontSize: '12px', color: '#6B7280' }}>
                            {formatDate(transaction.date)}
                          </div>
                        </div>
                      </div>
                      <div style={{
                        fontWeight: 'bold',
                        fontSize: '15px',
                        color: isIncome ? '#10B981' : '#EF4444'
                      }}>
                        {isIncome ? '+' : '-'}${formatCurrency(amount)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Spending Pie Chart Card */}
          <div style={{
            background: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            padding: '20px'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' }}>
              Spending by Category
            </h3>
            
            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>
                Loading...
              </div>
            ) : spendingData.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6B7280' }}>
                No expense data available
              </div>
            ) : (
              <>
                <div style={{ height: '280px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={spendingData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {spendingData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => `$${Number(value).toLocaleString()}`}
                        contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                      />
                      <Legend 
                        verticalAlign="bottom" 
                        height={36}
                        formatter={(value, entry: any) => `${value}: $${entry.payload.value.toLocaleString()}`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div style={{
                  marginTop: '20px',
                  paddingTop: '20px',
                  borderTop: '1px solid #E5E7EB',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '14px', color: '#6B7280', marginBottom: '4px' }}>
                    Total Spending
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827' }}>
                    ${totalSpending.toLocaleString()}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}