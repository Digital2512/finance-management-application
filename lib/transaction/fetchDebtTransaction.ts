import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Transaction from '@/models/transactionsModel';
import { connectToDatabase } from '@/lib/database';
import { signToken } from '../jwt';
import authMiddleware from '@/middleware/authMiddleware';
import Debt from '@/models/debtsModel';
require('dotenv').config();

export const fetchDebtTransaction = async ( transactionID: string) => {
    console.log('Fetching Transaction:', transactionID); // Log the incoming data

    const connected = await connectToDatabase();

    if(!connected){
      console.log('Error: Database not connected');
      return { result: false, message: 'Database connection failed' };
    }

    console.log('Database is connected');
    try {
      const existingTransaction = await Debt.findOne({ _id: transactionID});
      if (!existingTransaction) {
        console.log('No transaction found');
        return { result: false, message: 'Transaction is not in Database' };
      }

      // console.log('CREATED USER -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------');

      // const token = authMiddleware({ userID: existingTransaction._id, username: existingTransaction.name, expiresInAmount: '1h'}, 'sign');
      // console.log('Fetch Transaction Token: ' + token);

      // if(token){
      //   console.log("Fetch Transaction successful");
      //   return { result: true, token: token, message: 'Fetch Transaction Successful', existingTransactionData: existingTransaction};
      // }
        console.log("Fetch Transaction: ", existingTransaction);
        console.log("Fetch Transaction successful");
        return { result: true, message: 'Fetch Transaction Successful', existingTransactionData: existingTransaction};

  } catch (error) {
    console.log("Fetch Transaction unsuccessful");
    console.error('Fetch Transaction error:', error);
    return { result: false, message: 'Fetch Transaction failed' };
  }
};
