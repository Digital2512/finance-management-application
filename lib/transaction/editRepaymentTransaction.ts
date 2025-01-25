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
import Repayment from '@/models/repaymentHistoryModel'
require('dotenv').config();

export const editRepaymentTransaction = async ( 
    userID: string,
    oldRepaymentTransactionID: string, 
    newTransactionID: string,
    newSenderID: string,
    newReceiverID: string,
    newDateOfRepayment: Date,
    newTypeOfRepayment: string,
    newTransactionType: string,
    newRepaymentStatus: string,
    newRepaymentCurrency: string,
    newRepaymentAmount: string,
    newRepaymentProofOfURL: string,
) => {
    console.log('Edit Transaction:', { userID, oldRepaymentTransactionID, newTransactionID, newReceiverID, newSenderID, newDateOfRepayment }); // Log the incoming data

    const connected = await connectToDatabase();

    // const transactionObjectID = new mongoose.Types.ObjectId(transactionID);

    if(!connected){
      console.log('Error: Database not connected');
      return { result: false, message: 'Database connection failed' };
    }

    console.log('Database is connected');
    try {
      const existingTransaction = await Repayment.findOne({_id: oldRepaymentTransactionID});
      if (!existingTransaction) {
        console.log('No record of this transaction is found');
        return { result: false, message: 'Transaction is not in Database' };
      }else{
        const deleteOldTransaction = await Repayment.deleteOne({_id: oldRepaymentTransactionID})

        if(!deleteOldTransaction){
            console.log('Failed to delete the transaction');
            return { result: false, message: 'Transaction has not been deleted' };
        }
      }

      const editNewRepayment = new Repayment({
        userID: userID,
        transactionID: newTransactionID,
        senderID: newSenderID,
        receiverID: newReceiverID,
        dateOfRepayment: newDateOfRepayment,
        typeOfRepayment: newTypeOfRepayment,
        transactionType: newTransactionType,
        repaymentStatus: newRepaymentStatus,
        repaymentCurrency: newRepaymentCurrency,
        repaymentAmount: newRepaymentAmount,
        repaymentProofOfURL:newRepaymentProofOfURL
      });

      await editNewRepayment.save();

      // console.log('CREATED USER -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------');

      const token = authMiddleware({ userID: editNewRepayment._id, debtID: editNewRepayment.debtID, expiresInAmount: '1h'}, 'sign');
      console.log('Edit Transaction Token: ' + token);

      if(token){
        console.log("Edit Transaction successful");
        return { result: true, token: token, message: 'Edit Transaction Successful', deletedTransactionID: oldRepaymentTransactionID, newRepaymentTransactionID: editNewRepayment._id};
      }

      console.log("Edit Transaction unsuccessful");
        return { result: true, token: token, message: 'Edit Transaction Unsuccessful' };

  } catch (error) {
    console.log("Edit Transaction unsuccessful");
    console.error('Edit Transaction error:', error);
    return { result: false, message: 'Edit Transaction failed' };
  }
};
