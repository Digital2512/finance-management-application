'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import DoughnutChartOverview from '@/components/ui/DoughnutChartOverview';
import FloatingButton from '@/components/ui/FloatingButton';
import TransactionsSavingsTable from '@/components/ui/TransactionsSavingsTable'
import React from 'react'
import { formatAmount } from "@/lib/utils"

const SavingsPage = () => {
    const loggedInUserID = sessionStorage.getItem('loggedInUserID');

    

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
      {label: 'Add Repayment', value: 'addRepaymentTransactions', route: '/debts', icon: "/icons/logo-wallet-blue.svg"},
      {label: 'Add Debt', value: 'addDebtsTransactions', route: '/debts', icon: "/icons/logo-wallet-blue.svg"},
      {label: 'Add Income and Expense Transactions', value: 'addIncomeExpenseTransactions', route: '/income-expense', icon: "/icons/logo-wallet-blue.svg"},
      {label: 'Add Savings', value: 'addSavingsTransactions', route: '/savings/individual-transaction', icon: "/icons/logo-wallet-blue.svg"},
    ]

    const totalIncome = filteredData.reduce((sum, item) => sum + item.income, 0);
    const totalExpense = filteredData.reduce((sum, item) => sum + item.expense, 0);
    const remainingTotal = totalIncome-totalExpense;
  return (
    <div>
        <Card className='w-[975px] m-6'>
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1 text-center sm:text-left">
            <CardTitle className='mb-4'>Savings Progress</CardTitle>
            <CardDescription>
              Showing savings progress for the last 3 months
            </CardDescription>
          </div>

          </CardHeader>
          <CardContent className='max-h-[200px]'>
            <div className='flex flex-col'>
              <div className='ml-4 mt-6 mb-6 max-h-[150px]'>
                <DoughnutChartOverview doughnutChartData={doughnutChartData} doughnutChartPercentageData={doughnutChartPercentageData} doughnutChartDataType='percentage'/>
              </div>

              <div className="items-center justify-center gap-4">
                <div className="mb-1 text-lg font-bold">Total</div>
                <div className="mb-2">Total Income: {formatAmount(totalIncome)}</div>
                <div className="mb-2">Total Expense: {formatAmount(totalExpense)}</div>
              
                <div>
                  Remaining Total: {" "}
                  <span className={`font-bold ${remainingTotal>= 0 ? "text-green-600": "text-red-600"}`}>
                    {formatAmount(remainingTotal)}
                  </span>
                </div>
                </div>
            </div>
          </CardContent>
        </Card>
        <TransactionsSavingsTable userID={loggedInUserID || ''}/>
        <FloatingButton floatingButtonOptions={options}/>
    </div>
  )
}

export default SavingsPage