import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Transaction from '@/models/transactionsModel';
import { connectToDatabase } from '@/lib/database';
import { signToken } from '../jwt';
import Debt from '@/models/debtsModel';
// import mongoose from 'mongoose';
require('dotenv').config();

export const deleteDebtTransaction = async ( 
    loanTransactionID: string, 
) => {
    console.log('Delete Transaction with ID:', { _id: loanTransactionID }); // Log the incoming data

    const connected = await connectToDatabase();

    // const transactionObjectID = new mongoose.Types.ObjectId(transactionID);

    if(!connected){
      console.log('Error: Database not connected');
      return { result: false, message: 'Database connection failed' };
    }

    console.log('Database is connected');
    try {
      const existingTransaction = await Debt.findOne({_id: loanTransactionID});
      if (!existingTransaction) {
        console.log('No record of this transaction is found');
        return { result: false, message: 'Transaction is not in Database' };
      }else{
        const deleteOldTransaction = await Debt.deleteOne({_id: loanTransactionID})

        if(!deleteOldTransaction){
            console.log('Failed to delete the transaction');
            return { result: false, message: 'Transaction has not been deleted' };
        }
        
        return { result: true, message: 'Transaction deleted', deletedDebtTransactionID: loanTransactionID};
      }
  } catch (error) {
    console.log("Delete Transaction unsuccessful");
    console.error('Delete Transaction error:', error);
    return { result: false, message: 'Edit Transaction failed' };
  }
};
