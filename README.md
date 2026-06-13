# FinTrack - Personal Finance Tracker

A full-featured personal finance tracker built with React, TypeScript, and Tailwind CSS.

## Features

### ✅ Authentication
- User registration with email and password
- Secure login system
- JWT-like token authentication (simulated)
- Password hashing (demo implementation)
- Protected routes

### 📊 Dashboard
- Overview cards showing:
  - Total Income
  - Total Expenses
  - Remaining Balance
  - Savings Rate
- Interactive charts:
  - Monthly Expense Trend (Line Chart)
  - Expense Category Distribution (Pie Chart)
  - Income vs Expense Comparison (Bar Chart)
- Recent transactions list

### 💸 Transaction Management
- Add, edit, and delete transactions
- Transaction fields:
  - Title
  - Amount
  - Type (Income/Expense)
  - Category
  - Date
  - Notes
- Search and filter functionality
- Filter by type (Income/Expense/All)
- Real-time search

### 💰 Budget Management
- Set monthly budgets
- View budget utilization with progress bars
- Warnings at 80% utilization
- Alerts when budget is exceeded
- Edit and delete budgets
- Track spending against budget

### 📈 Analytics
- Monthly reports with:
  - Total income and expenses
  - Net balance
  - Savings rate
  - Top spending categories
- Category-wise spending analysis
- Transaction history by month

### 📄 Reports
- Generate PDF reports:
  - Monthly financial reports
  - Yearly financial summaries
- Export functionality with jsPDF
- Includes:
  - Income/expense summaries
  - Top categories
  - Financial insights
  - Spending trends

### 👤 User Profile
- View user information
- Account details
- App information

### 🌓 Dark Mode
- Full dark mode support
- Persisted theme preference
- Smooth transitions

## Tech Stack

- **Frontend**: React 19, TypeScript
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **PDF Generation**: jsPDF
- **State Management**: React Context API
- **Notifications**: React Hot Toast
- **Data Storage**: LocalStorage (Mock Backend)
- **Date Handling**: date-fns
- **Build Tool**: Vite

## Project Structure

```
src/
├── components/
│   ├── common/          # Reusable components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   └── Loading.tsx
│   ├── dashboard/       # Dashboard-specific components
│   │   └── StatCard.tsx
│   ├── layout/          # Layout components
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── DashboardLayout.tsx
│   └── routing/         # Route protection
│       └── ProtectedRoute.tsx
├── context/             # React Context
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
├── pages/              # Page components
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Dashboard.tsx
│   ├── Transactions.tsx
│   ├── Budgets.tsx
│   ├── Analytics.tsx
│   ├── Reports.tsx
│   └── Profile.tsx
├── services/           # Business logic & API
│   ├── authService.ts
│   ├── transactionService.ts
│   ├── budgetService.ts
│   ├── analyticsService.ts
│   └── mockData.ts
├── types/              # TypeScript types
│   └── index.ts
├── constants/          # Constants
│   └── categories.ts
├── utils/              # Utility functions
│   ├── storage.ts
│   ├── formatters.ts
│   ├── validators.ts
│   └── cn.ts
├── App.tsx             # Main app component
├── main.tsx            # Entry point
└── index.css           # Global styles
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. Clone the repository or extract the files

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:5173
```

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Usage

### First Time Setup

1. Navigate to the register page
2. Create an account with:
   - Name
   - Email
   - Password (minimum 6 characters)
3. You'll be automatically logged in with a clean, empty interface
4. Start adding your own transactions and budgets

### Using the App

#### Dashboard
- View your financial overview
- See charts and recent transactions
- Quick access to all features

#### Transactions
- Click "+ Add Transaction" to create new transactions
- Use the search bar to find specific transactions
- Filter by type (Income/Expense)
- Click "Edit" to modify or "Delete" to remove

#### Budgets
- Click "+ Set Budget" to create a monthly budget
- View current month's budget utilization
- Get warnings when approaching budget limits
- Manage past budgets

#### Analytics
- Select a month to view detailed analytics
- See top spending categories
- Review all transactions for the period

#### Reports
- Generate monthly or yearly PDF reports
- Download reports for your records
- Share financial summaries

#### Dark Mode
- Click the moon/sun icon in the sidebar
- Theme preference is saved automatically

## Data Storage

This application uses **LocalStorage** for data persistence. All data is stored in your browser:

- `fintrack_user` - Current user session
- `fintrack_token` - Authentication token
- `fintrack_users` - All registered users
- `fintrack_transactions` - All transactions
- `fintrack_budgets` - All budgets
- `fintrack_theme` - Theme preference

**Note**: Data is stored locally in your browser. Clearing browser data will remove all information.

## Categories

### Income Categories
- Salary
- Freelancing
- Business
- Investment
- Other

### Expense Categories
- Food
- Travel
- Shopping
- Entertainment
- Health
- Education
- Bills
- Other

## Features in Detail

### Budget Warnings
- **Green** (< 50%): Healthy spending
- **Yellow** (50-80%): Moderate spending
- **Orange** (80-100%): Warning - approaching limit
- **Red** (> 100%): Budget exceeded

### Charts
- **Line Chart**: Shows expense trends over 6 months
- **Pie Chart**: Category distribution for current month
- **Bar Chart**: Income vs Expense comparison

### PDF Reports Include
- User information
- Date range
- Financial summary (income, expenses, balance, savings rate)
- Top spending categories
- Monthly breakdown (yearly report)
- Financial insights

## Future Enhancements

To connect this to a real backend:

1. Replace the mock services in `src/services/` with real API calls
2. Set up a Node.js/Express backend with:
   - MongoDB database
   - JWT authentication with HTTP-only cookies
   - Express validators
   - Bcrypt for password hashing
3. Deploy backend to services like:
   - Render
   - Heroku
   - Railway
   - Vercel (serverless)
4. Deploy frontend to:
   - Vercel
   - Netlify
   - GitHub Pages

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is open source and available for personal and commercial use.

## Support

For issues or questions, please check the code comments or create an issue in the repository.

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**
