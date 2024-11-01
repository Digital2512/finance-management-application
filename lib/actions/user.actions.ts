'use server'

import { NextResponse } from 'next/server';
// import { connectToDatabase } from '../database';
import User from '@/models/userModel'
import { connectToDatabase } from '../database';
import mongoose from 'mongoose';

interface UserInfo {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  addressLine1?: string;
  addressLine2?: string;
  addressLine3?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  dateOfBirth?: string;
  country?: string;
  selectedPlan?: string;
}

export const getUserInfo = async (username:string) => {  
  try{
    const connected = await connectToDatabase();

    if(!connected){
      console.log('Database is not connected');
    }

    console.log('User ID: ' + username);

    const userInfo = await User.findOne({username}).lean() as UserInfo || null;

    if(!userInfo){
      console.log('No user info found');
      return null;
    }

    console.log('User Info: ' + userInfo);

    const plainUserInfo: UserInfo = {
      _id: userInfo._id.toString(),
      username: userInfo.username,
      email: userInfo.email,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      addressLine1: userInfo.addressLine1,
      addressLine2: userInfo.addressLine2,
      addressLine3: userInfo.addressLine3,
      city: userInfo.city,
      state: userInfo.state,
      postalCode: userInfo.postalCode,
      dateOfBirth: userInfo.dateOfBirth,
      country: userInfo.country,
      selectedPlan: userInfo.selectedPlan,
    };

    return plainUserInfo;
  }catch(error){
    console.log('Error fetching user info: ', error);
    return null
  }
}