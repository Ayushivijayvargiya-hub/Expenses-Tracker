# FinTrack - Quick Start Guide

Get up and running with FinTrack in 5 minutes!

## 🚀 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:5173 in your browser.

## 📝 First Steps

### 1. Create an Account

- Click "Sign up" on the login page
- Fill in your details:
  - Name: Your Name
  - Email: your@email.com
  - Password: minimum 6 characters
- Click "Sign Up"

You'll be automatically logged in with a clean, empty interface!

### 2. Explore the Dashboard

The dashboard will be empty initially:
- **Financial Overview**: Will show ₹0 until you add transactions
- **Charts**: Will populate as you add data
- **Recent Transactions**: Will appear when you add transactions

### 3. Add Your First Transaction

1. Go to "Transactions" in the sidebar
2. Click "+ Add Transaction"
3. Fill in the form with your real data:
   - Title: e.g., "Monthly Salary" or "Grocery Shopping"
   - Amount: e.g., 75000 or 3500
   - Type: Income or Expense
   - Category: Choose from the list
   - Date: Select the date
   - Notes: Optional
4. Click "Create Transaction"

Your transaction will appear immediately!

### 4. Set a Budget

1. Go to "Budgets" in the sidebar
2. Click "+ Set Budget"
3. Set your monthly budget:
   - Month: Select current month
   - Amount: e.g., 50000 (your planned monthly spending)
4. Click "Set Budget"

Your budget will track automatically as you add expenses!

### 5. View Analytics

1. Go to "Analytics" in the sidebar
2. Select a month
3. See:
   - Total income and expenses
   - Top spending categories
   - All transactions for the month

### 6. Generate Reports

1. Go to "Reports" in the sidebar
2. Select a month or year
3. Click "Download Monthly Report" or "Download Yearly Report"
4. Open the PDF to view your financial summary

### 7. Try Dark Mode

Click the moon icon (🌙) in the sidebar to toggle dark mode!

## 🎯 Quick Tips

### Managing Transactions
- **Search**: Use the search bar to find transactions
- **Filter**: Filter by Income or Expense
- **Edit**: Click "Edit" on any transaction to modify
- **Delete**: Click "Delete" to remove (with confirmation)

### Budget Warnings
- 🟢 **Green** (0-50%): You're doing great!
- 🟡 **Yellow** (50-80%): Getting close to your limit
- 🟠 **Orange** (80-100%): Warning! Almost at budget
- 🔴 **Red** (>100%): You've exceeded your budget

### Categories

**Income:**
- Salary
- Freelancing
- Business
- Investment
- Other

**Expense:**
- Food
- Travel
- Shopping
- Entertainment
- Health
- Education
- Bills
- Other

## 💡 Pro Tips

1. **Regular Updates**: Add transactions daily for accuracy
2. **Budget Planning**: Set realistic monthly budgets
3. **Category Use**: Use specific categories for better insights
4. **Notes**: Add notes to remember transaction context
5. **Monthly Reviews**: Check analytics monthly to track progress

## 🎨 Features Overview

| Feature | Description |
|---------|-------------|
| **Dashboard** | Overview of your finances with charts |
| **Transactions** | Add, edit, delete, search, and filter |
| **Budgets** | Set and track monthly spending limits |
| **Analytics** | Detailed monthly financial analysis |
| **Reports** | Generate PDF reports (monthly/yearly) |
| **Dark Mode** | Easy on the eyes, saves battery |
| **Responsive** | Works on desktop, tablet, and mobile |

## 📱 Keyboard Shortcuts

- `Esc` - Close modals
- `Enter` - Submit forms

## 🔒 Data Storage

Your data is stored locally in your browser using LocalStorage:
- ✅ Private and secure
- ✅ Works offline
- ✅ No server required
- ⚠️ Cleared if you clear browser data

## 🐛 Troubleshooting

### Can't Login?
- Make sure you registered first
- Check email and password are correct
- Try clearing browser cache and registering again

### Data Not Showing?
- Refresh the page
- Check browser console for errors
- Ensure JavaScript is enabled

### Charts Not Loading?
- Ensure you have transactions added
- Try adding more data for better visualization

## 🎓 Learning Path

**Beginner:**
1. Create account
2. Add 5 transactions
3. Set a budget
4. View dashboard

**Intermediate:**
5. Try all transaction categories
6. Use search and filters
7. Generate a monthly report
8. Enable dark mode

**Advanced:**
9. Track finances for a month
10. Analyze spending patterns
11. Adjust budgets based on analytics
12. Generate yearly report

## 📚 Next Steps

Want to learn more?
- Read the full [README.md](README.md)
- Check out [DEPLOYMENT.md](DEPLOYMENT.md) for deployment options
- Explore the code to understand how it works

## 🆘 Need Help?

Common Questions:

**Q: Is my data secure?**
A: Yes, all data is stored locally in your browser. No data is sent to any server.

**Q: Can I export my data?**
A: Yes, use the Reports feature to generate PDFs. For full data export, you can access LocalStorage directly.

**Q: Will my data sync across devices?**
A: No, in the current version data is device-specific. See DEPLOYMENT.md for setting up a backend for sync.

**Q: Can I use real money tracking?**
A: Yes! This is a real finance tracker. Add your actual transactions and budgets.

---

**Enjoy tracking your finances! 💰**

For more features and updates, check the [README.md](README.md) file.
