// src/services/api.ts

// Base URL for your FastAPI backend
const API_BASE_URL = 'http://localhost:8000'; // Change this to your actual FastAPI URL

// Types matching your FastAPI schemas
interface FinancialsResponse {
  id?: string;
  club_id: number;
  period_start: string;
  period_end: string;
  current_balance: number;
  revenue_donations: number;
  revenue_fundraising: number;
  revenue_sponsorship: number;
  revenue_total: number;
  expense_food: number;
  expense_giveaway: number;
  expense_uniforms: number;
  expenses_total: number;
  pending_revenue?: number;
  pending_expenses?: number;
  updated_at?: string;
}

interface FinancialsCreate {
  club_id: number;
  period_start: string;
  period_end: string;
  current_balance: number;
  revenue_donations: number;
  revenue_fundraising: number;
  revenue_sponsorship: number;
  expense_food: number;
  expense_giveaway: number;
  expense_uniforms: number;
}

interface FinancialsUpdate {
  period_start?: string;
  period_end?: string;
  current_balance?: number;
  revenue_donations?: number;
  revenue_fundraising?: number;
  revenue_sponsorship?: number;
  expense_food?: number;
  expense_giveaway?: number;
  expense_uniforms?: number;
  club_id?: number;
}

interface ChatInput {
  user_message: string;
  session_id: string;
}

interface ChatResponse {
  response: string;
}

// Updated Transaction interfaces to match new backend schema
interface TransactionResponse {
  id: string;
  club_id: number;
  amount: string;
  category: string;  // Now required, not nullable
  description: string | null;
  date: string;
  status: string;  // Not nullable, defaults to "completed"
  vendor: string | null;
  receipt_url: string | null;
  code: string | null;  // New field
  created_at: string;
}

interface TransactionCreate {
  club_id: number;
  amount: number;
  category: string;  // Now required
  description?: string;
  date: string;
  status?: string;  // Optional, defaults to "completed" on backend
  vendor?: string;
  receipt_url?: string;
  code?: string;  // New field
}

// Generic fetch wrapper with error handling
async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

// Financials API calls
export const financialsAPI = {
  // Get single financial summary by club ID
  getByClubId: async (clubsId: number): Promise<FinancialsResponse> => {
    return apiFetch<FinancialsResponse>(`/financials/${clubsId}`);
  },

  // Get all financial summaries for a club
  getAllByClubId: async (clubId: number): Promise<FinancialsResponse[]> => {
    return apiFetch<FinancialsResponse[]>(`/financials/all/${clubId}`);
  },

  // Create new financial summary
  create: async (data: FinancialsCreate): Promise<FinancialsResponse> => {
    return apiFetch<FinancialsResponse>('/financials/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Update financial summary
  update: async (clubId: number, data: FinancialsUpdate): Promise<FinancialsResponse> => {
    return apiFetch<FinancialsResponse>(`/financials/${clubId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
};

// Chat API calls
export const chatAPI = {
  // Send message to AI assistant
  sendMessage: async (message: string, sessionId: string): Promise<ChatResponse> => {
    return apiFetch<ChatResponse>('/chat', {
      method: 'POST',
      body: JSON.stringify({
        user_message: message,
        session_id: sessionId,
      }),
    });
  },
};

// Transactions API calls
export const transactionsAPI = {
  // Get all transactions for a club
  getByClubId: async (clubId: number): Promise<TransactionResponse[]> => {
    return apiFetch<TransactionResponse[]>(`/transactions/club/${clubId}`);
  },

  // Create new transaction
  create: async (data: TransactionCreate): Promise<TransactionResponse> => {
    return apiFetch<TransactionResponse>('/transactions/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Get single transaction by ID
  getById: async (transactionId: string): Promise<TransactionResponse> => {
    return apiFetch<TransactionResponse>(`/transactions/${transactionId}`);
  },
};

// Export all types
export type { 
  FinancialsResponse, 
  FinancialsCreate, 
  FinancialsUpdate, 
  ChatInput, 
  ChatResponse,
  TransactionResponse,
  TransactionCreate 
};