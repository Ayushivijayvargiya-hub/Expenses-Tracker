// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation (minimum 6 characters)
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

// Amount validation
export const isValidAmount = (amount: number): boolean => {
  return amount > 0 && !isNaN(amount);
};

// Date validation
export const isValidDate = (date: string): boolean => {
  const dateObj = new Date(date);
  return !isNaN(dateObj.getTime());
};

// Month validation (YYYY-MM format)
export const isValidMonth = (month: string): boolean => {
  const monthRegex = /^\d{4}-\d{2}$/;
  return monthRegex.test(month);
};
