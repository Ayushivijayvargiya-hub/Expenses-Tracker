# FinTrack – Personal Finance Tracker

FinTrack is a personal finance tracking web application built using **React, TypeScript, and Tailwind CSS**. It helps users manage income and expenses, track monthly budgets, analyze spending patterns, and generate financial reports through an intuitive dashboard. The application also includes an **AI-powered expense assistant** that provides smart suggestions and insights based on user spending data.

## Features

* User authentication with protected routes
* Add, edit, delete, search, and filter transactions
* Monthly budget tracking with utilization alerts
* Dashboard with financial summary cards and charts
* Expense analytics by category and month
* AI-powered expense suggestions and spending insights
* PDF report generation for financial summaries
* Dark mode support with persisted theme preference
* LocalStorage-based data persistence

## Tech Stack

* **Frontend:** React 19, TypeScript, Tailwind CSS
* **Routing:** React Router v6
* **State Management:** React Context API
* **Charts:** Recharts
* **PDF Generation:** jsPDF
* **Utilities:** date-fns, React Hot Toast
* **Storage:** LocalStorage
* **Build Tool:** Vite

## Project Structure

```bash
src/
├── components/      # Reusable UI, dashboard, layout, and routing components
├── context/         # Auth and theme context
├── pages/           # Login, dashboard, transactions, budgets, analytics, reports
├── services/        # Business logic and local storage handling
├── types/           # TypeScript type definitions
├── constants/       # Categories and static data
├── utils/           # Helper functions and validators
├── App.tsx
├── main.tsx
└── index.css
```

## Installation and Setup

### Prerequisites

* Node.js 18+
* npm

### Run Locally

```bash
git clone https://github.com/Ayushivijayvargiya-hub/Expenses-Tracker.git
cd Expenses-Tracker
npm install
npm run dev
```

Open the app at: `http://localhost:5173`

## Data Storage

The application uses **LocalStorage** to store:

* user authentication details
* transactions
* budgets
* theme preference

> **Note:** Clearing browser storage will remove the saved data.

## Future Improvements

* Integrate a real backend using **Node.js, Express, and MongoDB**
* Add secure JWT authentication and database persistence
* Enhance the AI assistant with personalized financial recommendations and forecasting


