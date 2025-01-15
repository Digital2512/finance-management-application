import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Transaction from '@/models/transactionsModel';
import { connectToDatabase } from '@/lib/database';
import { signToken } from '../jwt';
import mongoose from 'mongoose';
import Repayment from '@/models/repaymentHistoryModel';
// import mongoose from 'mongoose';
require('dotenv').config();

export const fetchUserRepaymentTransaction = async ( userID: string ) => {
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
        const userRepaymentTransactionsData = await Repayment.find({userID: userIDObject});
      if (!userRepaymentTransactionsData) {
        console.log('No record of User Repayment Transactions is found');
        return { result: false, message: 'User Repayment Transactions is not in Database' };
      }else{
        console.log('User Repayment Transactions: ', userRepaymentTransactionsData);
        return { result: true, message: 'User Repayment Transactions fetched', userRepaymentTransactionsData: userRepaymentTransactionsData};
      }
  } catch (error) {
    console.log("Fetch User Repayment Transaction unsuccessful");
    console.error('Fetch User Repayment Transaction error:', error);
    return { result: false, message: 'Fetch User Repayment Transaction failed' };
  }
};