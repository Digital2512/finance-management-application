import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { filterTransactionsByDateRange, calculateTotalAmount } from '@/lib/utils';

const RepaymentOverview = ({userID}: OverviewProps) => {
  const [totals, setTotals] = useState({ today: 0, thisWeek: 0, thisMonth: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [overviewTab, setOverviewTab] = useState('monthly');
  const [userRepaymentTransactions, setUserRepaymentTransactions] = useState<Repayment[]>([])
  const loggedInUserID = sessionStorage.getItem('loggedInUserID');

  useEffect(() => {
      const fetchUserTransactions = async (userID: string) => {
          setIsLoading(true);
          console.log('Logged In User ID Use Effect', userID);
          if (userID) {
              try {
                  const response = await axios.get('/api/transaction/repayment/fetchUserTransactions', {
                      params: { userID: userID }
                  });

                  console.log('Repayment Overview');
                  console.log('User Repayment Transactions Response Function:', response);
                  console.log('User Repayment Transactions Data Function:', response.data.userRepaymentTransactionsData); 
                  setUserRepaymentTransactions(response.data.userRepaymentTransactionsData); 
                  // return {userTransactionsData: response.data.userTransactionData};
              } catch (error) {
                  console.error("Error fetching user transactions:", error);
              }finally{
                  setIsLoading(false);
              }
          } else {
              console.log("Error: No logged-in user ID found in session storage.");
              setIsLoading(false);
          }
      };

      if (loggedInUserID) {
          console.log('User ID Table:', loggedInUserID);
          fetchUserTransactions(loggedInUserID);
      } else {
          console.log('No Logged In User ID');
          setIsLoading(false);
      }
  }, [loggedInUserID]); // Ensure only runs once

    console.log('Repayment Transactions: ', userRepaymentTransactions);

    if(userRepaymentTransactions){
      const filteredUserRepaymentData : filterTransactions[] = userRepaymentTransactions ? userRepaymentTransactions?.map((curr) => ({
        transactionName: curr.transactionID,
        transactionAmount : curr.repaymentAmount,
        transactionCategory: curr.transactionType,
        transactionDate: new Date(curr.dateOfRepayment)
      })) : []  
      
      console.log('Fiter Transactions: ', filteredUserRepaymentData);

      const savingsUserTransactionData = filteredUserRepaymentData.filter((curr) => curr.transactionCategory === 'Savings');
  
      useEffect(() => {
        const calculateAndFilterRepayments = async (userRepaymentTransactions: Repayment) => {
          setIsLoading(true)
          console.log('Repayment Calculations in Progress')
          if(!userRepaymentTransactions){
            try{
              const todayRepayments = filterTransactionsByDateRange({transactions: filteredUserRepaymentData, dateRange: 'today'});
              const thisWeekRepayments = filterTransactionsByDateRange({transactions: filteredUserRepaymentData, dateRange: 'thisWeek'});
              const thisMonthRepayments = filterTransactionsByDateRange({transactions: filteredUserRepaymentData, dateRange: 'thisMonth'});

              setTotals({
                today: calculateTotalAmount(todayRepayments),
                thisWeek: calculateTotalAmount(thisWeekRepayments),
                thisMonth: calculateTotalAmount(thisMonthRepayments),
                total: calculateTotalAmount(filteredUserRepaymentData)
              });
            }catch(error){
              console.error('Error in Calculations: ', error)
            }finally{
              setIsLoading(false)
            }
          }else{
            console.log('No Repayment Data')
          }

          if(userRepaymentTransactions){
            console.log('Repayments Transactions Data: ', userRepaymentTransactions);
            calculateAndFilterRepayments(userRepaymentTransactions)
          }else{
            console.log('No User Repayment Data');
            setIsLoading(false)
          }
        }
      }, [userRepaymentTransactions]);
  }else{
    return <p>No Repayment Transaction Data Found</p>
  }

  if(isLoading){
    return <p>Loading...</p>
  }

  if(!userRepaymentTransactions){
    return <p>No transaction data found</p>
  }

  return (
    <div>
      <h2>Repayment Overview</h2>
      <p>Today: ${totals.today}</p>
      <p>This Week: ${totals.thisWeek}</p>
      <p>This Month: ${totals.thisMonth}</p>
      <p>Total: ${totals.total}</p>
    </div>
  );
};

export default RepaymentOverview;
