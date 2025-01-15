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
require('dotenv').config();

export const editLoanTransaction = async ( 
    userID: string,
    oldLoanTransactionID: string, 
    newLoanName: string,
    newLoanCategory: string,
    newStartingDateOfLoan: Date,
    newLoanDescription: string,
    newLoanCurrency: string,
    newLoanAmount: string,
    newLoanTermYear: string,
    newLoanTermMonth: string,
    newInterestRate: string,
    newInterestRateType: string,
    newReceiverID: string,
    newSenderID: string,
    newLoanStatus: string,
    newLoanProofOfURL: string,
) => {
    console.log('Edit Transaction:', { userID, oldLoanTransactionID, newLoanName, newLoanCategory, newStartingDateOfLoan }); // Log the incoming data

    const connected = await connectToDatabase();

    // const transactionObjectID = new mongoose.Types.ObjectId(transactionID);

    if(!connected){
      console.log('Error: Database not connected');
      return { result: false, message: 'Database connection failed' };
    }

    console.log('Database is connected');
    try {
      const existingTransaction = await Loan.findOne({_id: oldLoanTransactionID});
      if (!existingTransaction) {
        console.log('No record of this transaction is found');
        return { result: false, message: 'Transaction is not in Database' };
      }else{
        const deleteOldTransaction = await Loan.deleteOne({_id: oldLoanTransactionID})

        if(!deleteOldTransaction){
            console.log('Failed to delete the transaction');
            return { result: false, message: 'Transaction has not been deleted' };
        }
      }

      const addNewLoan = new Loan({
        userID: userID,
        loanName: newLoanName,
        loanCategory: newLoanCategory,
        startingDateOfLoan: newStartingDateOfLoan,
        loanDescription: newLoanDescription,
        loanCurrency: newLoanCurrency,
        loanAmount: newLoanAmount,
        loanTermYear: newLoanTermYear,
        loanTermMonth: newLoanTermMonth,
        loanStatus: newLoanStatus,
        interestRate: newInterestRate,
        interestRateType: newInterestRateType,
        receiverID: newReceiverID,
        senderID: newSenderID,
        loanProofOfURL: newLoanProofOfURL,
      });

      await addNewLoan.save();

      // console.log('CREATED USER -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------');

      const token = authMiddleware({ userID: addNewLoan._id, username: addNewLoan.name, expiresInAmount: '1h'}, 'sign');
      console.log('Edit Transaction Token: ' + token);

      if(token){
        console.log("Edit Transaction successful");
        return { result: true, token: token, message: 'Edit Transaction Successful', deletedTransactionID: oldLoanTransactionID, newTransactionID: addNewLoan._id};
      }

      console.log("Edit Transaction unsuccessful");
        return { result: true, token: token, message: 'Edit Transaction Unsuccessful' };

  } catch (error) {
    console.log("Edit Transaction unsuccessful");
    console.error('Edit Transaction error:', error);
    return { result: false, message: 'Edit Transaction failed' };
  }
};
