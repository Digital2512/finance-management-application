import { connectToDatabase } from "@/lib/database";
import { NextResponse, NextRequest } from 'next/server';
import authMiddleware from '@/middleware/authMiddleware';
import { fetchUserTransaction } from "@/lib/transaction/fetchUserTransaction";


export async function GET(request: NextRequest) {
    try {
        // const {userID} = await request.json();  
        // console.log('Fetching User Transactions for: ', userID);
        const { searchParams } = new URL(request.url);
        const userID = searchParams.get("userID");
        
        console.log('Fetching User Transactions for:', userID);

        if(userID){
            const {result, message, userTransactionsData} = await fetchUserTransaction(userID);
            
            console.log('Transaction Info: ', userTransactionsData);
    
            console.log('----------------------------------------------------------------------------------------------------------------------------------------------------');

            if(result){
                return NextResponse.json({ message: message, userTransactionsData: userTransactionsData }, { status: 200 });
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