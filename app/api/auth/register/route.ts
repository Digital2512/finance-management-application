import { NextResponse, NextRequest } from 'next/server';
import { registerUser } from '@/app/lib/auth/register';
import authMiddleware from '@/app/middleware/authMiddleware';

export async function POST(request: Request) {
  try {
    const {
      username,
      password,
      email,
      firstName,
      lastName,
      addressLine1,
      addressLine2,
      addressLine3,
      city,
      state,
      postalCode,
      dateOfBirth,
      country,
      selectedPlan,
    } = await request.json();

    const {result, token, message} = await registerUser(
      username,
      password,
      email,
      firstName,
      lastName,
      addressLine1,
      addressLine2,
      addressLine3,
      city,
      state,
      postalCode,
      new Date(dateOfBirth),
      country,
      selectedPlan
    );

    const verified = authMiddleware(token, 'verify');

    console.log('Verified Result: ' + verified);
    console.log('Result: ' + result);

    if(result && verified){
      return NextResponse.json({ message: message }, { status: 200 });
    }else{
      return NextResponse.json({ message: message }, { status: 400 });
    }

    // console.log(response);

    // if(!response){
    //   return NextResponse.json({ message: 'Invalid Credentials' }, { status: 400 });
    // }

    // return NextResponse.json({ message: 'Success' }, { status: 200 });
  } catch (error) {
    console.error('Registeration request error:', error);
    return NextResponse.json({ message: 'Registeration request failed' }, { status: 500 });
  }
}
