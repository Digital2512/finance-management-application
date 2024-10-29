import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '@/app/models/userModel';
import { connectToDatabase } from '@/app/lib/database';
import { signToken } from '../jwt';
import authMiddleware from '@/app/middleware/authMiddleware'
require('dotenv').config();

export const registerUser = async ( 
  username: string, 
  password: string,
  email: string,
  firstName: string,
  lastName: string,
  addressLine1: string,
  addressLine2: string,
  addressLine3: string,
  city: string,
  state: string,
  postalCode: string,
  dateOfBirth: Date, 
  country: string,
  selectedPlan: string,
) => {
    console.log('Registering user:', { username, email, firstName, lastName }); // Log the incoming data

    const connected = await connectToDatabase();

    if(!connected){
      console.log('Error: Database not connected');
      return { result: false, message: 'Database connection failed' };
    }

    console.log('Database is connected');
    try {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return { result: false, message: 'User is already in Database' };
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const newUser = new User({
        username: username,
        password: hashedPassword,
        email: email,
        firstName: firstName,
        lastName: lastName,
        addressLine1: addressLine1,
        addressLine2: addressLine2,
        addressLine3: addressLine3,
        city: city,
        state: state,
        postalCode: postalCode,
        dateOfBirth: new Date(dateOfBirth), // Store as Date object
        country: country,
        selectedPlan: selectedPlan,
      });

      await newUser.save();

      // console.log('CREATED USER -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------');

      const token = authMiddleware({ userID: newUser._id, username: newUser.username, expiresInAmount: '1h'}, 'sign');
      console.log('Register Token: ' + token);

      console.log("Registration is successful");
      return { result: true, token: token, message: 'Registeration Successful' };
  } catch (error) {
    console.log("Registeration is unsuccessful");
    console.error('Registeration error:', error);
    return { result: false, message: 'Registeration failed' };
  }
};
