import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Loan from '@/models/loansModel';
import { connectToDatabase } from '@/lib/database';
import { signToken } from '../jwt';
import mongoose from 'mongoose';
import { UserRoundMinus } from 'lucide-react';
import authMiddleware from '@/middleware/authMiddleware';
require('dotenv').config();

export const addLoanTransaction = async ( 
  userID:string,
  loanName:string,
  loanCategory:string,
  startingDateOfLoan:Date,
  loanDescription:string,
  loanCurrency:string,
  loanAmount:string,
  loanTermYear:string,
  loanTermMonth:string,
  interestRate:string,
  interestRateType:string,
  receiverID:string,
  senderID:string,
  loanStatus:string,
  loanProofOfURL:string,
) => {
    console.log('Adding Transaction:', { 
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
     }); // Log the incoming data
    console.log(`Function Transaction Data: UserID: 
      ${userID}
      ${loanName}
      ${loanCategory}
      ${startingDateOfLoan}
      ${loanDescription}
      ${loanCurrency}
      ${loanAmount}
      ${loanTermYear}
      ${loanTermMonth}
      ${interestRate}
      ${interestRateType}
      ${receiverID}
      ${senderID}
      ${loanStatus}
      ${loanProofOfURL}
      `);

    const connected = await connectToDatabase();

    if(!connected){
      console.log('Error: Database not connected');
      return { result: false, message: 'Database connection failed' };
    }

    console.log('Database is connected');
    try {
      const existingLoanTransaction = await Loan.findOne({ 
        userID,
        loanName, 
        loanCategory,
        loanDescription,
        interestRate,
        interestRateType, 
        receiverID,
        senderID,
        loanTermYear,
        loanTermMonth,
        startingDateOfLoan,
        loanAmount
       });
       console.log('Duplication Process Conducted');
      if (existingLoanTransaction) {
        console.log('Duplicate transaction found');
        return { result: false, message: 'Transaction is already in Database' };
      }

      if (!mongoose.Types.ObjectId.isValid(userID)) {
        console.log("Invalid userID format");
        return { result: false, message: 'Invalid userID format' };
      }

      // Create new user
        const userIDObject = new mongoose.Types.ObjectId(userID);
        console.log('User ID String: ', userID);
        console.log('User ID Object: ', userIDObject);
        const newLoanTransaction = new Loan({
          userID: userIDObject,
          loanName: loanName,
          loanCategory: loanCategory,
          startingDateOfLoan: startingDateOfLoan,
          loanDescription: loanDescription,
          loanAmount: loanAmount,
          loanCurrency: loanCurrency,
          loanTermYear: loanTermYear,
          loanTermMonth: loanTermMonth,
          loanStatus: loanStatus,
          interestRate: interestRate,
          interestRateType: interestRateType,
          receiverID: receiverID,
          senderID: senderID,
          loanProofOfURL: loanProofOfURL,
        });

        console.log('Database info Added');

        await newLoanTransaction.save();

      // console.log('CREATED USER -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------');
      
      const token = authMiddleware({ userID: newLoanTransaction._id, username: newLoanTransaction.loanName, expiresInAmount: '1h'}, 'sign');
      console.log('Addition Transaction Token: ' + token);

      if(token){
        console.log("Addition Transaction successful");
        return { result: true, token: token, message: 'Add Transaction Successful', addTransactionID: newLoanTransaction._id};
      }

      console.log("Addition Transaction unsuccessful");
        return { result: false, token: token, message: 'Add Transaction Unsuccessful' };

  } catch (error) {
    console.log("Addition Transaction unsuccessful");
    console.error('Addition Transaction error:', error);
    return { result: false, message: 'Addition Transaction failed' };
  }
};
