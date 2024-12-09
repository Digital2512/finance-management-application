'use client'

import TransactionsDebtTable from '@/components/ui/TransactionsDebtTable'
import React from 'react'

const DebtsPage = () => {
  const loggedInUserID = sessionStorage.getItem('loggedInUserID');
  return (
    <TransactionsDebtTable userID={loggedInUserID || ''}/>
  )
}

export default DebtsPage