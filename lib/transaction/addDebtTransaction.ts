import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/database';
import { signToken } from '../jwt';
import mongoose from 'mongoose';
import { UserRoundMinus } from 'lucide-react';
import authMiddleware from '@/middleware/authMiddleware';
import Debt from '@/models/debtsModel';
require('dotenv').config();

export const addDebtTransaction = async ( 
    userID: string,
    debtName: string,
    debtCategory: string,
    startingDateOfDebt: Date,
    debtDescription: string,
    debtCurrency: string,
    debtAmount: string,
    // debtTermYear: string,
    // debtTermMonth: string,
    interestRate: string,
    interestRateType: string,
    receiverID: string,
    senderID: string,
    debtPayerGroup: string,
    debtPaymentPlan: string,
    debtRegularPaymentAmount: string,
    debtStatus: string,
    debtProofOfURL: string,
) => {
    console.log('Adding Transaction:', { 
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
     }); // Log the incoming data
    console.log(`Function Transaction Data: UserID: 
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

    const connected = await connectToDatabase();

    if(!connected){
      console.log('Error: Database not connected');
      return { result: false, message: 'Database connection failed' };
    }

    console.log('Database is connected');
    try {
      const existingDebtTransaction = await Debt.findOne({ 
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
       });
       console.log('Duplication Process Conducted');
      if (existingDebtTransaction) {
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
        const newDebtTransaction = new Debt({
            userID: userID,
            debtName: debtName,
            debtCategory: debtCategory,
            startingDateOfDebt: startingDateOfDebt,
            debtDescription: debtDescription,
            debtCurrency: debtCurrency,
            debtAmount: debtAmount,
            // debtTermYear: debtTermYear,
            // debtTermMonth: debtTermMonth,
            interestRate: interestRate,
            interestRateType: interestRateType,
            receiverID: receiverID,
            senderID: senderID,
            debtPayerGroup: debtPayerGroup,
            debtPaymentPlan: debtPaymentPlan,
            debtRegularPaymentAmount: debtRegularPaymentAmount,
            debtStatus: debtStatus,
            debtProofOfURL: debtProofOfURL,
        });

        console.log('Database info Added');

        await newDebtTransaction.save();

      // console.log('CREATED USER -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------');
      
      const token = authMiddleware({ userID: newDebtTransaction._id, username: newDebtTransaction.debtName, expiresInAmount: '1h'}, 'sign');
      console.log('Addition Transaction Token: ' + token);
      console.log('Addition Transaction Data: ' + newDebtTransaction);

      if(token){
        console.log("Addition Transaction successful");
        return { result: true, token: token, message: 'Add Transaction Successful', addTransactionID: newDebtTransaction._id};
      }

      console.log("Addition Transaction unsuccessful");
        return { result: false, token: token, message: 'Add Transaction Unsuccessful' };

  } catch (error) {
    console.log("Addition Transaction unsuccessful");
    console.error('Addition Transaction error:', error);
    return { result: false, message: 'Addition Transaction failed' };
  }
};
