import {
  DashboardAnalytics,
  MonthlyReport,
  YearlyReport,
  Transaction,
  CategoryData,
  MonthlyData,
} from '../types';
import { delay } from './mockData';
import { transactionService } from './transactionService';
import { budgetService } from './budgetService';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';

class AnalyticsService {
  // Get dashboard analytics
  async getDashboardAnalytics(): Promise<DashboardAnalytics> {
    await delay(400);

    const transactions = await transactionService.getTransactions();
    const currentMonth = format(new Date(), 'yyyy-MM');

    // Calculate stats
    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const remainingBalance = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (remainingBalance / totalIncome) * 100 : 0;

    // Get monthly trend (last 6 months)
    const monthlyTrend = this.getMonthlyTrend(transactions, 6);

    // Get category distribution (current month expenses)
    const categoryDistribution = this.getCategoryDistribution(transactions, currentMonth);

    // Get recent transactions
    const recentTransactions = transactions.slice(0, 5);

    return {
      stats: {
        totalIncome,
        totalExpenses,
        remainingBalance,
        savingsRate,
      },
      monthlyTrend,
      categoryDistribution,
      recentTransactions,
    };
  }

  // Get monthly trend
  private getMonthlyTrend(transactions: Transaction[], monthsCount: number): MonthlyData[] {
    const monthlyData: MonthlyData[] = [];
    const now = new Date();

    for (let i = monthsCount - 1; i >= 0; i--) {
      const monthDate = subMonths(now, i);
      const monthStr = format(monthDate, 'yyyy-MM');
      const monthStart = format(startOfMonth(monthDate), 'yyyy-MM-dd');
      const monthEnd = format(endOfMonth(monthDate), 'yyyy-MM-dd');

      const monthTransactions = transactions.filter(
        (t) => t.date >= monthStart && t.date <= monthEnd
      );

      const income = monthTransactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const expense = monthTransactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      monthlyData.push({
        month: format(monthDate, 'MMM yyyy'),
        income,
        expense,
      });
    }

    return monthlyData;
  }

  // Get category distribution
  private getCategoryDistribution(transactions: Transaction[], month: string): CategoryData[] {
    const [year, monthNum] = month.split('-');
    const monthStart = `${year}-${monthNum}-01`;
    const monthEnd = format(
      endOfMonth(new Date(parseInt(year), parseInt(monthNum) - 1)),
      'yyyy-MM-dd'
    );

    const expenseTransactions = transactions.filter(
      (t) => t.type === 'expense' && t.date >= monthStart && t.date <= monthEnd
    );

    const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);

    const categoryMap: Record<string, number> = {};
    expenseTransactions.forEach((t) => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
    });

    return Object.entries(categoryMap)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }

  // Get monthly report
  async getMonthlyReport(month: string): Promise<MonthlyReport> {
    await delay(400);

    const transactions = await transactionService.getTransactions();
    const [year, monthNum] = month.split('-');
    const monthStart = `${year}-${monthNum}-01`;
    const monthEnd = format(
      endOfMonth(new Date(parseInt(year), parseInt(monthNum) - 1)),
      'yyyy-MM-dd'
    );

    const monthTransactions = transactions.filter(
      (t) => t.date >= monthStart && t.date <= monthEnd
    );

    const totalIncome = monthTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = monthTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;

    const topCategories = this.getCategoryDistribution(transactions, month).slice(0, 5);

    return {
      month,
      totalIncome,
      totalExpenses,
      balance,
      savingsRate,
      topCategories,
      transactions: monthTransactions,
    };
  }

  // Get yearly report
  async getYearlyReport(year: number): Promise<YearlyReport> {
    await delay(400);

    const transactions = await transactionService.getTransactions();
    const yearStart = `${year}-01-01`;
    const yearEnd = `${year}-12-31`;

    const yearTransactions = transactions.filter((t) => t.date >= yearStart && t.date <= yearEnd);

    const totalIncome = yearTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = yearTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;

    // Monthly breakdown
    const monthlyBreakdown: MonthlyData[] = [];
    for (let month = 1; month <= 12; month++) {
      const monthStr = `${year}-${month.toString().padStart(2, '0')}`;
      const monthStart = `${monthStr}-01`;
      const monthEnd = format(endOfMonth(new Date(year, month - 1)), 'yyyy-MM-dd');

      const monthTransactions = yearTransactions.filter(
        (t) => t.date >= monthStart && t.date <= monthEnd
      );

      const income = monthTransactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const expense = monthTransactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      monthlyBreakdown.push({
        month: format(new Date(year, month - 1), 'MMM'),
        income,
        expense,
      });
    }

    // Top categories for the year
    const expenseTransactions = yearTransactions.filter((t) => t.type === 'expense');
    const totalYearExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);

    const categoryMap: Record<string, number> = {};
    expenseTransactions.forEach((t) => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
    });

    const topCategories: CategoryData[] = Object.entries(categoryMap)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totalYearExpenses > 0 ? (amount / totalYearExpenses) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    return {
      year,
      totalIncome,
      totalExpenses,
      balance,
      savingsRate,
      monthlyBreakdown,
      topCategories,
    };
  }

  // Get budget utilization for current month
  async getBudgetUtilization(): Promise<{
    budget: number;
    spent: number;
    remaining: number;
    percentage: number;
  }> {
    await delay(200);

    const currentMonth = format(new Date(), 'yyyy-MM');
    const budget = await budgetService.getBudgetByMonth(currentMonth);

    if (!budget) {
      return {
        budget: 0,
        spent: 0,
        remaining: 0,
        percentage: 0,
      };
    }

    const transactions = await transactionService.getTransactions();
    const monthStart = `${currentMonth}-01`;
    const monthEnd = format(endOfMonth(new Date()), 'yyyy-MM-dd');

    const spent = transactions
      .filter((t) => t.type === 'expense' && t.date >= monthStart && t.date <= monthEnd)
      .reduce((sum, t) => sum + t.amount, 0);

    const remaining = budget.budgetAmount - spent;
    const percentage = (spent / budget.budgetAmount) * 100;

    return {
      budget: budget.budgetAmount,
      spent,
      remaining,
      percentage,
    };
  }
}

export const analyticsService = new AnalyticsService();
