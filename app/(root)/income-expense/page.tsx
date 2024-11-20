"use client"

import TransactionsTable from '@/components/ui/TransactionsTable'
import React, {useState, useEffect} from 'react'
import axios from 'axios';

const incomeExpensePage = () => {
  // const [userTransactionsData, setUserTransactionsData] = useState<Transaction[]>([]);
  // // const [isLoading, setIsLoading] = useState(false);
  
  // useEffect(() => {
  //     const fetchUserTransactions = async (loggedInUserID: string) => {
  //         // setIsLoading(true);
  //         console.log('Logged In User ID Use Effect', loggedInUserID);
  //         if (loggedInUserID) {
  //             try {
  //                 const response = await axios.get('/api/transaction/fetchUserTransaction', {
  //                     params: { userID: loggedInUserID }
  //                 });
  
  //                 console.log('User Transactions Response Function:', response);
  //                 console.log('User Transactions Data Function:', response.data.userTransactionsData); 
  //                 setUserTransactionsData(response.data.userTransactionsData); 
  //                 // return {userTransactionsData: response.data.userTransactionData};
  //             } catch (error) {
  //                 console.error("Error fetching user transactions:", error);
  //             }finally{
  //                 // setIsLoading(false);
  //             }
  //         } else {
  //             console.log("Error: No logged-in user ID found in session storage.");
  //             // setIsLoading(false);
  //         }
  //     };
  
      
  //     if (loggedInUserID) {
  //         console.log('User ID Table:', loggedInUserID);
  //         fetchUserTransactions(loggedInUserID);

  //         // console.log('Fetched User Transactions Table: ', fetchedUserTransactionData)
  //         // setUserTransactionsData(fetchedUserTransactionData);
          
  //         // console.log('User Transactions Table: ', userTransactionsData)
  //         // if(userTransactionsData){
  //         //     console.log('Suceeded User Transactions Table: ', userTransactionsData)
  //         // }else{
  //         //     console.log('No Transaction Data')
  //         // }
  //     } else {
  //         console.log('No Logged In User ID');
  //         // setIsLoading(false);
  //     }
  // }, []); // Ensure only runs once


  // // console.log('User Transactions Data:', userTransactionsData);
  
  // // const transactionsData: Transaction[] = userTransactionsData;

  const loggedInUserID = sessionStorage.getItem('loggedInUserID');

  return (
    <TransactionsTable userID = {loggedInUserID || ''}></TransactionsTable>
  )
}

export default incomeExpensePage