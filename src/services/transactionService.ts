import { Transaction, TransactionFormData, TransactionFilters } from '../types';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { generateId, delay } from './mockData';
import { authService } from './authService';

class TransactionService {
  // Get all transactions for current user
  async getTransactions(filters?: TransactionFilters): Promise<Transaction[]> {
    await delay(300);

    const userId = authService.getCurrentUserId();
    if (!userId) throw new Error('Not authenticated');

    let transactions: Transaction[] = storage.get(STORAGE_KEYS.TRANSACTIONS) || [];

    // Filter by user
    transactions = transactions.filter((t) => t.userId === userId);

    // Apply filters
    if (filters) {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        transactions = transactions.filter(
          (t) =>
            t.title.toLowerCase().includes(searchLower) ||
            t.notes?.toLowerCase().includes(searchLower)
        );
      }

      if (filters.type && filters.type !== 'all') {
        transactions = transactions.filter((t) => t.type === filters.type);
      }

      if (filters.category) {
        transactions = transactions.filter((t) => t.category === filters.category);
      }

      if (filters.startDate) {
        transactions = transactions.filter((t) => t.date >= filters.startDate!);
      }

      if (filters.endDate) {
        transactions = transactions.filter((t) => t.date <= filters.endDate!);
      }
    }

    // Sort by date descending
    return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  // Get transaction by ID
  async getTransaction(id: string): Promise<Transaction> {
    await delay(200);

    const userId = authService.getCurrentUserId();
    if (!userId) throw new Error('Not authenticated');

    const transactions: Transaction[] = storage.get(STORAGE_KEYS.TRANSACTIONS) || [];
    const transaction = transactions.find((t) => t.id === id && t.userId === userId);

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    return transaction;
  }

  // Create new transaction
  async createTransaction(data: TransactionFormData): Promise<Transaction> {
    await delay(300);

    const userId = authService.getCurrentUserId();
    if (!userId) throw new Error('Not authenticated');

    const transactions: Transaction[] = storage.get(STORAGE_KEYS.TRANSACTIONS) || [];

    const newTransaction: Transaction = {
      id: generateId(),
      userId,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    transactions.push(newTransaction);
    storage.set(STORAGE_KEYS.TRANSACTIONS, transactions);

    return newTransaction;
  }

  // Update transaction
  async updateTransaction(id: string, data: TransactionFormData): Promise<Transaction> {
    await delay(300);

    const userId = authService.getCurrentUserId();
    if (!userId) throw new Error('Not authenticated');

    const transactions: Transaction[] = storage.get(STORAGE_KEYS.TRANSACTIONS) || [];
    const index = transactions.findIndex((t) => t.id === id && t.userId === userId);

    if (index === -1) {
      throw new Error('Transaction not found');
    }

    const updatedTransaction: Transaction = {
      ...transactions[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    transactions[index] = updatedTransaction;
    storage.set(STORAGE_KEYS.TRANSACTIONS, transactions);

    return updatedTransaction;
  }

  // Delete transaction
  async deleteTransaction(id: string): Promise<void> {
    await delay(300);

    const userId = authService.getCurrentUserId();
    if (!userId) throw new Error('Not authenticated');

    const transactions: Transaction[] = storage.get(STORAGE_KEYS.TRANSACTIONS) || [];
    const filteredTransactions = transactions.filter((t) => !(t.id === id && t.userId === userId));

    if (filteredTransactions.length === transactions.length) {
      throw new Error('Transaction not found');
    }

    storage.set(STORAGE_KEYS.TRANSACTIONS, filteredTransactions);
  }

  // Get recent transactions (last 5)
  async getRecentTransactions(): Promise<Transaction[]> {
    const transactions = await this.getTransactions();
    return transactions.slice(0, 5);
  }
}

export const transactionService = new TransactionService();
