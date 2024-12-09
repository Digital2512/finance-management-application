import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Transaction from '@/models/transactionsModel';
import { connectToDatabase } from '@/lib/database';
import { signToken } from '../jwt';
import authMiddleware from '@/middleware/authMiddleware';
import mongoose from 'mongoose';
import Debt from '@/models/debtsModel';
import { addLoanTransaction } from './addLoanTransaction';
require('dotenv').config();

export const editDebtTransaction = async ( 
    userID: string,
    oldDebtTransactionID: string, 
    newDebtName: string,
    newDebtCategory: string,
    newStartingDateOfDebt: Date,
    newDebtDescription: string,
    newDebtCurrency: string,
    newDebtAmount: string,
    // newDebtTermYear: string,
    // newDebtTermMonth: string,
    newInterestRate: string,
    newInterestRateType: string,
    newReceiverID: string,
    newSenderID: string,
    newDebtPayerGroup: string,
    newDebtPaymentPlan: string,
    newDebtRegularPaymentAmount: string,
    newDebtStatus: string,
    newDebtProofOfURL: string,
) => {
    console.log('Edit Transaction:', { userID, oldDebtTransactionID, newDebtName, newDebtCategory, newStartingDateOfDebt }); // Log the incoming data

    const connected = await connectToDatabase();

    // const transactionObjectID = new mongoose.Types.ObjectId(transactionID);

    if(!connected){
      console.log('Error: Database not connected');
      return { result: false, message: 'Database connection failed' };
    }

    console.log('Database is connected');
    try {
      const existingDebtTransaction = await Debt.findOne({_id: oldDebtTransactionID});
      if (!existingDebtTransaction) {
        console.log('No record of this transaction is found');
        return { result: false, message: 'Transaction is not in Database' };
      }else{
        const deleteOldTransaction = await Debt.deleteOne({_id: oldDebtTransactionID})

        if(!deleteOldTransaction){
            console.log('Failed to delete the transaction');
            return { result: false, message: 'Transaction has not been deleted' };
        }
      }

      const addNewDebt = new Debt({
        userID: userID,
        debtName: newDebtName,
        debtCategory: newDebtCategory,
        startingDateOfDebt: newStartingDateOfDebt,
        debtDescription: newDebtDescription,
        debtCurrency: newDebtCurrency,
        debtAmount: newDebtAmount,
        // debtTermYear: newDebtTermYear,
        // debtTermMonth: newDebtTermMonth,
        interestRate: newInterestRate,
        interestRateType: newInterestRateType,
        receiverID: newReceiverID,
        senderID: newSenderID,
        debtPayerGroup: newDebtPayerGroup,
        debtPaymentPlan: newDebtPaymentPlan,
        debtRegularPaymentAmount: newDebtRegularPaymentAmount,
        debtStatus: newDebtStatus,
        debtProofOfURL: newDebtProofOfURL,
      });

      await addNewDebt.save();

      // console.log('CREATED USER -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------');

      const token = authMiddleware({ userID: addNewDebt._id, username: addNewDebt.debtName, expiresInAmount: '1h'}, 'sign');
      console.log('Edit Transaction Token: ' + token);

      if(token){
        console.log("Edit Transaction successful");
        return { result: true, token: token, message: 'Edit Transaction Successful', deletedTransactionID: oldDebtTransactionID, newTransactionID: addNewDebt._id};
      }

      console.log("Edit Transaction unsuccessful");
        return { result: true, token: token, message: 'Edit Transaction Unsuccessful' };

  } catch (error) {
    console.log("Edit Transaction unsuccessful");
    console.error('Edit Transaction error:', error);
    return { result: false, message: 'Edit Transaction failed' };
  }
};
