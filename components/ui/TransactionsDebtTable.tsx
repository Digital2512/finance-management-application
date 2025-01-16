'use client'

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { transactionCategoryStyles } from "@/constants"  
import {cn, formatAmount, formatDateTime, getTransactionStatus, removeSpecialCharacters} from'@/lib/utils'
import { stat } from "fs"
import { formatDate } from "react-datepicker/dist/date_utils"
import { useRouter } from "next/navigation";
import { deleteTransaction } from "@/lib/transaction/deleteTransaction"
import { editTransaction } from "@/lib/transaction/editTransaction"
import { fetchTransaction } from "@/lib/transaction/fetchTransaction"
import { fetchUserIncomeExpenseTransaction } from "@/lib/transaction/fetchUserIncomeExpenseTransaction"
import axios, { AxiosRequestConfig } from "axios"
import { useState, useEffect } from "react"

// const loggedInUserID = sessionStorage.getItem('loggedInUserID');
// Assuming `userID` is available, fetch transactions



const CategoryBadge = ({category}: CategoryBadgeProps) => {
    const {
        borderColor,
        backgroundColor,
        textColor, 
        chipBackgroundColor,
    } = transactionCategoryStyles[category as keyof typeof transactionCategoryStyles] || transactionCategoryStyles.default

    return(
        <div className={cn('category-badge', borderColor, chipBackgroundColor)}>
            <div className={cn('size-2 rounded-full', backgroundColor)}/>
            <p className={cn('text-[12px] font-medium', textColor)}>{category}</p>
        </div>
    )
}

interface TransactionsTableProps {
    userID: string;
    // Other props if needed
  }

