import { NextResponse, NextRequest } from 'next/server';
import { registerUser } from '@/lib/auth/register';
import authMiddleware from '@/middleware/authMiddleware';

export async function POST(request: NextRequest) {
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
  } catch (error) {
    console.error('Registeration request error:', error);

    //the reason for the alert not announcing when the registeration or login fails is because when an error happended is because we used a try-catch block which instantly stops the program when it catches an error
    return NextResponse.json({ message: 'Registeration request failed' }, { status: 500 });
  }
}
