import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Transaction from '@/models/transactionsModel';
import { connectToDatabase } from '@/lib/database';
import { signToken } from '../jwt';
import authMiddleware from '@/middleware/authMiddleware';
import mongoose from 'mongoose';
import Loan from '@/models/loansModel';
import { addLoanTransaction } from './addLoanTransaction';
import Savings from '@/models/savingsModel';
require('dotenv').config();

export const editSavingsTransaction = async ( 
    userID: string,
    oldSavingsTransactionID: string, 
    newSavingsName: string,
    newSavingsCategory: string,
    newDateOfSavings: Date,
    newSavingsDescription: string,
    newSavingsCurrency: string,
    newSavingsTotalAmount: string,
    newSavingsGoalTermYear: string,
    newSavingsGoalTermMonth: string,
    newSavingsGoalDepositAmount: string,
    newSavingsDepositAmountType: string,
    newReceiverID: string,
    newSenderID: string,
    newSavingsStatus: string,
    newSavingsProofOfURL: string,
) => {
    console.log('Edit Transaction:', { userID, oldSavingsTransactionID, newSavingsName, newSavingsCategory, newDateOfSavings }); // Log the incoming data

    const connected = await connectToDatabase();

    // const transactionObjectID = new mongoose.Types.ObjectId(transactionID);

    if(!connected){
      console.log('Error: Database not connected');
      return { result: false, message: 'Database connection failed' };
    }

    console.log('Database is connected');
    try {
      const existingTransaction = await Savings.findOne({_id: oldSavingsTransactionID});
      if (!existingTransaction) {
        console.log('No record of this transaction is found');
        return { result: false, message: 'Transaction is not in Database' };
      }else{
        const deleteOldTransaction = await Savings.deleteOne({_id: oldSavingsTransactionID})

        if(!deleteOldTransaction){
            console.log('Failed to delete the transaction');
            return { result: false, message: 'Transaction has not been deleted' };
        }
      }

      const addNewSavings = new Savings({
        userID: userID,
        savingsName: newSavingsName,
        savingsCategory: newSavingsCategory,
        dateOfSavings: newDateOfSavings,
        savingsDescription: newSavingsDescription,
        savingsCurrency: newSavingsCurrency,
        savingsTotalAmount: newSavingsTotalAmount,
        savingsGoalTermYear: newSavingsGoalTermYear,
        savingsGoalTermMonth: newSavingsGoalTermMonth,
        savingsGoalDepositAmount: newSavingsGoalDepositAmount,
        savingsDepositAmountType: newSavingsDepositAmountType,
        receiverID: newReceiverID,
        senderID: newSenderID,
        savingsStatus: newSavingsStatus,
        savingsProofOfURL: newSavingsProofOfURL
      });

      await addNewSavings.save();

      // console.log('CREATED USER -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------');

      const token = authMiddleware({ userID: addNewSavings._id, username: addNewSavings.savingsName, expiresInAmount: '1h'}, 'sign');
      console.log('Edit Transaction Token: ' + token);

      if(token){
        console.log("Edit Transaction successful");
        return { result: true, token: token, message: 'Edit Transaction Successful', deletedTransactionID: oldSavingsTransactionID, newTransactionID: addNewSavings._id};
      }

      console.log("Edit Transaction unsuccessful");
        return { result: true, token: token, message: 'Edit Transaction Unsuccessful' };

  } catch (error) {
    console.log("Edit Transaction unsuccessful");
    console.error('Edit Transaction error:', error);
    return { result: false, message: 'Edit Transaction failed' };
  }
};
