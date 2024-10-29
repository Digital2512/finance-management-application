// api/register.ts
import { NextResponse, NextRequest } from 'next/server';
import { registerUser } from '@/app/lib/auth/register';

export async function POST(request: Request) {
  console.log('TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT');
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

    const response = await registerUser(
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

    // const requestData = await request.json();
    // console.log('Incoming registration data:', requestData); // Log the incoming data

    // return NextResponse.json({ message: response.message }, { status: response.statusCode });
    if(response){
      return NextResponse.json({ message: 'Success' }, { status: 200 });
    }    
  } catch (error) {
    console.error('Registration request error:', error);
    return NextResponse.json({ message: 'Registration request failed' }, { status: 500 });
  }
}
