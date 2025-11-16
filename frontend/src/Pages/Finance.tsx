export default function Finance() {
  // Sample data - this will be replaced with API calls later
  const revenue = {
    donations: 2500,
    sponsors: 5000,
    fundraised: 3200
  };

  const expenses = {
    giveaway: 800,
    uniform: 1200,
    food: 950
  };

  const totalRevenue = revenue.donations + revenue.sponsors + revenue.fundraised;
  const totalExpenses = expenses.giveaway + expenses.uniform + expenses.food;
  const balance = totalRevenue - totalExpenses;

  const transactions = [
    { id: 1, date: '2024-11-10', description: 'Tech Company Sponsorship', category: 'Sponsors', amount: 2000, type: 'revenue' },
    { id: 2, date: '2024-11-12', description: 'Hackathon Prize Giveaway', category: 'Giveaway', amount: -500, type: 'expense' },
    { id: 3, date: '2024-11-13', description: 'Member Donations', category: 'Donations', amount: 1500, type: 'revenue' },
    { id: 4, date: '2024-11-14', description: 'Team Uniforms Order', category: 'Uniform', amount: -800, type: 'expense' },
    { id: 5, date: '2024-11-15', description: 'Bake Sale Fundraiser', category: 'Fundraised', amount: 1200, type: 'revenue' },
    { id: 6, date: '2024-11-16', description: 'General Meeting Pizza', category: 'Food', amount: -300, type: 'expense' },
  ];

  return (
    <>
      <header className="app-topbar">
        <h1>Financial Overview</h1>
      </header>
      <section className="app-content">
        
        {/* Top Level: Balance */}
        <div style={{
          background: '#ffffff',
          padding: '32px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '16px', color: '#6B7280', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Current Balance
          </div>
          <div style={{ 
            fontSize: '48px', 
            fontWeight: 'bold', 
            color: balance >= 0 ? '#10B981' : '#EF4444'
          }}>
            ${balance.toLocaleString()}
          </div>
        </div>

        {/* Revenue and Expenses Side by Side */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '24px',
          marginBottom: '24px'
        }}>
          
          {/* Total Revenue Card */}
          <div style={{
            background: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }}>
            <div style={{
              background: '#10B981',
              color: '#ffffff',
              padding: '20px',
              fontSize: '20px',
              fontWeight: 'bold'
            }}>
              Total Revenue: ${totalRevenue.toLocaleString()}
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '16px 0',
                borderBottom: '1px solid #F3F4F6'
              }}>
                <span style={{ color: '#6B7280' }}>💰 Donations</span>
                <span style={{ fontWeight: 'bold', color: '#10B981' }}>
                  ${revenue.donations.toLocaleString()}
                </span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '16px 0',
                borderBottom: '1px solid #F3F4F6'
              }}>
                <span style={{ color: '#6B7280' }}>🤝 Sponsors</span>
                <span style={{ fontWeight: 'bold', color: '#10B981' }}>
                  ${revenue.sponsors.toLocaleString()}
                </span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '16px 0'
              }}>
                <span style={{ color: '#6B7280' }}>🎉 Fundraised</span>
                <span style={{ fontWeight: 'bold', color: '#10B981' }}>
                  ${revenue.fundraised.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Total Expenses Card */}
          <div style={{
            background: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }}>
            <div style={{
              background: '#EF4444',
              color: '#ffffff',
              padding: '20px',
              fontSize: '20px',
              fontWeight: 'bold'
            }}>
              Total Expenses: ${totalExpenses.toLocaleString()}
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '16px 0',
                borderBottom: '1px solid #F3F4F6'
              }}>
                <span style={{ color: '#6B7280' }}>🎁 Giveaway</span>
                <span style={{ fontWeight: 'bold', color: '#EF4444' }}>
                  ${expenses.giveaway.toLocaleString()}
                </span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '16px 0',
                borderBottom: '1px solid #F3F4F6'
              }}>
                <span style={{ color: '#6B7280' }}>👕 Uniform</span>
                <span style={{ fontWeight: 'bold', color: '#EF4444' }}>
                  ${expenses.uniform.toLocaleString()}
                </span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '16px 0'
              }}>
                <span style={{ color: '#6B7280' }}>🍕 Food</span>
                <span style={{ fontWeight: 'bold', color: '#EF4444' }}>
                  ${expenses.food.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions Table */}
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
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
              Recent Transactions
            </div>
            <button style={{
              padding: '8px 16px',
              background: '#111827',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}>
              + Add Transaction
            </button>
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
                  Date
                </th>
                <th style={{ 
                  padding: '16px 20px', 
                  textAlign: 'left', 
                  fontSize: '12px', 
                  color: '#6B7280', 
                  textTransform: 'uppercase',
                  fontWeight: '600'
                }}>
                  Description
                </th>
                <th style={{ 
                  padding: '16px 20px', 
                  textAlign: 'left', 
                  fontSize: '12px', 
                  color: '#6B7280', 
                  textTransform: 'uppercase',
                  fontWeight: '600'
                }}>
                  Category
                </th>
                <th style={{ 
                  padding: '16px 20px', 
                  textAlign: 'right', 
                  fontSize: '12px', 
                  color: '#6B7280', 
                  textTransform: 'uppercase',
                  fontWeight: '600'
                }}>
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} style={{ 
                  borderBottom: '1px solid #F3F4F6',
                  transition: 'background 0.2s'
                }}>
                  <td style={{ padding: '16px 20px', fontSize: '14px', color: '#374151' }}>
                    {transaction.date}
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '14px', color: '#111827' }}>
                    {transaction.description}
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '14px' }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      background: transaction.type === 'revenue' ? '#D1FAE5' : '#FEE2E2',
                      color: transaction.type === 'revenue' ? '#065F46' : '#991B1B'
                    }}>
                      {transaction.category}
                    </span>
                  </td>
                  <td style={{ 
                    padding: '16px 20px', 
                    fontSize: '16px', 
                    fontWeight: 'bold',
                    textAlign: 'right',
                    color: transaction.type === 'revenue' ? '#10B981' : '#EF4444'
                  }}>
                    {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </section>
    </>
  );
}   