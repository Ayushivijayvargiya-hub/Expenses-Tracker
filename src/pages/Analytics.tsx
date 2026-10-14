import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/common/Card';
import { Loading } from '../components/common/Loading';
import { analyticsService } from '../services/analyticsService';
import { MonthlyReport } from '../types';
import { formatCurrency, formatMonth, formatPercentage } from '../utils/formatters';

export const Analytics: React.FC = () => {
  const [monthlyReport, setMonthlyReport] = useState<MonthlyReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  useEffect(() => {
    loadMonthlyReport();
  }, [selectedMonth]);

  const loadMonthlyReport = async () => {
    try {
      setIsLoading(true);
      const data = await analyticsService.getMonthlyReport(selectedMonth);
      setMonthlyReport(data);
    } catch (error) {
      console.error('Error loading monthly report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Analytics">
        <Loading />
      </DashboardLayout>
    );
  }

  if (!monthlyReport) {
    return (
      <DashboardLayout title="Analytics">
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">No data available</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Analytics">
      <div className="space-y-6">
        {/* Month Selector */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {formatMonth(selectedMonth)} Report
          </h2>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Income</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(monthlyReport.totalIncome)}
              </p>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {formatCurrency(monthlyReport.totalExpenses)}
              </p>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Net Balance</p>
              <p
                className={`text-2xl font-bold ${
                  monthlyReport.balance >= 0
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {formatCurrency(monthlyReport.balance)}
              </p>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Savings Rate</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatPercentage(monthlyReport.savingsRate)}
              </p>
            </div>
          </Card>
        </div>

        {/* Top Spending Categories */}
        <Card title="Top Spending Categories">
          {monthlyReport.topCategories.length > 0 ? (
            <div className="space-y-4">
              {monthlyReport.topCategories.map((category, index) => (
                <div key={category.category}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {index + 1}. {category.category}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {formatCurrency(category.amount)} ({formatPercentage(category.percentage)})
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all"
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 dark:text-gray-400 py-8">
              No expense data for this month
            </p>
          )}
        </Card>

        {/* Transactions for the Month */}
        <Card title={`Transactions (${monthlyReport.transactions.length})`}>
          {monthlyReport.transactions.length > 0 ? (
            <div className="space-y-3">
              {monthlyReport.transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`px-2 py-0.5 text-xs rounded ${
                          transaction.type === 'income'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                        }`}
                      >
                        {transaction.type}
                      </span>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {transaction.category}
                      </span>
                    </div>
                    <p className="font-medium text-gray-900 dark:text-white">{transaction.title}</p>
                  </div>
                  <p
                    className={`font-semibold ${
                      transaction.type === 'income'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 dark:text-gray-400 py-8">
              No transactions for this month
            </p>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};
