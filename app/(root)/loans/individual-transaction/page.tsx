'use client'

import React from 'react'
import IndividualLoanTransactionForm from '@/components/ui/IndividualLoanForm'
import { useSearchParams } from 'next/navigation'

interface IndividualLoanTransactionDetailsProps {
  type: string
}

const individualLoanTransactionDetails = ({type} : IndividualLoanTransactionDetailsProps) => {
  const searchParams = useSearchParams();
  const loanTransactionID = searchParams.get('loanTransactionID');
  console.log()
  return (
    <>
    {loanTransactionID ? (
      <IndividualLoanTransactionForm type='edit' oldLoanTransactionID={loanTransactionID}/>
    ):(
    <IndividualLoanTransactionForm type='add'/>
    )
    }
    </>
  )
}

export default individualLoanTransactionDetails