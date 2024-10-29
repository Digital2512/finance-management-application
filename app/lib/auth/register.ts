import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '@/app/models/userModel';
import { connectToDatabase } from '@/app/lib/database';
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
    // console.log('Registeration')
    console.log('Registering user:', { username, email, firstName, lastName }); // Log the incoming data

    const connected = await connectToDatabase();

    if(!connected){
      console.log('Error: Database not connected');
      return { statusCode: 500, message: 'Database connection failed' };
    }

    // console.log('-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------');
    console.log('Database is connected');
    try {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return { statusCode: 400, message: 'User already exists' };
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Convert dateOfBirth string to Date object
      // const dateOfBirthString = new Date(dateOfBirth);
      console.log('-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------');
      // console.log('Date of Birth: ' + dateOfBirthString);

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

      const token = jwt.sign(
        { id: newUser._id, email: newUser.email, username: newUser.username },
        process.env.JWT_SECRET!,
        { expiresIn: '1h' } // Token expires in 1 hour
      );

      console.log("Registration is successful");
      return true
      // return { statusCode: 200, message: 'User registered successfully' };
      // return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
  } catch (error) {
    console.log("Registeration is unsuccessful");
    console.error('Registeration error:', error);
    return false
    // return { statusCode: 500, message: 'Failed to register user' };
    // return NextResponse.json({ message: 'Failed to register user' }, { status: 500 });
  }
};
