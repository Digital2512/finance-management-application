import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Loan from '@/models/loansModel';
import { connectToDatabase } from '@/lib/database';
import { signToken } from '../jwt';
import mongoose from 'mongoose';
import { UserRoundMinus } from 'lucide-react';
import authMiddleware from '@/middleware/authMiddleware';
import Repayment from '@/models/repaymentHistoryModel'
require('dotenv').config();

export const addRepaymentTransaction = async ( 
  userID:string,
  debtID: string,
  senderID: string,
  receiverID: string,
  dateOfRepayment: Date,
  typeOfRepayment: string,
  repaymentStatus: string,
  repaymentCurrency: string,
  repaymentAmount: string,
  repaymentProofOfURL: string,
) => {
    console.log('Adding Transaction:', { 
      userID,
      debtID,
      senderID,
      receiverID,
      dateOfRepayment,
      typeOfRepayment,
      repaymentStatus,
      repaymentCurrency,
      repaymentAmount,
      repaymentProofOfURL
     }); // Log the incoming data
    console.log(`Function Transaction Data: UserID: 
      ${userID}
      ${debtID}
      ${senderID}
      ${receiverID}
      ${dateOfRepayment}
      ${typeOfRepayment}
      ${repaymentStatus}
      ${repaymentCurrency}
      ${repaymentAmount}
      ${repaymentProofOfURL}
      `);

    const connected = await connectToDatabase();

    if(!connected){
      console.log('Error: Database not connected');
      return { result: false, message: 'Database connection failed' };
    }

    console.log('Database is connected');
    try {
      const existingLoanTransaction = await Repayment.findOne({ 
        userID,
        debtID, 
        senderID,
        receiverID,
        dateOfRepayment
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
        const newLoanTransaction = new Repayment({
          userID: userIDObject,
          debtID: debtID,
          senderID: senderID,
          receiverID: receiverID,
          dateOfRepayment: dateOfRepayment,
          typeOfRepayment: typeOfRepayment,
          repaymentStatus: repaymentStatus,
          repaymentCurrency: repaymentCurrency,
          repaymentAmount: repaymentAmount,
          repaymentProofOfURL:repaymentProofOfURL
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
