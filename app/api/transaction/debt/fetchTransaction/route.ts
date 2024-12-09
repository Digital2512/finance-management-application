import { connectToDatabase } from "@/lib/database";
import { NextResponse, NextRequest } from 'next/server';
import authMiddleware from '@/middleware/authMiddleware';
import { editTransaction } from '@/lib/transaction/editTransaction';
import { fetchTransaction } from "@/lib/transaction/fetchTransaction";
import { fetchDebtTransaction } from "@/lib/transaction/fetchDebtTransaction";


export async function GET(request: NextRequest) {
  console.log('Fetch Transaction Info Request JSON: ', request);
    try {
      const { searchParams } = new URL(request.url); // Extract query parameters
      const transactionID = searchParams.get('debtTransactionID'); // Get transactionID
      
      if (!transactionID) {
          return NextResponse.json({ message: 'Transaction ID is missing' }, { status: 400 });
      }
    
      console.log('Fetch Transaction Info ID: ', transactionID);
      const {result, message, existingTransactionData} = await fetchDebtTransaction(transactionID);
  
      console.log('Fetch Transaction Info: ', existingTransactionData);
  
      console.log('----------------------------------------------------------------------------------------------------------------------------------------------------');
  
      if(result){
        return NextResponse.json({ message: message, existingTransactionData: existingTransactionData }, { status: 200 });
      }else{
        return NextResponse.json({ message: message }, { status: 400 });
      }
    } catch (error) {
      //the reason for the alert not announcing when the registeration or login fails is because when an error happended is because we used a try-catch block which instantly stops the program when it catches an error
      console.error('Fetch Transaction request error:', error);
      return NextResponse.json({ message: 'Fetch Transaction request failed' }, { status: 500 });
    }
}