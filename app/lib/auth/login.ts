import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '@/app/models/userModel';
import { connectToDatabase } from '@/app/lib/database';
require('dotenv').config();

export const loginUser = async (username: string, password: string) => {
    console.log('Logging In user:', { username, password }); // Log the incoming data
    try {
      const connected = await connectToDatabase();

      if(!connected){
        console.log('Error: Database not connected');
        return { statusCode: 500, message: 'Database connection failed' };
      }
      
      console.log('Database is connected');
      try{
        const foundUser = await User.findOne({ username });
        if(!foundUser){
          console.log('-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------');
          console.log('User not found');
          return false
        }
          console.log('-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------');

          const passwordMatch = await bcrypt.compare(password, foundUser.password);
          if (!passwordMatch) {
            console.log('Password is Invalid');
            return false
          }
      
          const token = jwt.sign(
            { userId: foundUser._id, username: foundUser.username },
            process.env.JWT_SECRET!,
            { expiresIn: '1h' }
          );
      
          console.log("Login is successful");
          return true
    } catch (error) {
      console.error('Login error:', error);
      return false
    }
  }catch(error){
    console.error('Login error:', error);
    return false
  }
}
  
