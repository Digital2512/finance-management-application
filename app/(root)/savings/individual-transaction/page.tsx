'use client'

import React from 'react'
import IndividualSavingsTransactionForm from '@/components/ui/IndividualSavingsForm'
import { useSearchParams } from 'next/navigation'

interface IndividualSavingsTransactionDetailsProps {
  type: string
}

const individualSavingsTransactionDetails = ({type}: IndividualSavingsTransactionDetailsProps) => {
    const searchParams = useSearchParams();
    const savingsTransactionID = searchParams.get('savingsTransactionID');    
    return (
      <div>
      <>
      {savingsTransactionID ? (
        <IndividualSavingsTransactionForm type='edit' oldSavingsTransactionID={savingsTransactionID}/>
      ):(
      <IndividualSavingsTransactionForm type='add'/>
      )
      }
      </>
      
      </div>
    )
}

export default individualSavingsTransactionDetails