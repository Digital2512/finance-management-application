// api/login.ts
import { NextResponse, NextRequest } from 'next/server';
import { loginUser } from '@/app/lib/auth/login';
import authMiddleware from '@/app/middleware/authMiddleware';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    const {result, token, message} = await loginUser(username, password);

    console.log('----------------------------------------------------------------------------------------------------------------------------------------------------');
    
    const verified = authMiddleware(token, 'verify');

    //it stops here
    console.log('Verified Result: ' + verified);
    console.log('Result: ' + result);

    if(result && verified){
      return NextResponse.json({ message: message }, { status: 200 });
    }else{
      return NextResponse.json({ message: message }, { status: 400 });
    }
  } catch (error) {
    console.error('Login request error:', error);
    return NextResponse.json({ message: 'Login request failed' }, { status: 500 });
  }
}
