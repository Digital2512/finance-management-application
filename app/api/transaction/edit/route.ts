// api/login.ts
import { NextResponse, NextRequest } from 'next/server';
import { addTransaction } from '@/lib/transaction/addTransaction';
import authMiddleware from '@/middleware/authMiddleware';
import { editTransaction } from '@/lib/transaction/editTransaction';

export async function POST(request: NextRequest) {
  try {
    const { 
        userID,
        oldTransactionID,
        newTransactionName,
        newTransactionCategory,
        newDateOfTransaction,
        newTransactionDescription,
        newReceiverID,
        newSenderID,
        newTransactionCurrency,
        newTransactionIndividualDetails,
        newTransactionType,
        newTransactionStatus,
        newTransactionCycleType,
        newTransactionPlannedCycle,
        newTransactionPlannedCycleDate,
        newTransactionProofURL,
        newTotalAmountOfTransaction } = await request.json(); 
        console.log('Edit Transaction API Data being received: ',
          userID,
          oldTransactionID,
          newTransactionName,
          newTransactionCategory,
          newDateOfTransaction,
          newTransactionDescription,
          newReceiverID,
          newSenderID,
          newTransactionCurrency,
          newTransactionIndividualDetails,
          newTransactionType,
          newTransactionStatus,
          newTransactionCycleType,
          newTransactionPlannedCycle,
          newTransactionPlannedCycleDate,
          newTransactionProofURL,
          newTotalAmountOfTransaction
        );
    const {result, token, message, deletedTransactionID, newTransactionID} = await editTransaction(userID,
        oldTransactionID,
        newTransactionName,
        newTransactionCategory,
        newDateOfTransaction,
        newTransactionDescription,
        newReceiverID,
        newSenderID,
        newTransactionCurrency,
        newTransactionIndividualDetails,
        newTransactionType,
        newTransactionStatus,
        newTransactionCycleType,
        newTransactionPlannedCycle,
        newTransactionPlannedCycleDate,
        newTransactionProofURL,
        newTotalAmountOfTransaction);

    console.log('Old Transaction Info: ' + oldTransactionID);
    console.log('Deleted Transaction Info: ' + deletedTransactionID);
    console.log('New Transaction Info: ' + newTransactionID);

    console.log('----------------------------------------------------------------------------------------------------------------------------------------------------');
    
    const verified = authMiddleware(token, 'verify');

    //it stops here
    console.log('Verified Result: ' + verified);
    console.log('Result: ' + result);

    if(result && verified){
      return NextResponse.json({ message: message, editTransactionID: newTransactionID }, { status: 200 });
    }else{
      return NextResponse.json({ message: message }, { status: 400 });
    }
  } catch (error) {
    //the reason for the alert not announcing when the registeration or login fails is because when an error happended is because we used a try-catch block which instantly stops the program when it catches an error
    console.error('Edit Transaction request error:', error);
    return NextResponse.json({ message: 'Edit Transaction request failed' }, { status: 500 });
  }
}
