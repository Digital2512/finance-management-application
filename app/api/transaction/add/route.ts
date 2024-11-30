// api/login.ts
import { NextResponse, NextRequest } from 'next/server';
import { addTransaction } from '@/lib/transaction/addTransaction';
import authMiddleware from '@/middleware/authMiddleware';
import mongoose from 'mongoose';

export async function POST(request: NextRequest) {
  try {
    const { 
        userID,
        transactionName,
        transactionCategory,
        dateOfTransaction,
        transactionDescription,
        receiverID,
        senderID,
        transactionCurrency,
        transactionIndividualDetails,
        transactionType,
        transactionStatus,
        transactionCycleType,
        transactionPlannedCycle,
        transactionPlannedCycleDate,
        transactionProofURL,
        totalAmountOfTransaction } = await request.json();  

    console.log(`Transaction Data: UserID: ${userID}, Transaction Name: ${transactionName}, Transaction Category: ${transactionCategory}, 
      Date of Transaction: ${dateOfTransaction}, Transaction Description: ${transactionDescription}, Receiver ID: ${receiverID}, Sender ID: ${senderID}, 
      Transaction Currency: ${transactionCurrency}, Transaction Type: ${transactionType}, Transaction Planned Cycle: ${transactionPlannedCycle},
      Transaction Planned Cycle Date: ${transactionPlannedCycleDate}, Transaction Proof Of URL: ${transactionProofURL}, Total Amount: ${totalAmountOfTransaction}`);
    
    console.log('User ID Route: ', userID);
    const {result, token, message, addTransactionID} = await addTransaction(
        userID,
        transactionName,
        transactionCategory,
        dateOfTransaction,
        transactionDescription,
        receiverID,
        senderID,
        transactionCurrency,
        transactionIndividualDetails,
        transactionType,
        transactionStatus,
        transactionCycleType,
        transactionPlannedCycle,
        transactionPlannedCycleDate,
        transactionProofURL,
        totalAmountOfTransaction);

    console.log('New Transaction Info: ' + addTransactionID);

    console.log('----------------------------------------------------------------------------------------------------------------------------------------------------');

    if (!token) {
      console.error('Token is undefined');
      return NextResponse.json({ message: 'Token is missing' }, { status: 400 });
    }
    
    const verified = authMiddleware(token, 'verify');

    //it stops here
    console.log('Verified Result: ' + verified);
    console.log('Result: ' + result);

    if(result && verified){
      return NextResponse.json({ message: message, addTransactionID: addTransactionID }, { status: 200 });
    }else{
      return NextResponse.json({ message: message }, { status: 400 });
    }
  } catch (error) {
    //the reason for the alert not announcing when the registeration or login fails is because when an error happended is because we used a try-catch block which instantly stops the program when it catches an error
    console.error('Add Transaction request error:', error);
    return NextResponse.json({ message: 'Add Transaction request failed' }, { status: 500 });
  }
}
