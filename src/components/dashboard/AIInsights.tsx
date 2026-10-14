import React, { useEffect, useState } from 'react';
import { Card } from '../common/Card';
import { transactionService } from '../../services/transactionService';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';

interface InsightData {
  currentMonthExpenses: number;
  lastMonthExpenses: number;
  percentageChange: number;
  trend: 'increased' | 'decreased' | 'stable';
  message: string;
  recommendation: string;
}

export const AIInsights: React.FC = () => {
  const [insight, setInsight] = useState<InsightData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    generateInsights();
  }, []);

  const generateInsights = async () => {
    try {
      setIsLoading(true);

      const now = new Date();
      const lastMonth = subMonths(now, 1);

      // Current month transactions
      const currentMonthStart = format(startOfMonth(now), 'yyyy-MM-dd');
      const currentMonthEnd = format(endOfMonth(now), 'yyyy-MM-dd');

      // Last month transactions
      const lastMonthStart = format(startOfMonth(lastMonth), 'yyyy-MM-dd');
      const lastMonthEnd = format(endOfMonth(lastMonth), 'yyyy-MM-dd');

      const allTransactions = await transactionService.getTransactions();

      // Calculate current month expenses
      const currentMonthExpenses = allTransactions
        .filter(
          (t) =>
            t.type === 'expense' &&
            t.date >= currentMonthStart &&
            t.date <= currentMonthEnd
        )
        .reduce((sum, t) => sum + t.amount, 0);

      // Calculate last month expenses
      const lastMonthExpenses = allTransactions
        .filter(
          (t) =>
            t.type === 'expense' &&
            t.date >= lastMonthStart &&
            t.date <= lastMonthEnd
        )
        .reduce((sum, t) => sum + t.amount, 0);

      // Calculate percentage change
      let percentageChange = 0;
      let trend: 'increased' | 'decreased' | 'stable' = 'stable';

      if (lastMonthExpenses > 0) {
        percentageChange =
          ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100;
      } else if (currentMonthExpenses > 0) {
        percentageChange = 100;
      }

      if (percentageChange > 5) {
        trend = 'increased';
      } else if (percentageChange < -5) {
        trend = 'decreased';
      }

      // Generate AI message
      const message = generateMessage(
        currentMonthExpenses,
        lastMonthExpenses,
        percentageChange,
        trend
      );

      // Generate recommendation
      const recommendation = generateRecommendation(
        currentMonthExpenses,
        lastMonthExpenses,
        trend,
        percentageChange
      );

      setInsight({
        currentMonthExpenses,
        lastMonthExpenses,
        percentageChange,
        trend,
        message,
        recommendation,
      });
    } catch (error) {
      console.error('Error generating insights:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMessage = (
    current: number,
    last: number,
    change: number,
    trend: string
  ): string => {
    const currentMonth = format(new Date(), 'MMMM');
    const lastMonth = format(subMonths(new Date(), 1), 'MMMM');

    if (current === 0 && last === 0) {
      return `No expense data available for ${currentMonth} and ${lastMonth}. Start tracking your expenses to get insights!`;
    }

    if (current === 0) {
      return `Great! You haven't recorded any expenses in ${currentMonth} yet. Keep tracking!`;
    }

    if (last === 0) {
      return `You've spent ${formatCurrency(current)} in ${currentMonth}. No data from ${lastMonth} to compare.`;
    }

    const changeText = Math.abs(change).toFixed(1);

    if (trend === 'increased') {
      return `⚠️ Your expenses have increased by ${changeText}% compared to last month. You spent ${formatCurrency(current)} in ${currentMonth} vs ${formatCurrency(last)} in ${lastMonth}.`;
    } else if (trend === 'decreased') {
      return `✅ Great job! Your expenses decreased by ${changeText}% compared to last month. You spent ${formatCurrency(current)} in ${currentMonth} vs ${formatCurrency(last)} in ${lastMonth}.`;
    } else {
      return `📊 Your expenses are stable. You spent ${formatCurrency(current)} in ${currentMonth}, similar to ${formatCurrency(last)} in ${lastMonth}.`;
    }
  };

  const generateRecommendation = (
    current: number,
    last: number,
    trend: string,
    change: number
  ): string => {
    if (current === 0 && last === 0) {
      return 'Start adding your daily expenses to get personalized financial insights and recommendations.';
    }

    if (trend === 'increased') {
      if (change > 30) {
        return '🚨 Significant increase detected! Review your spending categories to identify where expenses have grown. Consider creating a stricter budget for next month.';
      } else if (change > 15) {
        return '⚠️ Moderate increase in spending. Check if this was due to one-time purchases or a change in spending habits. Monitor closely.';
      } else {
        return '📈 Slight increase in expenses. This is normal, but keep an eye on your spending to avoid it becoming a trend.';
      }
    } else if (trend === 'decreased') {
      if (change < -20) {
        return '🎉 Excellent cost reduction! You\'re doing great. Maintain these spending habits to build your savings faster.';
      } else {
        return '👍 Good progress on reducing expenses. Keep up the good work and look for more areas to optimize.';
      }
    } else {
      return '💡 Your spending is consistent. Consider setting aside the extra income for savings or investments if your income has increased.';
    }
  };

  if (isLoading) {
    return (
      <Card title="💡 AI Financial Insights">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        </div>
      </Card>
    );
  }

  if (!insight) {
    return null;
  }

  const getTrendColor = () => {
    if (insight.trend === 'increased') return 'text-red-600 dark:text-red-400';
    if (insight.trend === 'decreased') return 'text-green-600 dark:text-green-400';
    return 'text-blue-600 dark:text-blue-400';
  };

  const getTrendBg = () => {
    if (insight.trend === 'increased') return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
    if (insight.trend === 'decreased') return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
    return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
  };

  return (
    <Card>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🤖</span>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            AI Financial Insights
          </h3>
        </div>

        <div className={`p-4 rounded-lg border ${getTrendBg()}`}>
          <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{insight.message}</p>
        </div>

        {insight.currentMonthExpenses > 0 || insight.lastMonthExpenses > 0 ? (
          <div className="grid grid-cols-2 gap-4 py-3 border-t border-gray-200 dark:border-gray-700">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Last Month</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatCurrency(insight.lastMonthExpenses)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">This Month</p>
              <p className={`text-lg font-semibold ${getTrendColor()}`}>
                {formatCurrency(insight.currentMonthExpenses)}
              </p>
            </div>
          </div>
        ) : null}

        {Math.abs(insight.percentageChange) > 0 && (
          <div className="flex items-center gap-2 pt-2">
            <span className={`text-2xl ${getTrendColor()}`}>
              {insight.trend === 'increased' ? '📈' : insight.trend === 'decreased' ? '📉' : '➡️'}
            </span>
            <span className={`font-semibold ${getTrendColor()}`}>
              {insight.percentageChange > 0 ? '+' : ''}
              {formatPercentage(Math.abs(insight.percentageChange))} change
            </span>
          </div>
        )}

        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            💡 Recommendation:
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {insight.recommendation}
          </p>
        </div>
      </div>
    </Card>
  );
};
