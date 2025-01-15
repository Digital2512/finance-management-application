import { connectToDatabase } from "@/lib/database";
import { NextResponse, NextRequest } from 'next/server';
import authMiddleware from '@/middleware/authMiddleware';
import { fetchUserIncomeExpenseTransaction } from "@/lib/transaction/fetchUserIncomeExpenseTransaction";
import { fetchUserLoanTransaction } from "@/lib/transaction/fetchUserLoanTransactions";
import { fetchUserRepaymentTransaction } from "@/lib/transaction/fetchUserRepaymentTransactions";


export async function GET(request: NextRequest) {
    try {
        // const {userID} = await request.json();  
        // console.log('Fetching User Transactions for: ', userID);
        const { searchParams } = new URL(request.url);
        const userID = searchParams.get("userID");
        
        console.log('Fetching User Transactions for:', userID);

        if(userID){
            const {result, message, userRepaymentTransactionsData} = await fetchUserRepaymentTransaction(userID);
            
            console.log('Transaction Info: ', userRepaymentTransactionsData);
    
            console.log('----------------------------------------------------------------------------------------------------------------------------------------------------');

            if(result){
                return NextResponse.json({ message: message, userRepaymentTransactionsData: userRepaymentTransactionsData }, { status: 200 });
              }else{
                return NextResponse.json({ message: message }, { status: 400 });
              }
        }else{
            console.log('No User ID found')
            return NextResponse.json({ message: 'Fetch Transaction request failed' }, { status: 500 });
        }
    
      } catch (error) {
        //the reason for the alert not announcing when the registeration or login fails is because when an error happended is because we used a try-catch block which instantly stops the program when it catches an error
        console.error('Fetch User Transaction request error:', error);
        return NextResponse.json({ message: 'Fetch Transaction request failed' }, { status: 500 });
      }
}