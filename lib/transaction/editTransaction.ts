import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Transaction from '@/models/transactionsModel';
import { connectToDatabase } from '@/lib/database';
import { signToken } from '../jwt';
import authMiddleware from '@/middleware/authMiddleware';
import mongoose from 'mongoose';
require('dotenv').config();

interface TransactionIndividualDetail {
  nameOfTransactionIndividual: string,
  descriptionOfTransactionIndividual: string,
  // typeOfTransactionIndividual: string,
  amountOfTransactionIndividual: number,
  // individualTransactionCurrency: string
  }

export const editTransaction = async ( 
    userID: string,
    oldTransactionID: string, 
    newTransactionName: string,
    newTransactionCategory: string,
    newDateOfTransaction: Date,
    newTransactionDescription: string,
    newReceiverID: string,
    newSenderID: string,
    newTransactionCurrency: string,
    newTransactionIndividualDetails: TransactionIndividualDetail[],
    newTransactionType: string,
    newTransactionStatus: string,
    newTransactionCycleType: string,
    newTransactionPlannedCycle: string,
    newTransactionPlannedCycleDate: Date,
    newTransactionProofURL: string,
    newTotalAmountOfTransaction: string
) => {
    console.log('Edit Transaction:', { userID, oldTransactionID, newTransactionName, newTransactionCategory, newDateOfTransaction, newTransactionIndividualDetails }); // Log the incoming data

    const connected = await connectToDatabase();

    // const transactionObjectID = new mongoose.Types.ObjectId(transactionID);

    if(!connected){
      console.log('Error: Database not connected');
      return { result: false, message: 'Database connection failed' };
    }

    console.log('Database is connected');
    try {
      const existingTransaction = await Transaction.findOne({_id: oldTransactionID});
      if (!existingTransaction) {
        console.log('No record of this transaction is found');
        return { result: false, message: 'Transaction is not in Database' };
      }else{
        const deleteOldTransaction = await Transaction.deleteOne({_id: oldTransactionID})

        if(!deleteOldTransaction){
            console.log('Failed to delete the transaction');
            return { result: false, message: 'Transaction has not been deleted' };
        }
      }

      const addNewTransaction = new Transaction({
        userID: userID,
        transactionName: newTransactionName,
        transactionCategory: newTransactionCategory,
        dateOfTransaction: newDateOfTransaction,
        transactionDescription: newTransactionDescription,
        receiverID: newReceiverID,
        senderID: newSenderID,
        transactionCurrency: newTransactionCurrency,
        transactionIndividualDetails: newTransactionIndividualDetails,
        transactionType: newTransactionType,
        transactionStatus: newTransactionStatus,
        transactionCycleType: newTransactionCycleType,
        transactionPlannedCycle: newTransactionPlannedCycle,
        transactionPlannedCycleDate: newTransactionPlannedCycleDate,
        transactionProofURL: newTransactionProofURL,
        totalAmountOfTransaction: newTotalAmountOfTransaction
      });

      await addNewTransaction.save();

      // console.log('CREATED USER -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------');

      const token = authMiddleware({ userID: addNewTransaction._id, username: addNewTransaction.name, expiresInAmount: '1h'}, 'sign');
      console.log('Edit Transaction Token: ' + token);

      if(token){
        console.log("Edit Transaction successful");
        return { result: true, token: token, message: 'Edit Transaction Successful', deletedTransactionID: oldTransactionID, newTransactionID: addNewTransaction._id};
      }

      console.log("Edit Transaction unsuccessful");
        return { result: true, token: token, message: 'Edit Transaction Unsuccessful' };

  } catch (error) {
    console.log("Edit Transaction unsuccessful");
    console.error('Edit Transaction error:', error);
    return { result: false, message: 'Edit Transaction failed' };
  }
};
