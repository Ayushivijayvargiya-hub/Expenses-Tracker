import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Input } from "../components/common/Input";
import { Button } from "../components/common/Button";
import { storage } from "../utils/storage";
import { User } from "../types";

interface LocationState {
  email?: string;
}

export const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyEmail } = useAuth();
  const [formData, setFormData] = useState({
    email: (location.state as LocationState)?.email || "",
    code: "",
  });
  const [demoCode, setDemoCode] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (formData.email) {
      const users: (User & { verificationCode?: string })[] =
        storage.get("fintrack_users") || [];
      const user = users.find((u) => u.email === formData.email);
      setDemoCode(user?.verificationCode || "");
    }
  }, [formData.email]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    }

    if (!formData.code) {
      newErrors.code = "Verification code is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);
    try {
      await verifyEmail(formData.email, formData.code);
      navigate("/login");
    } catch (error) {
      // handled by context
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-950 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
              <span className="text-3xl">✉️</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Verify your email
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Enter the 6-digit code sent to your email.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              error={errors.email}
              placeholder="Enter your email"
            />

            <Input
              label="Verification Code"
              type="text"
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value })
              }
              error={errors.code}
              placeholder="Enter the code"
            />

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Verify Email
            </Button>
          </form>

          {demoCode && (
            <div className="mt-6 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-slate-900 p-4">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                Demo verification code:
              </p>
              <p className="mt-2 text-lg font-semibold text-blue-600 dark:text-blue-400">
                {demoCode}
              </p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                In a production app, this code would be emailed to you.
              </p>
            </div>
          )}

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Already verified?{" "}
            <Link
              to="/login"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
