import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Transaction from '@/models/transactionsModel';
import Loans from '@/models/loansModel';
import { connectToDatabase } from '@/lib/database';
import { signToken } from '../jwt';
import mongoose from 'mongoose';
// import mongoose from 'mongoose';
require('dotenv').config();

export const fetchUserLoanTransaction = async ( userID: string ) => {
    console.log('Fetching User Transactions with User ID:', { userID }); // Log the incoming data

    const connected = await connectToDatabase();

    // const transactionObjectID = new mongoose.Types.ObjectId(transactionID);

    if(!connected){
      console.log('Error: Database not connected');
      return { result: false, message: 'Database connection failed' };
    }

    console.log('Database is connected');
    try {
        const userIDObject = new mongoose.Types.ObjectId(userID)
        const userLoanTransactionsData = await Loans.find({userID: userIDObject});
      if (!userLoanTransactionsData) {
        console.log('No record of User Loan Transactions is found');
        return { result: false, message: 'User Loan Transactions is not in Database' };
      }else{
        console.log('User Loan Transactions: ', userLoanTransactionsData);
        return { result: true, message: 'User Loan Transactions fetched', userLoanTransactionsData: userLoanTransactionsData};
      }
  } catch (error) {
    console.log("Fetch User Loan Transaction unsuccessful");
    console.error('Fetch User Loan Transaction error:', error);
    return { result: false, message: 'Fetch User Loan Transaction failed' };
  }
};