import { NextResponse } from 'next/server';
import { loginUser } from '@/app/api/auth/login/route';
import { registerUser } from '@/app/api/auth/register/route';
import path from 'path';

export async function POST(request: Request) {
  const { pathname } = new URL(request.url);
  console.log('Pathname: ' + pathname);
  const body = await request.json();
  
  if (pathname === '/api/auth/login') {
    const {username, password} = body;
    const loggedIn = await loginUser(username, password);
    if(loggedIn){
      console.log('Login Successful');
    }else{
      console.log('Login unsuccessful');
    }
  } else if (pathname === '/api/auth/register') {
    const { username, password, email, firstName, lastName, 
      addressLine1, addressLine2, addressLine3, city, state, postalCode,
      dateOfBirth, country, plan } = body;
    const registered = await registerUser(username, password, email, firstName, lastName, 
      addressLine1, addressLine2, addressLine3, city, state, postalCode,
      dateOfBirth, country, plan);
      if(registered){
        console.log('Registeration successful');
      }else{
        console.log('Registeration unsuccessful');
      }
  }

  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}
