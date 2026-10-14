import React from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Card } from "../components/common/Card";
import { useAuth } from "../context/AuthContext";
import { formatDate } from "../utils/formatters";

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, deleteAccount } = useAuth();

  if (!user) return null;

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Delete your account permanently? This cannot be undone.",
    );
    if (!confirmed) return;

    try {
      await deleteAccount();
      navigate("/login");
    } catch (error) {
      // Error toast shown in auth context
    }
  };

  return (
    <DashboardLayout title="Profile">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card title="User Information">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Member Since
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatDate(user.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    User ID
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white font-mono text-sm">
                    {user.id.slice(0, 8)}...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card title="About FinTrack">
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300">
              FinTrack is a comprehensive personal finance tracker that helps
              you manage your money effectively.
            </p>
            <h4 className="text-gray-900 dark:text-white font-semibold mt-4 mb-2">
              Features:
            </h4>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
              <li>Track income and expenses</li>
              <li>Set and monitor monthly budgets</li>
              <li>View detailed analytics and insights</li>
              <li>Generate PDF reports</li>
              <li>Visualize data with interactive charts</li>
              <li>Dark mode support</li>
            </ul>
          </div>
        </Card>

        <Card title="Application Info">
          <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <p>
              <strong>Version:</strong> 1.0.0
            </p>
            <p>
              <strong>Tech Stack:</strong> React 19, TypeScript, Tailwind CSS,
              Recharts
            </p>
            <p>
              <strong>Data Storage:</strong> LocalStorage (Mock Backend)
            </p>
          </div>
          <div className="mt-6">
            <button
              type="button"
              onClick={handleDelete}
              className="w-full rounded-lg bg-red-600 px-4 py-3 text-white font-semibold hover:bg-red-700 transition"
            >
              Delete Account
            </button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};
