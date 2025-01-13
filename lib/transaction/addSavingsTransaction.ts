import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Loan from '@/models/loansModel';
import Savings from '@/models/savingsModel'
import { connectToDatabase } from '@/lib/database';
import { signToken } from '../jwt';
import mongoose from 'mongoose';
import { UserRoundMinus } from 'lucide-react';
import authMiddleware from '@/middleware/authMiddleware';
require('dotenv').config();

export const addSavingsTransaction = async ( 
  userID: string,
  savingsName: string,
  savingsCategory: string,
  dateOfSavings: Date,
  savingsDescription: string,
  savingsCurrency: string,
  savingsTotalAmount: string,
  savingsGoalTermYear: string,
  savingsGoalTermMonth: string,
  savingsGoalDepositAmount: string,
  savingsDepositAmountType: string,
  receiverID: string,
  senderID: string,
  savingsStatus: string,
  savingsProofOfURL: string,
) => {
    console.log('Adding Transaction:', { 
      userID,
      savingsName,
      savingsCategory,
      dateOfSavings,
      savingsDescription,
      savingsCurrency,
      savingsTotalAmount,
      savingsGoalTermYear,
      savingsGoalTermMonth,
      savingsGoalDepositAmount,
      savingsDepositAmountType,
      receiverID,
      senderID,
      savingsStatus,
      savingsProofOfURL,
     }); // Log the incoming data
    console.log(`Function Transaction Data: UserID: 
      ${userID}
      ${savingsName}
      ${savingsCategory}
      ${dateOfSavings}
      ${savingsDescription}
      ${savingsCurrency}
      ${savingsTotalAmount}
      ${savingsGoalTermYear}
      ${savingsGoalTermMonth}
      ${savingsGoalDepositAmount}
      ${savingsDepositAmountType}
      ${receiverID}
      ${senderID}
      ${savingsStatus}
      ${savingsProofOfURL}
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
        savingsName, 
        savingsCategory,
        savingsDescription,
        savingsTotalAmount,
        savingsGoalTermYear,
        savingsGoalTermMonth,
        savingsGoalDepositAmount,
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
        const newSavingsTransaction = new Savings({
          userID: userIDObject,
          savingsName: savingsName,
          savingsCategory: savingsCategory,
          dateOfSavings: dateOfSavings,
          savingsDescription: savingsDescription,
          savingsCurrency: savingsCurrency,
          savingsTotalAmount: savingsTotalAmount,
          savingsGoalTermYear: savingsGoalTermYear,
          savingsGoalTermMonth: savingsGoalTermMonth,
          savingsGoalDepositAmount: savingsGoalDepositAmount,
          savingsDepositAmountType: savingsDepositAmountType,
          receiverID: receiverID,
          senderID: senderID,
          savingsStatus: savingsStatus,
          savingsProofOfURL: savingsProofOfURL
        });

        console.log('Database info Added');

        await newSavingsTransaction.save();

      // console.log('CREATED USER -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------');
      
      const token = authMiddleware({ userID: newSavingsTransaction._id, username: newSavingsTransaction.savingsName, expiresInAmount: '1h'}, 'sign');
      console.log('Addition Transaction Token: ' + token);

      if(token){
        console.log("Addition Transaction successful");
        return { result: true, token: token, message: 'Add Transaction Successful', addTransactionID: newSavingsTransaction._id};
      }

      console.log("Addition Transaction unsuccessful");
        return { result: false, token: token, message: 'Add Transaction Unsuccessful' };

  } catch (error) {
    console.log("Addition Transaction unsuccessful");
    console.error('Addition Transaction error:', error);
    return { result: false, message: 'Addition Transaction failed' };
  }
};
