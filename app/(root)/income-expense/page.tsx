"use client"

import TransactionsTable from '@/components/ui/TransactionsIncomeExpenseTable'
import React, {useState, useEffect} from 'react'
import axios from 'axios';
import DoughnutChartOverviewTextComponent from "@/components/ui/DoughnutChartOverviewText";
import IncomeExpenseAreaChart from '@/components/ui/IncomeExpenseAreaChart';
import FloatingButton from '@/components/ui/FloatingButton';

const IncomeExpensePage = () => {

  const loggedInUserID = sessionStorage.getItem('loggedInUserID');

  //find new icons
  const options = [
    { label: 'Add Transactions', value: 'addTransactions', route: '/income-expense/individual-transaction-details', icon: "/icons/logo-wallet-blue.svg"},
    { label: 'Add Loans', value: 'addLoans', route: '/loans', icon: "/icons/logo-wallet-blue.svg"},
    { label: 'Add Debts', value: 'addDebts', route: '/debts', icon: "/icons/logo-wallet-blue.svg"},
  ];

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