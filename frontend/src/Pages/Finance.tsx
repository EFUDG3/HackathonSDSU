import { useState, useEffect } from 'react';
import { financialsAPI, transactionsAPI } from '../services/api';
import type { FinancialsResponse, TransactionResponse, TransactionCreate } from '../services/api';

export default function Finance() {
  // State for API data
  const [allFinancialData, setAllFinancialData] = useState<FinancialsResponse[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<FinancialsResponse | null>(null);
  const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // TODO: Replace with actual club ID (maybe from auth context or props)
  const CLUB_ID = 1;

  // Form state for new transaction
  const [newTransaction, setNewTransaction] = useState({
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    vendor: '',
    status: 'completed',
    code: ''
  });

  // Fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch financial data
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
        
        // Fetch transactions
        const transactionsData = await transactionsAPI.getByClubId(CLUB_ID);
        // Sort by date (most recent first)
        const sortedTransactions = transactionsData.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setTransactions(sortedTransactions);
        
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  // Helper to determine if category is revenue
  const isRevenueCategory = (category: string) => {
    const revenueCategories = ['donation', 'donations', 'fundraising', 'sponsorship'];
    return revenueCategories.includes(category.toLowerCase());
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // If category changes, automatically set the corresponding code
    if (name === 'category') {
      const categoryCodeMap: { [key: string]: string } = {
        'donation': '3300',
        'fundraising': '3311',
        'sponsorship': '3325',
        'food': '5520',
        'giveaway': '6413',
        'uniforms': '5751'
      };
      
      setNewTransaction(prev => ({
        ...prev,
        category: value,
        code: categoryCodeMap[value] || ''
      }));
    } else {
      setNewTransaction(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle form submission
  const handleSubmitTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTransaction.amount || !newTransaction.category || !newTransaction.description) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Create transaction
      const transactionData: TransactionCreate = {
        club_id: CLUB_ID,
        amount: parseFloat(newTransaction.amount),
        category: newTransaction.category,
        description: newTransaction.description,
        date: newTransaction.date,
        vendor: newTransaction.vendor || undefined,
        status: newTransaction.status,
        code: newTransaction.code || undefined
      };

      await transactionsAPI.create(transactionData);
      
      // Refresh data
      const updatedTransactions = await transactionsAPI.getByClubId(CLUB_ID);
      const sortedTransactions = updatedTransactions.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setTransactions(sortedTransactions);

      // Refresh financial data to get updated totals
      const allData = await financialsAPI.getAllByClubId(CLUB_ID);
      const sortedData = allData.sort((a, b) => 
        new Date(b.period_end).getTime() - new Date(a.period_end).getTime()
      );
      setAllFinancialData(sortedData);
      setSelectedPeriod(sortedData[0]);
      
      // Reset form and close modal
      setNewTransaction({
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        vendor: '',
        status: 'completed',
        code: ''
      });
      setShowAddModal(false);
      
    } catch (err) {
      console.error('Error creating transaction:', err);
      alert('Failed to create transaction. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <>
        <header className="app-topbar">
          <h1>Financial Overview</h1>
        </header>
        <section className="app-content">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>Loading financial data...</p>
          </div>
        </section>
      </>
    );
  }

  // Show error state
  if (error) {
    return (
      <>
        <header className="app-topbar">
          <h1>Financial Overview</h1>
        </header>
        <section className="app-content">
          <div style={{
            background: '#FEE2E2',
            border: '2px solid #EF4444',
            padding: '20px',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <p style={{ color: '#991B1B', margin: 0 }}>
              ⚠️ Error: {error}
            </p>
            <button 
              onClick={() => window.location.reload()}
              style={{
                marginTop: '12px',
                padding: '8px 16px',
                background: '#EF4444',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        </section>
      </>
    );
  }

  // No data state
  if (!selectedPeriod) {
    return (
      <>
        <header className="app-topbar">
          <h1>Financial Overview</h1>
        </header>
        <section className="app-content">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>No financial data available</p>
          </div>
        </section>
      </>
    );
  }

  // Calculate totals from selected period
  const revenue = {
    donations: Number(selectedPeriod.revenue_donations),
    sponsors: Number(selectedPeriod.revenue_sponsorship),
    fundraised: Number(selectedPeriod.revenue_fundraising)
  };

  const expenses = {
    giveaway: Number(selectedPeriod.expense_giveaway),
    uniform: Number(selectedPeriod.expense_uniforms),
    food: Number(selectedPeriod.expense_food)
  };

  const totalRevenue = revenue.donations + revenue.sponsors + revenue.fundraised;
  const totalExpenses = expenses.giveaway + expenses.uniform + expenses.food;
  const balance = Number(selectedPeriod.current_balance);

  return (
    <>
      <header className="app-topbar">
        <h1>Financial Overview</h1>
      </header>
      <section className="app-content">
        
        {/* Period Selector */}
        <div style={{
          background: '#ffffff',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <label htmlFor="period-select" style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#374151'
          }}>
            Select Period:
          </label>
          <select
            id="period-select"
            value={selectedPeriod.id}
            onChange={handlePeriodChange}
            style={{
              padding: '10px 16px',
              fontSize: '16px',
              borderRadius: '8px',
              border: '2px solid #E5E7EB',
              background: '#ffffff',
              cursor: 'pointer',
              minWidth: '300px',
              fontWeight: '500'
            }}
          >
            {allFinancialData.map((period) => (
              <option key={period.id} value={period.id}>
                {formatDate(period.period_start)} - {formatDate(period.period_end)}
                {' '}(Balance: ${Number(period.current_balance).toLocaleString()})
              </option>
            ))}
          </select>
          <div style={{
            marginLeft: 'auto',
            padding: '8px 16px',
            background: '#F3F4F6',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#6B7280'
          }}>
            {allFinancialData.length} period{allFinancialData.length !== 1 ? 's' : ''} available
          </div>
        </div>

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
            }}
            onClick={() => setShowAddModal(true)}
            >
              + Add Transaction
            </button>
          </div>
          
          {transactions.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>
              No transactions found
            </div>
          ) : (
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
                    textAlign: 'left', 
                    fontSize: '12px', 
                    color: '#6B7280', 
                    textTransform: 'uppercase',
                    fontWeight: '600'
                  }}>
                    Vendor
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
                {transactions.map((transaction) => {
                  const amount = Number(transaction.amount);
                  const isIncome = isRevenueCategory(transaction.category);
                  
                  return (
                    <tr key={transaction.id} style={{ 
                      borderBottom: '1px solid #F3F4F6',
                      transition: 'background 0.2s'
                    }}>
                      <td style={{ padding: '16px 20px', fontSize: '14px', color: '#374151' }}>
                        {formatDate(transaction.date)}
                      </td>
                      <td style={{ padding: '16px 20px', fontSize: '14px', color: '#111827' }}>
                        {transaction.description || 'N/A'}
                      </td>
                      <td style={{ padding: '16px 20px', fontSize: '14px' }}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500',
                          background: isIncome ? '#D1FAE5' : '#FEE2E2',
                          color: isIncome ? '#065F46' : '#991B1B'
                        }}>
                          {transaction.category || 'Uncategorized'}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px', fontSize: '14px', color: '#6B7280' }}>
                        {transaction.vendor || '-'}
                      </td>
                      <td style={{ 
                        padding: '16px 20px', 
                        fontSize: '16px', 
                        fontWeight: 'bold',
                        textAlign: 'right',
                        color: isIncome ? '#10B981' : '#EF4444'
                      }}>
                        {isIncome ? '+' : '-'}${Math.abs(amount).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Add Transaction Modal */}
        {showAddModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: '#ffffff',
              borderRadius: '12px',
              padding: '32px',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '90vh',
              overflow: 'auto'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px'
              }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
                  Add New Transaction
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: '#6B7280'
                  }}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmitTransaction}>
                {/* Amount */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                    Amount *
                  </label>
                  <input
                    type="number"
                    name="amount"
                    step="0.01"
                    value={newTransaction.amount}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '2px solid #E5E7EB',
                      borderRadius: '8px',
                      fontSize: '16px',
                      boxSizing: 'border-box'
                    }}
                    placeholder="0.00"
                  />
                </div>

                {/* Category */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                    Category *
                  </label>
                  <select
                    name="category"
                    value={newTransaction.category}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '2px solid #E5E7EB',
                      borderRadius: '8px',
                      fontSize: '16px',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="">Select a category</option>
                    <optgroup label="Revenue">
                      <option value="donation">Donation (Code: 3300)</option>
                      <option value="fundraising">Fundraising (Code: 3311)</option>
                      <option value="sponsorship">Sponsorship (Code: 3325)</option>
                    </optgroup>
                    <optgroup label="Expenses">
                      <option value="food">Food (Code: 5520)</option>
                      <option value="giveaway">Giveaway (Code: 6413)</option>
                      <option value="uniforms">Uniforms (Code: 5751)</option>
                    </optgroup>
                  </select>
                  <input
                    type="hidden"
                    name="code"
                    value={
                      newTransaction.category === 'donation' ? '3300' :
                      newTransaction.category === 'fundraising' ? '3311' :
                      newTransaction.category === 'sponsorship' ? '3325' :
                      newTransaction.category === 'food' ? '5520' :
                      newTransaction.category === 'giveaway' ? '6413' :
                      newTransaction.category === 'uniforms' ? '5751' : ''
                    }
                  />
                </div>

                {/* Description */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={newTransaction.description}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '2px solid #E5E7EB',
                      borderRadius: '8px',
                      fontSize: '16px',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit'
                    }}
                    placeholder="Enter transaction description"
                  />
                </div>

                {/* Date */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={newTransaction.date}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '2px solid #E5E7EB',
                      borderRadius: '8px',
                      fontSize: '16px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* Vendor */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                    Vendor (Optional)
                  </label>
                  <input
                    type="text"
                    name="vendor"
                    value={newTransaction.vendor}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '2px solid #E5E7EB',
                      borderRadius: '8px',
                      fontSize: '16px',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Vendor name"
                  />
                </div>

                {/* Status */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                    Status
                  </label>
                  <select
                    name="status"
                    value={newTransaction.status}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '2px solid #E5E7EB',
                      borderRadius: '8px',
                      fontSize: '16px',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    disabled={isSubmitting}
                    style={{
                      padding: '10px 20px',
                      background: '#F3F4F6',
                      color: '#374151',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      padding: '10px 20px',
                      background: isSubmitting ? '#9CA3AF' : '#111827',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {isSubmitting ? 'Adding...' : 'Add Transaction'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </section>
    </>
  );
}