import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Modal } from '../components/common/Modal';
import { Loading } from '../components/common/Loading';
import { budgetService } from '../services/budgetService';
import { analyticsService } from '../services/analyticsService';
import { Budget, BudgetFormData } from '../types';
import { formatCurrency, formatMonth } from '../utils/formatters';
import toast from 'react-hot-toast';

export const Budgets: React.FC = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [currentBudgetUtilization, setCurrentBudgetUtilization] = useState<any>(null);

  const [formData, setFormData] = useState<BudgetFormData>({
    month: new Date().toISOString().slice(0, 7),
    budgetAmount: 0,
  });

  useEffect(() => {
    loadBudgets();
    loadCurrentUtilization();
  }, []);

  const loadBudgets = async () => {
    try {
      setIsLoading(true);
      const data = await budgetService.getBudgets();
      setBudgets(data);
    } catch (error) {
      toast.error('Failed to load budgets');
    } finally {
      setIsLoading(false);
    }
  };

  const loadCurrentUtilization = async () => {
    try {
      const data = await analyticsService.getBudgetUtilization();
      setCurrentBudgetUtilization(data);
    } catch (error) {
      console.error('Error loading budget utilization:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      month: new Date().toISOString().slice(0, 7),
      budgetAmount: 0,
    });
    setEditingBudget(null);
  };

  const handleOpenModal = (budget?: Budget) => {
    if (budget) {
      setEditingBudget(budget);
      setFormData({
        month: budget.month,
        budgetAmount: budget.budgetAmount,
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingBudget) {
        await budgetService.updateBudget(editingBudget.id, formData);
        toast.success('Budget updated successfully');
      } else {
        await budgetService.createBudget(formData);
        toast.success('Budget created successfully');
      }
      handleCloseModal();
      loadBudgets();
      loadCurrentUtilization();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save budget');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this budget?')) return;

    try {
      await budgetService.deleteBudget(id);
      toast.success('Budget deleted successfully');
      loadBudgets();
      loadCurrentUtilization();
    } catch (error) {
      toast.error('Failed to delete budget');
    }
  };

  const getUtilizationColor = (percentage: number) => {
    if (percentage < 50) return 'bg-green-500';
    if (percentage < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getUtilizationTextColor = (percentage: number) => {
    if (percentage < 50) return 'text-green-600 dark:text-green-400';
    if (percentage < 80) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <DashboardLayout title="Budgets">
      <div className="space-y-6">
        {/* Current Month Budget Overview */}
        {currentBudgetUtilization && currentBudgetUtilization.budget > 0 && (
          <Card title="Current Month Budget">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Budget</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(currentBudgetUtilization.budget)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Spent</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {formatCurrency(currentBudgetUtilization.spent)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Remaining</p>
                  <p
                    className={`text-2xl font-bold ${
                      currentBudgetUtilization.remaining >= 0
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {formatCurrency(currentBudgetUtilization.remaining)}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Utilization</span>
                  <span className={getUtilizationTextColor(currentBudgetUtilization.percentage)}>
                    {currentBudgetUtilization.percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                  <div
                    className={`h-full ${getUtilizationColor(currentBudgetUtilization.percentage)} transition-all`}
                    style={{ width: `${Math.min(currentBudgetUtilization.percentage, 100)}%` }}
                  />
                </div>
              </div>

              {/* Warnings */}
              {currentBudgetUtilization.percentage >= 100 && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-800 dark:text-red-300 font-medium">
                    ⚠️ Budget Exceeded! You've spent {formatCurrency(Math.abs(currentBudgetUtilization.remaining))} over your budget.
                  </p>
                </div>
              )}
              {currentBudgetUtilization.percentage >= 80 && currentBudgetUtilization.percentage < 100 && (
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-300 font-medium">
                    ⚠️ Warning! You've used {currentBudgetUtilization.percentage.toFixed(1)}% of your budget.
                  </p>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Header Actions */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">All Budgets</h2>
          <Button onClick={() => handleOpenModal()}>+ Set Budget</Button>
        </div>

        {/* Budgets List */}
        <Card>
          {isLoading ? (
            <Loading />
          ) : budgets.length > 0 ? (
            <div className="space-y-3">
              {budgets.map((budget) => (
                <div
                  key={budget.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {formatMonth(budget.month)}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Budget: {formatCurrency(budget.budgetAmount)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenModal(budget)}
                      className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(budget.id)}
                      className="text-red-600 dark:text-red-400 hover:underline text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">No budgets set</p>
              <Button onClick={() => handleOpenModal()} className="mt-4">
                Set Your First Budget
              </Button>
            </div>
          )}
        </Card>
      </div>

      {/* Budget Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingBudget ? 'Edit Budget' : 'Set Budget'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Month"
            type="month"
            value={formData.month}
            onChange={(e) => setFormData({ ...formData, month: e.target.value })}
            required
          />

          <Input
            label="Budget Amount"
            type="number"
            step="0.01"
            value={formData.budgetAmount || ''}
            onChange={(e) => setFormData({ ...formData, budgetAmount: parseFloat(e.target.value) || 0 })}
            required
            placeholder="0.00"
          />

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              {editingBudget ? 'Update' : 'Set'} Budget
            </Button>
            <Button type="button" variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};
