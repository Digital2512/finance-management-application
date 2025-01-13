
'use client'

import IndividualTransactionForm from '@/components/ui/IndividualTransactionForm'
import React from 'react'
import { useSearchParams } from 'next/navigation'

interface IndividualTransactionsDetailsProps{
  type: string,
}

const individualTransactionsDetailsPage = ({type}: IndividualTransactionsDetailsProps) => {
  const searchParams = useSearchParams();
  const transactionID = searchParams.get('transactionID');
  console.log('Transaction ID: ', transactionID || '');
  return (
    <>
    {transactionID 
      ? (<IndividualTransactionForm type = 'edit' oldTransactionID = {transactionID || undefined}/>) 
      : (<IndividualTransactionForm type = 'add'/>)}
    </>

    // <IndividualTransactionForm type = 'add'/>
  )
}

export default individualTransactionsDetailsPage