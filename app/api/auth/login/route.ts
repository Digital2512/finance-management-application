// api/login.ts
import { NextResponse, NextRequest } from 'next/server';
import { loginUser } from '@/lib/auth/login';
import authMiddleware from '@/middleware/authMiddleware';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();  
    const {result, token, message, loggedInUserInfo} = await loginUser(username, password);

    console.log('Logged In User Info: ' + loggedInUserInfo);

    console.log('----------------------------------------------------------------------------------------------------------------------------------------------------');
    
    const verified = authMiddleware(token, 'verify');

    //it stops here
    console.log('Verified Result: ' + verified);
    console.log('Result: ' + result);

    if(result && verified){
      return NextResponse.json({ message: message, loggedInUserInfo: loggedInUserInfo }, { status: 200 });
    }else{
      return NextResponse.json({ message: message }, { status: 400 });
    }
  } catch (error) {
    //the reason for the alert not announcing when the registeration or login fails is because when an error happended is because we used a try-catch block which instantly stops the program when it catches an error
    console.error('Edit Transaction request error:', error);
    return NextResponse.json({ message: 'Edit Transaction request failed' }, { status: 500 });
  }
}
