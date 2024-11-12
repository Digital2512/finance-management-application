import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Transaction from '@/models/transactionsModel';
import { connectToDatabase } from '@/lib/database';
import { signToken } from '../jwt';
import mongoose from 'mongoose';
// import mongoose from 'mongoose';
require('dotenv').config();

export const fetchUserTransaction = async ( userID: string ) => {
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
      const userTransactionsData = await Transaction.find({userID: userIDObject});
      if (!userTransactionsData) {
        console.log('No record of User Transactions is found');
        return { result: false, message: 'User Transactions is not in Database' };
      }else{
        console.log('User Transactions: ', userTransactionsData);
        return { result: true, message: 'User Transactions fetched', userTransactionsData: userTransactionsData};
      }
  } catch (error) {
    console.log("Fetch User Transaction unsuccessful");
    console.error('Fetch User Transaction error:', error);
    return { result: false, message: 'Fetch User Transaction failed' };
  }
};
