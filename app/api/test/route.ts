'use server'

import { connectToDatabase } from '@/app/lib/database';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error('MONGO_URI is not defined in the environment variables');
}

export async function POST(request: Request) {
  const response = await connectToDatabase()
  if(response){
    return NextResponse.json({ message: 'Database connection successful' }, { status: 200 });
  }else{
    return NextResponse.json({ message: 'Database connection failed'}, { status: 500 });
  }
};
