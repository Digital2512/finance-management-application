'use client'

import IndividualLoanTransactionForm from '@/components/ui/IndividualLoanForm'
import TransactionsLoanTable from '@/components/ui/TransactionsLoanTable'
import FloatingButton from '@/components/ui/FloatingButton'
import React from 'react'

const LoansPage = () => {
  const loggedInUserID = sessionStorage.getItem('loggedInUserID');
  return (
    <div>
      <TransactionsLoanTable userID={loggedInUserID || ''}></TransactionsLoanTable>
    </div>
  )
}

export default LoansPage