import { Budget, BudgetFormData } from '../types';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { generateId, delay } from './mockData';
import { authService } from './authService';

class BudgetService {
  // Get all budgets for current user
  async getBudgets(): Promise<Budget[]> {
    await delay(300);

    const userId = authService.getCurrentUserId();
    if (!userId) throw new Error('Not authenticated');

    const budgets: Budget[] = storage.get(STORAGE_KEYS.BUDGETS) || [];

    return budgets
      .filter((b) => b.userId === userId)
      .sort((a, b) => b.month.localeCompare(a.month));
  }

  // Get budget by month
  async getBudgetByMonth(month: string): Promise<Budget | null> {
    await delay(200);

    const userId = authService.getCurrentUserId();
    if (!userId) throw new Error('Not authenticated');

    const budgets: Budget[] = storage.get(STORAGE_KEYS.BUDGETS) || [];
    return budgets.find((b) => b.userId === userId && b.month === month) || null;
  }

  // Create budget
  async createBudget(data: BudgetFormData): Promise<Budget> {
    await delay(300);

    const userId = authService.getCurrentUserId();
    if (!userId) throw new Error('Not authenticated');

    const budgets: Budget[] = storage.get(STORAGE_KEYS.BUDGETS) || [];

    // Check if budget already exists for this month
    const existingBudget = budgets.find((b) => b.userId === userId && b.month === data.month);
    if (existingBudget) {
      throw new Error('Budget already exists for this month');
    }

    const newBudget: Budget = {
      id: generateId(),
      userId,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    budgets.push(newBudget);
    storage.set(STORAGE_KEYS.BUDGETS, budgets);

    return newBudget;
  }

  // Update budget
  async updateBudget(id: string, data: BudgetFormData): Promise<Budget> {
    await delay(300);

    const userId = authService.getCurrentUserId();
    if (!userId) throw new Error('Not authenticated');

    const budgets: Budget[] = storage.get(STORAGE_KEYS.BUDGETS) || [];
    const index = budgets.findIndex((b) => b.id === id && b.userId === userId);

    if (index === -1) {
      throw new Error('Budget not found');
    }

    const updatedBudget: Budget = {
      ...budgets[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    budgets[index] = updatedBudget;
    storage.set(STORAGE_KEYS.BUDGETS, budgets);

    return updatedBudget;
  }

  // Delete budget
  async deleteBudget(id: string): Promise<void> {
    await delay(300);

    const userId = authService.getCurrentUserId();
    if (!userId) throw new Error('Not authenticated');

    const budgets: Budget[] = storage.get(STORAGE_KEYS.BUDGETS) || [];
    const filteredBudgets = budgets.filter((b) => !(b.id === id && b.userId === userId));

    if (filteredBudgets.length === budgets.length) {
      throw new Error('Budget not found');
    }

    storage.set(STORAGE_KEYS.BUDGETS, filteredBudgets);
  }
}

export const budgetService = new BudgetService();
