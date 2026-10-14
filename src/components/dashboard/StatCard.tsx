import React from 'react';
import { Card } from '../common/Card';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

interface StatCardProps {
  title: string;
  value: number;
  icon: string;
  type?: 'currency' | 'percentage';
  trend?: 'up' | 'down';
  color?: 'blue' | 'green' | 'red' | 'yellow';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  type = 'currency',
  trend,
  color = 'blue',
}) => {
  const colorClasses = {
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    red: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    yellow: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
  };

  const formattedValue = type === 'currency' ? formatCurrency(value) : formatPercentage(value);

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{formattedValue}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <span className={trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                {trend === 'up' ? '↑' : '↓'}
              </span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
};
