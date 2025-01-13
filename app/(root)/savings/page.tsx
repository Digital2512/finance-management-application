'use client'

import FloatingButton from '@/components/ui/FloatingButton';
import TransactionsSavingsTable from '@/components/ui/TransactionsSavingsTable'
import React from 'react'

const SavingsPage = () => {
    const loggedInUserID = sessionStorage.getItem('loggedInUserID');
    const options = [
      {label: 'Add Repayment', value: 'addRepaymentTransactions', route: '/debts', icon: "/icons/logo-wallet-blue.svg"},
      {label: 'Add Debt', value: 'addDebtsTransactions', route: '/debts', icon: "/icons/logo-wallet-blue.svg"},
      {label: 'Add Income and Expense Transactions', value: 'addIncomeExpenseTransactions', route: '/income-expense', icon: "/icons/logo-wallet-blue.svg"},
      {label: 'Add Savings', value: 'addSavingsTransactions', route: '/savings/individual-transaction', icon: "/icons/logo-wallet-blue.svg"},
    ]
  return (
    <div>
        <TransactionsSavingsTable userID={loggedInUserID || ''}/>
        <FloatingButton floatingButtonOptions={options}/>
    </div>
  )
}

export default SavingsPage