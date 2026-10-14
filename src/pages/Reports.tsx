import React, { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Loading } from '../components/common/Loading';
import { analyticsService } from '../services/analyticsService';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatMonth, formatPercentage } from '../utils/formatters';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';

export const Reports: React.FC = () => {
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const generateMonthlyPDF = async () => {
    try {
      setIsGenerating(true);
      const report = await analyticsService.getMonthlyReport(selectedMonth);

      const doc = new jsPDF();
      let yPos = 20;

      // Header
      doc.setFontSize(20);
      doc.text('FinTrack - Monthly Report', 20, yPos);
      yPos += 10;

      doc.setFontSize(12);
      doc.text(`Month: ${formatMonth(selectedMonth)}`, 20, yPos);
      yPos += 7;
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, yPos);
      yPos += 7;
      doc.text(`User: ${user?.name || 'N/A'}`, 20, yPos);
      yPos += 15;

      // Summary
      doc.setFontSize(16);
      doc.text('Financial Summary', 20, yPos);
      yPos += 10;

      doc.setFontSize(12);
      doc.text(`Total Income: ${formatCurrency(report.totalIncome)}`, 20, yPos);
      yPos += 7;
      doc.text(`Total Expenses: ${formatCurrency(report.totalExpenses)}`, 20, yPos);
      yPos += 7;
      doc.text(`Net Balance: ${formatCurrency(report.balance)}`, 20, yPos);
      yPos += 7;
      doc.text(`Savings Rate: ${formatPercentage(report.savingsRate)}`, 20, yPos);
      yPos += 15;

      // Top Categories
      if (report.topCategories.length > 0) {
        doc.setFontSize(16);
        doc.text('Top Spending Categories', 20, yPos);
        yPos += 10;

        doc.setFontSize(12);
        report.topCategories.forEach((category, index) => {
          doc.text(
            `${index + 1}. ${category.category}: ${formatCurrency(category.amount)} (${formatPercentage(category.percentage)})`,
            20,
            yPos
          );
          yPos += 7;
        });
        yPos += 10;
      }

      // Insights
      doc.setFontSize(16);
      doc.text('Financial Insights', 20, yPos);
      yPos += 10;

      doc.setFontSize(12);
      const insights = [];
      if (report.balance > 0) {
        insights.push(`Great job! You saved ${formatCurrency(report.balance)} this month.`);
      } else {
        insights.push(`You spent ${formatCurrency(Math.abs(report.balance))} more than you earned.`);
      }

      if (report.savingsRate > 20) {
        insights.push(`Excellent savings rate of ${formatPercentage(report.savingsRate)}!`);
      } else if (report.savingsRate > 0) {
        insights.push(`Try to increase your savings rate from ${formatPercentage(report.savingsRate)}.`);
      }

      insights.forEach((insight) => {
        doc.text(`• ${insight}`, 20, yPos);
        yPos += 7;
      });

      // Save PDF
      doc.save(`FinTrack_Monthly_Report_${selectedMonth}.pdf`);
      toast.success('Monthly report generated successfully!');
    } catch (error) {
      toast.error('Failed to generate monthly report');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateYearlyPDF = async () => {
    try {
      setIsGenerating(true);
      const report = await analyticsService.getYearlyReport(selectedYear);

      const doc = new jsPDF();
      let yPos = 20;

      // Header
      doc.setFontSize(20);
      doc.text('FinTrack - Yearly Report', 20, yPos);
      yPos += 10;

      doc.setFontSize(12);
      doc.text(`Year: ${selectedYear}`, 20, yPos);
      yPos += 7;
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, yPos);
      yPos += 7;
      doc.text(`User: ${user?.name || 'N/A'}`, 20, yPos);
      yPos += 15;

      // Summary
      doc.setFontSize(16);
      doc.text('Annual Financial Summary', 20, yPos);
      yPos += 10;

      doc.setFontSize(12);
      doc.text(`Total Income: ${formatCurrency(report.totalIncome)}`, 20, yPos);
      yPos += 7;
      doc.text(`Total Expenses: ${formatCurrency(report.totalExpenses)}`, 20, yPos);
      yPos += 7;
      doc.text(`Net Balance: ${formatCurrency(report.balance)}`, 20, yPos);
      yPos += 7;
      doc.text(`Savings Rate: ${formatPercentage(report.savingsRate)}`, 20, yPos);
      yPos += 15;

      // Top Categories
      if (report.topCategories.length > 0) {
        doc.setFontSize(16);
        doc.text('Top Spending Categories', 20, yPos);
        yPos += 10;

        doc.setFontSize(12);
        report.topCategories.forEach((category, index) => {
          doc.text(
            `${index + 1}. ${category.category}: ${formatCurrency(category.amount)} (${formatPercentage(category.percentage)})`,
            20,
            yPos
          );
          yPos += 7;
        });
        yPos += 10;
      }

      // Monthly Breakdown
      doc.setFontSize(16);
      doc.text('Monthly Breakdown', 20, yPos);
      yPos += 10;

      doc.setFontSize(10);
      const monthsPerPage = 12;
      report.monthlyBreakdown.slice(0, monthsPerPage).forEach((month) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(
          `${month.month}: Income ${formatCurrency(month.income)}, Expense ${formatCurrency(month.expense)}`,
          20,
          yPos
        );
        yPos += 6;
      });

      // Save PDF
      doc.save(`FinTrack_Yearly_Report_${selectedYear}.pdf`);
      toast.success('Yearly report generated successfully!');
    } catch (error) {
      toast.error('Failed to generate yearly report');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <DashboardLayout title="Reports">
      <div className="space-y-6">
        <Card title="Generate Monthly Report">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Month
              </label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full md:w-64 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <Button onClick={generateMonthlyPDF} isLoading={isGenerating}>
              📄 Download Monthly Report (PDF)
            </Button>
          </div>
        </Card>

        <Card title="Generate Yearly Report">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Year
              </label>
              <input
                type="number"
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                min="2020"
                max={new Date().getFullYear()}
                className="w-full md:w-64 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <Button onClick={generateYearlyPDF} isLoading={isGenerating}>
              📊 Download Yearly Report (PDF)
            </Button>
          </div>
        </Card>

        <Card title="Report Information">
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300">
              Generate comprehensive financial reports in PDF format. Reports include:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mt-4">
              <li>Income and expense summaries</li>
              <li>Net balance and savings rate</li>
              <li>Top spending categories</li>
              <li>Monthly breakdown (yearly report)</li>
              <li>Financial insights and recommendations</li>
            </ul>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};