const TransactionsDebtTable = ({userID} : TransactionsTableProps) => {
    const [userTransactionsData, setUserTransactionsData] = useState<Debt[]>([]);
    const [transactionData, setTransactionsData] = useState<Debt>();
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const onEdit = (transactionID: string) => {
        router.push(`/debts/individual-transaction?debtTransactionID=${transactionID}`);
    }

    useEffect(() => {
        const fetchUserTransactions = async (loggedInUserID: string) => {
            setIsLoading(true);
            console.log('Logged In User ID Use Effect', loggedInUserID);
            if (loggedInUserID) {
                try {
                    const response = await axios.get('/api/transaction/debt/fetchUserTransactions', {
                        params: { userID: loggedInUserID }
                    });
    
                    console.log('User Debt Transactions Response Function:', response);
                    console.log('User Debt Transactions Data Function:', response.data.userDebtTransactionsData); 
                    setUserTransactionsData(response.data.userDebtTransactionsData); 
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
    
        if (userID) {
            console.log('User ID Table:', userID);
            fetchUserTransactions(userID);
        } else {
            console.log('No Logged In User ID');
            setIsLoading(false);
        }
    }, []); // Ensure only runs once

    console.log('User Transactions Data Table:', userTransactionsData);

    if (isLoading) {
        return <p>Loading...</p>; // Show loading message while fetching data
    }

    if (!userTransactionsData || userTransactionsData.length === 0) {
        return <p className="ml-6">No transactions found</p>; // Show a message if no data is found
    }

    const onDelete = async (transactionID: string) => {
        setIsLoading(true);
        console.log('Transaction Use Effect: ', transactionID);
            if (transactionID) {
                try {
                    const response = await axios.post('/api/transaction/debt/delete', {transactionID: transactionID});

                    // console.log('Delete Transactions Response Function:', response);
                    // console.log('Delete Transactions Response Function Transaction ID:', response.data.deleteTransactionID);

                    if(response.status === 200){
                        console.log('Transactions Response Function:', response);
                        console.log('Transactions Delete Response Function:', response.data.deleteTransactionID);
                        
                        window.location.reload();
                    }else{
                        console.log('Transactions not Deleted');
                    }
    
                    // console.log('Transactions Response Function:', response);
                    // console.log('Transactions Data Function:', response.data.userTransactionsData); 
                    // set(response.data.userTransactionsData); 
                    // return {userTransactionsData: response.data.userTransactionData};
                } catch (error) {
                    console.error("Error deleting a transactions: ", error);
                }finally{
                    setIsLoading(false);
                }
            } else {
                console.log("Error: No Transaction ID");
                setIsLoading(false);
            }
        };
    
    // After `userTransactionsData` is set, you can add further useEffect hooks if needed to track updates
    

    // HAS A PROBLEM ON ITS DATABASE (UNDEFINED DATABASE)
    
    
        // if (userID) {
        //     console.log('User ID Table:', userID);
        //     fetchUserTransactions(userID);
        // } else {
        //     console.log('No Logged In User ID');
        //     setIsLoading(false);
        // }

    return(
        <Table className="ml-6 max-w-[1100px]">
            <TableHeader>
                <TableRow>
                    <TableHead className="px-2">Debt  Transaction ID</TableHead>
                    <TableHead className="px-2">Amount</TableHead>
                    <TableHead className="px-2">Interest Rate</TableHead>
                    <TableHead className="px-2">Status</TableHead>
                    <TableHead className="px-2 max-md:hidden">Type Of Interest</TableHead>
                    <TableHead className="px-2 max-md:hidden">Category</TableHead>
                    <TableHead className="px-2 max-md:hidden">Receiver ID</TableHead>
                    <TableHead className="px-2 max-md:hidden">Sender ID</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {userTransactionsData.map((d: Debt) => {
                    const status = getTransactionStatus (new Date(d.startingDateOfDebt))
                    const amount = formatAmount(d.debtAmount)

                    // const isHighInterest = l.interestRate >= 15;
                    // const isLowInterest = l.interestRate < 15;

                    // const isHighCummulative = l.interestRateType === 'Daily' || 'Weekly';
                    // const isLowCummulative = l.interestRateType === 'Monthly' || 'Yearly';

                    // const expensiveUrgent = isHighInterest && isHighCummulative;
                    // const expensiveNotUrgent = isHighInterest && isLowCummulative;
                    // const notExpensiveUrgent = isLowInterest && isHighCummulative;
                    // const notExpensiveNotUrgent = isLowInterest && isLowCummulative;

                    return(
                        <TableRow key={d._id} className="">
                            <TableCell className="max-w-[250px] pl-2 pr-10">
                            <div className="flex items-center gap-3">
                                    <h1 className="text-14 truncate font-semibold text-[#344054]">
                                        {removeSpecialCharacters(d.debtName)}
                                    </h1>
                                </div>
                            </TableCell>

                            <TableCell className = {`pl-2 pr-10 font-semibold text-[#f04438]`}>
                                {formatAmount(d.debtAmount)}
                            </TableCell>

                            <TableCell className = {`pl-2 pr-10`}>
                                {d.interestRate}%
                            </TableCell>

                            <TableCell className = {`pl-2 pr-10`}>
                                {d.debtStatus}
                            </TableCell>

                            <TableCell className = {`pl-2 pr-10 max-md:hidden`}>
                                {d.interestRateType}
                            </TableCell>
                            
                            <TableCell className = {`pl-2 pr-10 max-md:hidden`}>
                                {d.debtCategory}
                            </TableCell>

                            <TableCell className = {`pl-2 pr-10 max-md:hidden`}>
                                {d.receiverID}
                            </TableCell>

                            <TableCell className = {`pl-2 pr-10 max-md:hidden`}>
                                {d.senderID}
                            </TableCell>

                            <TableCell className="pl-2 pr-10 max-md:hidden">
                                <div>
                                    <button onClick={() => onEdit(d._id)} className="text-blue-500 hover:underline mr-2">Edit</button>
                                </div>
                                <div>
                                    <button onClick={() => onDelete(d._id)} className="text-blue-500 hover:underline mr-2">Delete</button>
                                </div>
                            </TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    )
}
export default TransactionsDebtTable