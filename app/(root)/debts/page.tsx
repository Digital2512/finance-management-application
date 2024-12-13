'use client'

import TransactionsDebtTable from '@/components/ui/TransactionsDebtTable'
import TransactionsRepaymentTable from '@/components/ui/TransactionsRepaymentTable';
import React from 'react'

const DebtsPage = () => {
  const loggedInUserID = sessionStorage.getItem('loggedInUserID');
  return (
    <div>
    <TransactionsDebtTable userID={loggedInUserID || ''}/>
    <TransactionsRepaymentTable userID={loggedInUserID || ''}/>
    </div>
  )
}

export default DebtsPage
