// api/login.ts
import { NextResponse, NextRequest } from 'next/server';
import authMiddleware from '@/middleware/authMiddleware';
import { deleteTransaction } from '@/lib/transaction/deleteTransaction';

export async function POST(request: NextRequest) {
  try {
    const { transactionID } = await request.json(); 
    console.log('Not Deleted Transaction: ' + transactionID); 
    const {result, message, deletedTransactionID} = await deleteTransaction(transactionID);

    console.log('Deleted Transaction: ' + deletedTransactionID);

    console.log('----------------------------------------------------------------------------------------------------------------------------------------------------');
    
    // const verified = authMiddleware(token, 'verify');

    //it stops here
    // console.log('Verified Result: ' + verified);
    // console.log('Result: ' + result);

    if(result){
      return NextResponse.json({ message: message, deleteTransactionID: deletedTransactionID }, { status: 200 });
    }else{
      return NextResponse.json({ message: message }, { status: 400 });
    }
  } catch (error) {
    //the reason for the alert not announcing when the registeration or login fails is because when an error happended is because we used a try-catch block which instantly stops the program when it catches an error
    console.error('Delete Transaction request error:', error);
    return NextResponse.json({ message: 'Delete Transaction request failed' }, { status: 500 });
  }
}
