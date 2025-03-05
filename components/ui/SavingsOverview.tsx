import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { filterTransactionsByDateRange, calculateTotalAmount } from '@/lib/utils';

const SavingsOverview = ({userID}: OverviewProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [overviewTab, setOverviewTab] = useState('monthly');
  const [userSavingsTransactions, setUserSavingsTransactions] = useState<Savings[]>()
  const [userRepaymentTransactions, setUserRepaymentTransactions] = useState<Repayment[]>()
  const loggedInUserID = sessionStorage.getItem('loggedInUserID');

  useEffect(() => {
    if(loggedInUserID){
      const fetchUserSavingsTransactions = async(loggedInUserID: string) => {
        setIsLoading(true);
        try{
          const response = await axios.get('/api/transaction/savings/fetchUserTransactions', {
            params: { userID: loggedInUserID }
          });

          console.log('New');
          console.log('User Savings Transactions Response Function:', response);
          console.log('User Savings Transactions Data Function:', response.data.userSavingsTransactionsData); 
          setUserSavingsTransactions(response.data.userSavingsTransactionsData); 
        }catch(error){
          console.log("Error fetching user transactions:", error);
        }finally{
          setIsLoading(false);
        }
      }

      if(loggedInUserID){
        console.log('Logged In User ID: ', loggedInUserID);
        fetchUserSavingsTransactions(loggedInUserID);
      }else{
        console.error('No user ID found')
      }
    }else{
      console.log('No user ID found')
      setIsLoading(false)
    }
  }, []);

  return (
    <div>
      <h2>Savings Overview</h2>
      {/* <p>Today: ${totals.today}</p>
      <p>This Week: ${totals.thisWeek}</p>
      <p>This Month: ${totals.thisMonth}</p>
      <p>Total: ${totals.total}</p> */}
    </div>
  );
};

export default SavingsOverview;
