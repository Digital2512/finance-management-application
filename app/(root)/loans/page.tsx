'use client'

import IndividualLoanTransactionForm from '@/components/ui/IndividualLoanForm'
import TransactionsLoanTable from '@/components/ui/TransactionsLoanTable'
import React from 'react'

const Loans = () => {
  const loggedInUserID = sessionStorage.getItem('loggedInUserID');
  return (
    <TransactionsLoanTable userID={loggedInUserID || ''}></TransactionsLoanTable>
  )
}

export default Loans