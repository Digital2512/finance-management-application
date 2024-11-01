'use server'

import { getUserInfo } from '@/lib/actions/user.actions';
import { connectToDatabase } from '@/lib/database';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const response = await getUserInfo('userT123.');
  if(response){
    return NextResponse.json({ message: 'Database connection successful' }, { status: 200 });
  }else{
    return NextResponse.json({ message: 'Database connection failed'}, { status: 500 });
  }
};
