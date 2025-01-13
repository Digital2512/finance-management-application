"use client"

import TransactionsTable from '@/components/ui/TransactionsIncomeExpenseTable'
import React, {useState, useEffect} from 'react'
import axios from 'axios';
import DoughnutChartOverviewTextComponent from "@/components/ui/DoughnutChartTextOverview";
import IncomeExpenseAreaChart from '@/components/ui/IncomeExpenseAreaChart';
import FloatingButton from '@/components/ui/FloatingButton';

const IncomeExpensePage = () => {

  const loggedInUserID = sessionStorage.getItem('loggedInUserID');

  //find new icons
  const options = [
    {label: 'Add Repayment', value: 'addRepaymentTransactions', route: '/debts', icon: "/icons/logo-wallet-blue.svg"},
    {label: 'Add Debt', value: 'addDebtsTransactions', route: '/debts', icon: "/icons/logo-wallet-blue.svg"},
    {label: 'Add Savings', value: 'addSavingsTransactions', route: '/savings', icon: "/icons/logo-wallet-blue.svg"},
    {label: 'Add Income and Expense Transactions', value: 'addIncomeExpenseTransactions', route: '/income-expense/individual-transaction', icon: "/icons/logo-wallet-blue.svg"},
  ]

  return (
    <div className='ml-6'>
      <IncomeExpenseAreaChart userID={loggedInUserID || ""}/>
      {/* <hr className='divider-invisible' />
      <hr className='divider-invisible' /> */}
      <TransactionsTable userID={loggedInUserID || ""} />
      <FloatingButton floatingButtonOptions={options}/>
    </div>
  )
}

export default IncomeExpensePage