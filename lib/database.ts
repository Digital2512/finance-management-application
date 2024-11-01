'use server'

import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error('MONGO_URI is not defined in the environment variables');
}

let isConnected = false; 

export const connectToDatabase = async () => {
  console.log('MONGO_URI:', MONGO_URI);
  if (isConnected) {
    console.log('Database already connected');
    return NextResponse.json({ message: 'Database already connected' }, { status: 200 });
  }

  try {
    const connected = await mongoose.connect(MONGO_URI);
    if(connected){
      console.log('Connected to MongoDB');
      isConnected = true;
      return NextResponse.json({ message: 'Connected to MongoDB' }, { status: 200 });
    }else{
      console.log('Not Connected to MongoDB');
      isConnected = true;
      return NextResponse.json({ message: 'Not Connected to MongoDB' }, { status: 500 });
    }
  } catch (error : unknown) {
    const errorMessage = (error instanceof Error) ? error.message : 'Failed to connect to MongoDB';
    console.error('MongoDB connection error:', error);
    return NextResponse.json({ message: 'Failed to connect to MongoDB', error: errorMessage }, { status: 500 });
  }
};
