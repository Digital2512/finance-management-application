"use client"

import TransactionsTable from '@/components/ui/TransactionsTable'
import React, {useState, useEffect} from 'react'
import axios from 'axios';
import DoughnutChartOverviewTextComponent from "@/components/ui/DoughnutChartOverviewText";
import IncomeExpenseAreaChart from '@/components/ui/IncomeExpenseAreaChart';
import FloatingButton from '@/components/ui/FloatingButton';

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

  const fakeChartData: ChartDataItem[] = [
    { date: "2024-09-01", name: "Transaction", type: "income", amount: 500 },
    { date: "2024-09-01", name: "Transaction", type: "expense", amount: 300 },
    { date: "2024-09-02", name: "Transaction", type: "income", amount: 450 },
    { date: "2024-09-02", name: "Transaction", type: "expense", amount: 320 },
    { date: "2024-09-03", name: "Transaction", type: "income", amount: 600 },
    { date: "2024-09-03", name: "Transaction", type: "expense", amount: 400 },
    { date: "2024-09-04", name: "Transaction", type: "income", amount: 700 },
    { date: "2024-09-04", name: "Transaction", type: "expense", amount: 450 },
    { date: "2024-09-05", name: "Transaction", type: "income", amount: 480 },
    { date: "2024-09-05", name: "Transaction", type: "expense", amount: 300 },
    { date: "2024-09-06", name: "Transaction", type: "income", amount: 520 },
    { date: "2024-09-06", name: "Transaction", type: "expense", amount: 290 },
    { date: "2024-09-07", name: "Transaction", type: "income", amount: 530 },
    { date: "2024-09-07", name: "Transaction", type: "expense", amount: 400 },
    { date: "2024-09-08", name: "Transaction", type: "income", amount: 620 },
    { date: "2024-09-08", name: "Transaction", type: "expense", amount: 380 },
    { date: "2024-09-09", name: "Transaction", type: "income", amount: 500 },
    { date: "2024-09-09", name: "Transaction", type: "expense", amount: 350 },
    { date: "2024-09-10", name: "Transaction", type: "income", amount: 470 },
    { date: "2024-09-10", name: "Transaction", type: "expense", amount: 300 },
    { date: "2024-09-11", name: "Transaction", type: "income", amount: 540 },
    { date: "2024-09-11", name: "Transaction", type: "expense", amount: 310 },
    { date: "2024-09-12", name: "Transaction", type: "income", amount: 560 },
    { date: "2024-09-12", name: "Transaction", type: "expense", amount: 340 },
    { date: "2024-09-13", name: "Transaction", type: "income", amount: 590 },
    { date: "2024-09-13", name: "Transaction", type: "expense", amount: 420 },
    { date: "2024-09-14", name: "Transaction", type: "income", amount: 650 },
    { date: "2024-09-14", name: "Transaction", type: "expense", amount: 450 },
    { date: "2024-09-15", name: "Transaction", type: "income", amount: 480 },
    { date: "2024-09-15", name: "Transaction", type: "expense", amount: 320 },
    { date: "2024-09-16", name: "Transaction", type: "income", amount: 700 },
    { date: "2024-09-16", name: "Transaction", type: "expense", amount: 450 },
    { date: "2024-09-17", name: "Transaction", type: "income", amount: 480 },
    { date: "2024-09-17", name: "Transaction", type: "expense", amount: 300 },
    { date: "2024-09-18", name: "Transaction", type: "income", amount: 520 },
    { date: "2024-09-18", name: "Transaction", type: "expense", amount: 290 },
    { date: "2024-09-19", name: "Transaction", type: "income", amount: 530 },
    { date: "2024-09-19", name: "Transaction", type: "expense", amount: 400 },
    { date: "2024-09-20", name: "Transaction", type: "income", amount: 620 },
    { date: "2024-09-20", name: "Transaction", type: "expense", amount: 380 },
    { date: "2024-09-21", name: "Transaction", type: "income", amount: 500 },
    { date: "2024-09-21", name: "Transaction", type: "expense", amount: 350 },
    { date: "2024-09-22", name: "Transaction", type: "income", amount: 470 },
    { date: "2024-09-22", name: "Transaction", type: "expense", amount: 300 },
    { date: "2024-09-23", name: "Transaction", type: "income", amount: 540 },
    { date: "2024-09-23", name: "Transaction", type: "expense", amount: 310 },
    { date: "2024-09-24", name: "Transaction", type: "income", amount: 560 },
    { date: "2024-09-24", name: "Transaction", type: "expense", amount: 340 },
    { date: "2024-09-25", name: "Transaction", type: "income", amount: 590 },
    { date: "2024-09-25", name: "Transaction", type: "expense", amount: 420 },
    { date: "2024-09-26", name: "Transaction", type: "income", amount: 650 },
    { date: "2024-09-26", name: "Transaction", type: "expense", amount: 450 },
    { date: "2024-09-27", name: "Transaction", type: "income", amount: 480 },
    { date: "2024-09-27", name: "Transaction", type: "expense", amount: 320 },
    { date: "2024-09-28", name: "Transaction", type: "income", amount: 650 },
    { date: "2024-09-28", name: "Transaction", type: "expense", amount: 450 },
    { date: "2024-09-29", name: "Transaction", type: "income", amount: 480 },
    { date: "2024-09-29", name: "Transaction", type: "expense", amount: 320 },
    { date: "2024-09-30", name: "Transaction", type: "income", amount: 560 },
    { date: "2024-09-30", name: "Transaction", type: "expense", amount: 390 },
    { date: "2024-09-01", name: "Transaction", type: "income", amount: 500 },
    { date: "2024-09-01", name: "Transaction", type: "expense", amount: 300 },
    { date: "2024-10-02", name: "Transaction", type: "income", amount: 450 },
    { date: "2024-10-02", name: "Transaction", type: "expense", amount: 320 },
    { date: "2024-10-03", name: "Transaction", type: "income", amount: 600 },
    { date: "2024-10-03", name: "Transaction", type: "expense", amount: 400 },
    { date: "2024-10-04", name: "Transaction", type: "income", amount: 700 },
    { date: "2024-10-04", name: "Transaction", type: "expense", amount: 450 },
    { date: "2024-10-05", name: "Transaction", type: "income", amount: 480 },
    { date: "2024-10-05", name: "Transaction", type: "expense", amount: 300 },
    { date: "2024-10-06", name: "Transaction", type: "income", amount: 520 },
    { date: "2024-10-06", name: "Transaction", type: "expense", amount: 290 },
    { date: "2024-10-07", name: "Transaction", type: "income", amount: 530 },
    { date: "2024-10-07", name: "Transaction", type: "expense", amount: 400 },
    { date: "2024-10-08", name: "Transaction", type: "income", amount: 620 },
    { date: "2024-10-08", name: "Transaction", type: "expense", amount: 380 },
    { date: "2024-10-09", name: "Transaction", type: "income", amount: 500 },
    { date: "2024-10-09", name: "Transaction", type: "expense", amount: 350 },
    { date: "2024-10-10", name: "Transaction", type: "income", amount: 470 },
    { date: "2024-10-10", name: "Transaction", type: "expense", amount: 300 },
    { date: "2024-10-11", name: "Transaction", type: "income", amount: 540 },
    { date: "2024-10-11", name: "Transaction", type: "expense", amount: 310 },
    { date: "2024-10-12", name: "Transaction", type: "income", amount: 560 },
    { date: "2024-10-12", name: "Transaction", type: "expense", amount: 340 },
    { date: "2024-10-13", name: "Transaction", type: "income", amount: 590 },
    { date: "2024-10-13", name: "Transaction", type: "expense", amount: 420 },
    { date: "2024-10-14", name: "Transaction", type: "income", amount: 650 },
    { date: "2024-10-14", name: "Transaction", type: "expense", amount: 450 },
    { date: "2024-10-15", name: "Transaction", type: "income", amount: 480 },
    { date: "2024-10-15", name: "Transaction", type: "expense", amount: 320 },
    { date: "2024-10-16", name: "Transaction", type: "income", amount: 700 },
    { date: "2024-10-16", name: "Transaction", type: "expense", amount: 450 },
    { date: "2024-10-17", name: "Transaction", type: "income", amount: 480 },
    { date: "2024-10-17", name: "Transaction", type: "expense", amount: 300 },
    { date: "2024-10-18", name: "Transaction", type: "income", amount: 520 },
    { date: "2024-10-18", name: "Transaction", type: "expense", amount: 290 },
    { date: "2024-10-19", name: "Transaction", type: "income", amount: 530 },
    { date: "2024-10-19", name: "Transaction", type: "expense", amount: 400 },
    { date: "2024-10-20", name: "Transaction", type: "income", amount: 620 },
    { date: "2024-10-20", name: "Transaction", type: "expense", amount: 380 },
    { date: "2024-10-21", name: "Transaction", type: "income", amount: 500 },
    { date: "2024-10-21", name: "Transaction", type: "expense", amount: 350 },
    { date: "2024-10-22", name: "Transaction", type: "income", amount: 470 },
    { date: "2024-10-22", name: "Transaction", type: "expense", amount: 300 },
    { date: "2024-10-23", name: "Transaction", type: "income", amount: 540 },
    { date: "2024-10-23", name: "Transaction", type: "expense", amount: 310 },
    { date: "2024-10-24", name: "Transaction", type: "income", amount: 560 },
    { date: "2024-10-24", name: "Transaction", type: "expense", amount: 340 },
    { date: "2024-10-25", name: "Transaction", type: "income", amount: 590 },
    { date: "2024-10-25", name: "Transaction", type: "expense", amount: 420 },
    { date: "2024-10-26", name: "Transaction", type: "income", amount: 650 },
    { date: "2024-10-26", name: "Transaction", type: "expense", amount: 450 },
    { date: "2024-10-27", name: "Transaction", type: "income", amount: 480 },
    { date: "2024-10-27", name: "Transaction", type: "expense", amount: 320 },
    { date: "2024-10-28", name: "Transaction", type: "income", amount: 650 },
    { date: "2024-10-28", name: "Transaction", type: "expense", amount: 450 },
    { date: "2024-10-29", name: "Transaction", type: "income", amount: 480 },
    { date: "2024-10-29", name: "Transaction", type: "expense", amount: 320 },
    { date: "2024-10-30", name: "Transaction", type: "income", amount: 560 },
    { date: "2024-10-30", name: "Transaction", type: "expense", amount: 390 },
    { date: "2024-10-31", name: "Transaction", type: "income", amount: 560 },
    { date: "2024-10-31", name: "Transaction", type: "expense", amount: 390 },
    { date: "2024-11-01", name: "Transaction", type: "income", amount: 500 },
    { date: "2024-11-01", name: "Transaction", type: "expense", amount: 300 },
    { date: "2024-11-02", name: "Transaction", type: "income", amount: 450 },
    { date: "2024-11-02", name: "Transaction", type: "expense", amount: 320 },
    { date: "2024-11-03", name: "Transaction", type: "income", amount: 600 },
    { date: "2024-11-03", name: "Transaction", type: "expense", amount: 400 },
    { date: "2024-11-04", name: "Transaction", type: "income", amount: 700 },
    { date: "2024-11-04", name: "Transaction", type: "expense", amount: 450 },
    { date: "2024-11-05", name: "Transaction", type: "income", amount: 480 },
    { date: "2024-11-05", name: "Transaction", type: "expense", amount: 300 },
    { date: "2024-11-06", name: "Transaction", type: "income", amount: 520 },
    { date: "2024-11-06", name: "Transaction", type: "expense", amount: 290 },
    { date: "2024-11-07", name: "Transaction", type: "income", amount: 530 },
    { date: "2024-11-07", name: "Transaction", type: "expense", amount: 400 },
    { date: "2024-11-08", name: "Transaction", type: "income", amount: 620 },
    { date: "2024-11-08", name: "Transaction", type: "expense", amount: 380 },
    { date: "2024-11-09", name: "Transaction", type: "income", amount: 500 },
    { date: "2024-11-09", name: "Transaction", type: "expense", amount: 350 },
    { date: "2024-11-10", name: "Transaction", type: "income", amount: 470 },
    { date: "2024-11-10", name: "Transaction", type: "expense", amount: 300 },
    { date: "2024-11-11", name: "Transaction", type: "income", amount: 540 },
    { date: "2024-11-11", name: "Transaction", type: "expense", amount: 310 },
    { date: "2024-11-12", name: "Transaction", type: "income", amount: 560 },
    { date: "2024-11-12", name: "Transaction", type: "expense", amount: 340 },
    { date: "2024-11-13", name: "Transaction", type: "income", amount: 590 },
    { date: "2024-11-13", name: "Transaction", type: "expense", amount: 420 },
    { date: "2024-11-14", name: "Transaction", type: "income", amount: 650 },
    { date: "2024-11-14", name: "Transaction", type: "expense", amount: 450 },
    { date: "2024-11-15", name: "Transaction", type: "income", amount: 480 },
    { date: "2024-11-15", name: "Transaction", type: "expense", amount: 320 },
    { date: "2024-11-16", name: "Transaction", type: "income", amount: 700 },
    { date: "2024-11-16", name: "Transaction", type: "expense", amount: 450 },
    { date: "2024-11-17", name: "Transaction", type: "income", amount: 480 },
    { date: "2024-11-17", name: "Transaction", type: "expense", amount: 300 },
    { date: "2024-11-18", name: "Transaction", type: "income", amount: 520 },
    { date: "2024-11-18", name: "Transaction", type: "expense", amount: 290 },
    { date: "2024-11-19", name: "Transaction", type: "income", amount: 530 },
    { date: "2024-11-19", name: "Transaction", type: "expense", amount: 400 },
    { date: "2024-11-20", name: "Transaction", type: "income", amount: 620 },
    { date: "2024-11-20", name: "Transaction", type: "expense", amount: 380 },
    { date: "2024-11-21", name: "Transaction", type: "income", amount: 500 },
    { date: "2024-11-21", name: "Transaction", type: "expense", amount: 350 },
    { date: "2024-11-22", name: "Transaction", type: "income", amount: 470 },
    { date: "2024-11-22", name: "Transaction", type: "expense", amount: 300 },
    { date: "2024-11-23", name: "Transaction", type: "income", amount: 540 },
    { date: "2024-11-23", name: "Transaction", type: "expense", amount: 310 },
    { date: "2024-11-24", name: "Transaction", type: "income", amount: 560 },
    { date: "2024-11-24", name: "Transaction", type: "expense", amount: 340 },
    { date: "2024-11-25", name: "Transaction", type: "income", amount: 590 },
    { date: "2024-11-25", name: "Transaction", type: "expense", amount: 420 },
    { date: "2024-11-26", name: "Transaction", type: "income", amount: 650 },
    { date: "2024-11-26", name: "Transaction", type: "expense", amount: 450 },
    { date: "2024-11-27", name: "Transaction", type: "income", amount: 480 },
    { date: "2024-11-27", name: "Transaction", type: "expense", amount: 320 },
    { date: "2024-11-28", name: "Transaction", type: "income", amount: 650 },
    { date: "2024-11-28", name: "Transaction", type: "expense", amount: 450 },
    { date: "2024-11-29", name: "Transaction", type: "income", amount: 480 },
    { date: "2024-11-29", name: "Transaction", type: "expense", amount: 320 },
    { date: "2024-11-30", name: "Transaction", type: "income", amount: 560 },
    { date: "2024-11-30", name: "Transaction", type: "expense", amount: 390 },
  ];

  //find new icons
  const options = [
    { label: 'Add Transactions', value: 'addTransactions', route: '/income-expense/individual-transaction-details', icon: "/icons/logo-wallet-blue.svg"},
    { label: 'Add Loans', value: 'addLoans', route: '/loans', icon: "/icons/logo-wallet-blue.svg"},
    { label: 'Add Debts', value: 'addDebts', route: '/debts', icon: "/icons/logo-wallet-blue.svg"},
  ];

  return (
    <div className='ml-6'>
      <IncomeExpenseAreaChart userID={loggedInUserID || ""}/>
      {/* <hr className='divider-invisible' />
      <hr className='divider-invisible' /> */}
      <TransactionsTable userID={loggedInUserID || ""} />
      <FloatingButton floatingButtonOptions={options}/>
    </div>
  )
}

export default incomeExpensePage