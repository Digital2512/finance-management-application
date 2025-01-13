
'use client'

import IndividualTransactionForm from '@/components/ui/IndividualTransactionForm'
import React from 'react'
import { useSearchParams } from 'next/navigation'
import IndividualDebtTransactionForm from '@/components/ui/IndividualDebtForm'

interface IndividualTransactionsDetailsProps{
  type: string,
}

const individualDebtTransactionsDetailsPage = ({type}: IndividualTransactionsDetailsProps) => {
  const searchParams = useSearchParams();
  const transactionID = searchParams.get('debtTransactionID');
  console.log('Transaction ID: ', transactionID || '');
  return (
    <>
    {transactionID 
      ? (<IndividualDebtTransactionForm type = 'edit' oldDebtTransactionID = {transactionID || undefined}/>) 
      : (<IndividualDebtTransactionForm type = 'add'/>)}
    </>

    // <IndividualTransactionForm type = 'add'/>
  )
}

export default individualDebtTransactionsDetailsPage