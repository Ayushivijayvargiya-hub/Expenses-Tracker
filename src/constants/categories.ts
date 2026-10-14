import { ExpenseCategory, IncomeCategory } from '../types';

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Food',
  'Travel',
  'Shopping',
  'Entertainment',
  'Health',
  'Education',
  'Bills',
  'Other',
];

export const INCOME_CATEGORIES: IncomeCategory[] = [
  'Salary',
  'Freelancing',
  'Business',
  'Investment',
  'Other',
];

export const CATEGORY_COLORS: Record<string, string> = {
  Food: '#FF6384',
  Travel: '#36A2EB',
  Shopping: '#FFCE56',
  Entertainment: '#4BC0C0',
  Health: '#9966FF',
  Education: '#FF9F40',
  Bills: '#FF6384',
  Salary: '#4BC0C0',
  Freelancing: '#36A2EB',
  Business: '#FFCE56',
  Investment: '#9966FF',
  Other: '#C9CBCF',
};
