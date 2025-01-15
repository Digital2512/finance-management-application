// api/login.ts
import { NextResponse, NextRequest } from 'next/server';
import { addTransaction } from '@/lib/transaction/addTransaction';
import authMiddleware from '@/middleware/authMiddleware';
import mongoose from 'mongoose';
import { addLoanTransaction } from '@/lib/transaction/addLoanTransaction';

export async function POST(request: NextRequest) {
  try {
    const { 
        userID,
        loanName,
        loanCategory,
        startingDateOfLoan,
        loanDescription,
        loanCurrency,
        loanAmount,
        loanTermYear,
        loanTermMonth,
        interestRate,
        interestRateType,
        receiverID,
        senderID,
        loanStatus,
        loanProofOfURL} = await request.json();  

    console.log(`Transaction Data: 
      userID:${userID}
      loanName:${loanName}
      loanCategory:${loanCategory}
      startingDateOfLoan:${startingDateOfLoan}
      loanDescription:${loanDescription}
      loanCurrency:${loanCurrency}
      amountOfLoan:${loanAmount}
      loanTermYear:${loanTermYear}
      loanTermMonth:${loanTermMonth}
      interestRate:${interestRate}
      interestRateType:${interestRateType}
      receiverID:${receiverID}
      senderID:${senderID}
      loanStatus:${loanStatus}
      loanProofOfURL:${loanProofOfURL}
      `);
    
    console.log('User ID Route: ', userID);
    const {result, token, message, addTransactionID} = await addLoanTransaction(
      userID,
      loanName,
      loanCategory,
      startingDateOfLoan,
      loanDescription,
      loanCurrency,
      loanAmount,
      loanTermYear,
      loanTermMonth,
      interestRate,
      interestRateType,
      receiverID,
      senderID,
      loanStatus,
      loanProofOfURL
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
