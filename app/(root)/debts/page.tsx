'use client'

import DoughnutChartTextOverview from '@/components/ui/DoughnutChartTextOverview';
import FloatingButton from '@/components/ui/FloatingButton';
import SavingsDebtAreaChart from '@/components/ui/SavingsDebtAreaChart';
import TransactionsDebtTable from '@/components/ui/TransactionsDebtTable'
import TransactionsRepaymentTable from '@/components/ui/TransactionsRepaymentTable';
import React from 'react'

const dummyData: DoughnutChartTextData[] = [
  { name: "Salary", category: "Job", amount: 4000},
  { name: "Side Hustle", category: "Freelance", amount: 1200},
  { name: "Rental Income", category: "Rent", amount: 700 },
  { name: "Stock Profits", category: "Investments", amount: 800 },
  { name: "Dividends", category: "Investments", amount: 500 },
  { name: "Consulting", category: "Freelance", amount: 900 },
  { name: "App Royalties", category: "Royalties", amount: 600 },
  { name: "YouTube Revenue", category: "Content Creation", amount: 1000 },
  { name: "Blog Ads", category: "Content Creation", amount: 750 },
  { name: "E-book Sales", category: "Sales", amount: 550 },
  { name: "Tutoring", category: "Education", amount: 400 },
  { name: "Delivery Tips", category: "Tips", amount: 300 },
  { name: "Gift", category: "Personal", amount: 200 },
  { name: "Scholarship", category: "Education", amount: 1500 },
  { name: "Cashback", category: "Rebates", amount: 250 },
];

const doughnutChartPercentageData: DoughnutChartPercentageData[] = [
  { name: "January Income", category: "Income", amount: 3000, date: new Date("2025-01-01") },
  { name: "January Expense", category: "Income", amount: 1500, date: new Date("2025-01-01") },
  { name: "January Savings", category: "Income", amount: 1000, date: new Date("2025-01-01") },
];

const doughnutChartData: DoughnutChartTextData[] = [
  { name: "Income for January", category: "Income", amount: 4000 }
  // { name: "Expenses for January", category: "Expense", amount: 2500 },
  // { name: "Savings for January", category: "Savings", amount: 1500 },
];

const options = [
  {label: 'Add Savings', value: 'addSavingsTransactions', route: '/savings', icon: "/icons/logo-wallet-blue.svg"},
  {label: 'Add Income and Expense Transactions', value: 'addIncomeExpenseTransactions', route: '/income-expense', icon: "/icons/logo-wallet-blue.svg"},
  {label: 'Add Repayment', value: 'addRepaymentTransactions', route: '/debts/individual-repayment-transaction', icon: "/icons/logo-wallet-blue.svg"},
  {label: 'Add Debt', value: 'addDebtsTransactions', route: '/debts/individual-transaction', icon: "/icons/logo-wallet-blue.svg"},
]

const DebtsPage = () => {
  const loggedInUserID = sessionStorage.getItem('loggedInUserID');
  return (
    <div>
      {/* <SavingsDebtAreaChart userID={loggedInUserID || ''}/> */}
      <DoughnutChartTextOverview doughnutChartData={doughnutChartData} doughnutChartPercentageData={doughnutChartPercentageData} doughnutChartDataType='percentage'/>
      <DoughnutChartTextOverview doughnutChartData={dummyData} doughnutChartDataType='income'/>
      <TransactionsDebtTable userID={loggedInUserID || ''}/>
      <TransactionsRepaymentTable userID={loggedInUserID || ''}/>
      <FloatingButton floatingButtonOptions={options}/>
    </div>
  )
}

export default DebtsPage
