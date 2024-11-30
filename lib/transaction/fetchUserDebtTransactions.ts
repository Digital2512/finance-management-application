import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Debt from '@/models/debtsModel';
import { connectToDatabase } from '@/lib/database';
import { signToken } from '../jwt';
import mongoose from 'mongoose';
// import mongoose from 'mongoose';
require('dotenv').config();

export const fetchUserIncomeExpenseTransaction = async ( userID: string ) => {
    console.log('Fetching User Debt Transactions with User ID:', { userID }); // Log the incoming data

    const connected = await connectToDatabase();

    // const transactionObjectID = new mongoose.Types.ObjectId(transactionID);

    if(!connected){
      console.log('Error: Database not connected');
      return { result: false, message: 'Database connection failed' };
    }

    console.log('Database is connected');
    try {
        const userIDObject = new mongoose.Types.ObjectId(userID)
        const userTransactionsData = await Debt.find({userID: userIDObject});
      if (!userTransactionsData) {
        console.log('No record of User Debt Transactions is found');
        return { result: false, message: 'User Debt Transactions is not in Database' };
      }else{
        console.log('User Debt Transactions: ', userTransactionsData);
        return { result: true, message: 'User Debt Transactions fetched', userTransactionsData: userTransactionsData};
      }
  } catch (error) {
    console.log("Fetch User Transaction unsuccessful");
    console.error('Fetch User Transaction error:', error);
    return { result: false, message: 'Fetch User Transaction failed' };
  }
};
