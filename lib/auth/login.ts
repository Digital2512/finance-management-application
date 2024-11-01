import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '@/models/userModel';
import { connectToDatabase } from '@/lib/database';
import { signToken } from '../jwt';
import authMiddleware from '@/middleware/authMiddleware'
require('dotenv').config();

export const loginUser = async (username: string, password: string) => {
    console.log('Logging In user:', { username, password }); // Log the incoming data
    try {
      const connected = await connectToDatabase();

      if(!connected){
        console.log('Error: Database not connected');
        return { result: false, message: 'Database connection failed' };
      }
      
      console.log('Database is connected');

        const foundUser = await User.findOne({ username });
        if(!foundUser){
          console.log('User not found');
          return { result: false, message: 'User not found' };
        }

          const passwordMatch = await bcrypt.compare(password, foundUser.password);
          if (!passwordMatch) {
            console.log('Password is Invalid');
            return { result: false, message: 'Invalid password' };
          }
      
          const token = authMiddleware({ userID: foundUser._id, username: foundUser.username, expiresInAmount: '1h'}, 'sign');
          console.log('Login Token: ' + token)

          if(token){
            console.log("Login is successful");
            return {result: true, token: token, message: 'Login Successful', loggedInUserInfo: foundUser.username}
          }

          console.log("Login is unsuccessful");
            return {result: true, token: token, message: 'Login Unsuccessful', loggedInUserInfo: foundUser.username}

  }catch(error){
    console.error('Login error:', error);
    return { result: false, message: 'Login failed' };
  }
}
  
