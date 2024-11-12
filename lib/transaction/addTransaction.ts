import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Transaction from '@/models/transactionsModel';
import { connectToDatabase } from '@/lib/database';
import { signToken } from '../jwt';
import mongoose from 'mongoose';
import { UserRoundMinus } from 'lucide-react';
import authMiddleware from '@/middleware/authMiddleware';
require('dotenv').config();

interface TransactionIndividualDetail {
  nameOfTransactionIndividual: string,
  descriptionOfTransactionIndividual: string,
  typeOfTransactionIndividual: string,
  amountOfTransactionIndividual: number,
  individualTransactionCurrency: string
  }

export const addTransaction = async ( 
    userID: string,
    transactionName: string,
    transactionCategory: string,
    dateOfTransaction: Date,
    transactionDescription: string,
    receiverID: string,
    senderID: string,
    transactionCurrency: string,
    transactionIndividualDetails: TransactionIndividualDetail[],
    transactionType: string,
    transactionPlannedCycle: string,
    transactionPlannedCycleDate: Date,
    transactionProofURL: string,
    totalAmountOfTransaction: string
) => {
    console.log('Adding Transaction:', { userID, transactionName, transactionCategory, dateOfTransaction, transactionIndividualDetails }); // Log the incoming data
    console.log(`Function Transaction Data: UserID: ${userID}, Transaction Name: ${transactionName}, Transaction Category: ${transactionCategory}, 
      Date of Transaction: ${dateOfTransaction}, Transaction Description: ${transactionDescription}, Receiver ID: ${receiverID}, Sender ID: ${senderID}, 
      Transaction Currency: ${transactionCurrency}, Transaction Type: ${transactionType}, Transaction Planned Cycle: ${transactionPlannedCycle},
      Transaction Planned Cycle Date: ${transactionPlannedCycleDate}, Transaction Proof Of URL: ${transactionProofURL}, Total Amount: ${totalAmountOfTransaction}`);

    const connected = await connectToDatabase();

    if(!connected){
      console.log('Error: Database not connected');
      return { result: false, message: 'Database connection failed' };
    }

    console.log('Database is connected');
    try {
      const existingTransaction = await Transaction.findOne({ 
        userID,
        transactionName, 
        transactionCategory,
        transactionDescription,
        dateOfTransaction, 
        receiverID,
        senderID,
        totalAmountOfTransaction,
       });
       console.log('Duplication Process Conducted');
      if (existingTransaction) {
        console.log('Duplicate transaction found');
        return { result: false, message: 'Transaction is already in Database' };
      }

      if (!transactionIndividualDetails || !transactionIndividualDetails.length) {
        console.log("Error: Missing individual transaction details");
        return { result: false, message: 'Missing transaction details' };
      }      

      if (!mongoose.Types.ObjectId.isValid(userID)) {
        console.log("Invalid userID format");
        return { result: false, message: 'Invalid userID format' };
      }

      // Create new user
        const userIDObject = new mongoose.Types.ObjectId(userID);
        console.log('User ID String: ', userID);
        console.log('User ID Object: ', userIDObject);
        const newTransaction = new Transaction({
          userID: userIDObject,
          transactionName: transactionName,
          transactionCategory: transactionCategory,
          dateOfTransaction: dateOfTransaction,
          transactionDescription: transactionDescription,
          receiverID: receiverID,
          senderID: senderID,
          transactionCurrency: transactionCurrency,
          transactionIndividualDetails: transactionIndividualDetails,
          transactionType: transactionType,
          transactionPlannedCycle: transactionPlannedCycle,
          transactionPlannedCycleDate: transactionPlannedCycleDate,
          transactionProofURL: transactionProofURL,
          totalAmountOfTransaction: totalAmountOfTransaction
        });

        console.log('Database info Added');

        await newTransaction.save();

      // console.log('CREATED USER -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------');
      
      const token = authMiddleware({ userID: newTransaction._id, username: newTransaction.name, expiresInAmount: '1h'}, 'sign');
      console.log('Addition Transaction Token: ' + token);

      if(token){
        console.log("Addition Transaction successful");
        return { result: true, token: token, message: 'Add Transaction Successful', addTransactionID: newTransaction._id};
      }

      console.log("Addition Transaction unsuccessful");
        return { result: false, token: token, message: 'Add Transaction Unsuccessful' };

  } catch (error) {
    console.log("Addition Transaction unsuccessful");
    console.error('Addition Transaction error:', error);
    return { result: false, message: 'Addition Transaction failed' };
  }
};
