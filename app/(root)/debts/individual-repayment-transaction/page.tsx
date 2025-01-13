'use client'

import IndividualRepaymentHistoryForm from '@/components/ui/IndividualRepaymentForm'
import { useSearchParams } from 'next/navigation'
import React from 'react'

const individualRepaymentTransactionsDetailsPage = () => {
    const searchParams = useSearchParams();
    const repaymentID = searchParams.get('repaymentTransactionID');
    console.log('Repayment ID: ', repaymentID || '');
  return (
    <>
    {repaymentID
    ?(<IndividualRepaymentHistoryForm type='edit' oldRepaymentTransactionID={repaymentID || undefined}/>)
    :(<IndividualRepaymentHistoryForm type='add'/>)}
    </>
  )
}

export default individualRepaymentTransactionsDetailsPage