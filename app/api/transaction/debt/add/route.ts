// api/login.ts
import { NextResponse, NextRequest } from 'next/server';
import { addTransaction } from '@/lib/transaction/addTransaction';
import authMiddleware from '@/middleware/authMiddleware';
import mongoose from 'mongoose';
import { addDebtTransaction } from '@/lib/transaction/addDebtTransaction';

export async function POST(request: NextRequest) {
  try {
    const { 
      userID,
      debtName,
      debtCategory,
      startingDateOfDebt,
      debtDescription,
      debtCurrency,
      debtAmount,
      // debtTermYear,
      // debtTermMonth,
      interestRate,
      interestRateType,
      receiverID,
      senderID,
      debtPayerGroup,
      debtPaymentPlan,
      debtRegularPaymentAmount,
      debtStatus,
      debtProofOfURL
     } = await request.json();  

    console.log(`Transaction Data: 
      ${userID}
      ${debtName}
      ${debtCategory}
      ${startingDateOfDebt}
      ${debtDescription}
      ${debtCurrency}
      ${debtAmount}
      ${interestRate}
      ${interestRateType}
      ${receiverID}
      ${senderID}
      ${debtPayerGroup}
      ${debtPaymentPlan}
      ${debtRegularPaymentAmount}
      ${debtStatus}
      ${debtProofOfURL}
      `);
    
    console.log('User ID Route: ', userID);
    const {result, token, message, addTransactionID} = await addDebtTransaction(
      userID,
      debtName,
      debtCategory,
      startingDateOfDebt,
      debtDescription,
      debtCurrency,
      debtAmount,
      // debtTermYear,
      // debtTermMonth,
      interestRate,
      interestRateType,
      receiverID,
      senderID,
      debtPayerGroup,
      debtPaymentPlan,
      debtRegularPaymentAmount,
      debtStatus,
      debtProofOfURL);

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
