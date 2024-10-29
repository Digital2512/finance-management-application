import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI; // Retrieve the MongoDB URI from environment variables

export async function GET() {
  // Check if MONGO_URI is defined
  if (!MONGO_URI) {
    return NextResponse.json(
      { message: 'MONGO_URI is not defined' }, 
      { status: 500 }
    );
  }

  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    return NextResponse.json({ message: 'Database connection successful' }, { status: 200 });
  } catch (error) {
    // Use a type guard to check if error is an instance of Error
    if (error instanceof Error) {
      console.error('Database connection error:', error.message); // Access the error message
      return NextResponse.json({ message: 'Database connection failed', error: error.message }, { status: 500 });
    } else {
      console.error('Unknown error:', error); // Handle unexpected error types
      return NextResponse.json({ message: 'Database connection failed', error: 'Unknown error' }, { status: 500 });
    }
  } finally {
    await mongoose.disconnect();
  }
}
