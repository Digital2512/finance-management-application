// api/login.ts
import { NextResponse, NextRequest } from 'next/server';
import { addTransaction } from '@/lib/transaction/addTransaction';
import authMiddleware from '@/middleware/authMiddleware';
import mongoose from 'mongoose';
import { addLoanTransaction } from '@/lib/transaction/addLoanTransaction';
import { addRepaymentTransaction } from '@/lib/transaction/addRepaymentTransaction';

export async function POST(request: NextRequest) {
  try {
    const { 
        userID,
        debtID,
        senderID,
        receiverID,
        dateOfRepayment,
        typeOfRepayment,
        repaymentCategory,
        repaymentStatus,
        repaymentCurrency,
        repaymentAmount,
        repaymentProofOfURL} = await request.json();  

    console.log(`Transaction Data: 
      userID:${userID}
      debtID: ${debtID}
      senderID: ${senderID}
      receiverID: ${receiverID}
      dateOfRepayment: ${dateOfRepayment}
      typeOfRepayment: ${typeOfRepayment}
      repaymentCategory: ${repaymentCategory}
      repaymentStatus: ${repaymentStatus}
      repaymentCurrency: ${repaymentCurrency}
      repaymentAmount: ${repaymentAmount}
      repaymentProofOfURL: ${repaymentProofOfURL}
      `);
    
    console.log('User ID Route: ', userID);
    const {result, token, message, addTransactionID} = await addRepaymentTransaction(
      userID,
      debtID,
      senderID,
      receiverID,
      dateOfRepayment,
      typeOfRepayment,
      repaymentCategory,
      repaymentStatus,
      repaymentCurrency,
      repaymentAmount,
      repaymentProofOfURL
    );

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
