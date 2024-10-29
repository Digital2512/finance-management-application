// api/login.ts
import { NextResponse, NextRequest } from 'next/server';
import { loginUser } from '@/app/lib/auth/login';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    const response = await loginUser(username, password);

    if(!response){
      return NextResponse.json({ message: 'Invalid Credentials' }, { status: 400 });
    }

    return NextResponse.json({ message: 'Success' }, { status: 200 });
  } catch (error) {
    console.error('Login request error:', error);
    return NextResponse.json({ message: 'Login request failed' }, { status: 500 });
  }
}
