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

const TransactionsIncomeExpenseTable = ({userID} : TransactionsTableProps) => {
    const [userTransactionsData, setUserTransactionsData] = useState<Transaction[]>([]);
    const [transactionData, setTransactionsData] = useState<Transaction>();
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const onEdit = (transactionID: string) => {
        router.push(`/income-expense/individual-transaction-details?transactionID=${transactionID}`);
    }

    useEffect(() => {
        const fetchUserTransactions = async (loggedInUserID: string) => {
            setIsLoading(true);
            console.log('Logged In User ID Use Effect', loggedInUserID);
            if (loggedInUserID) {
                try {
                    const response = await axios.get('/api/transaction/income-expense/fetchUserTransactions', {
                        params: { userID: loggedInUserID }
                    });
    
                    console.log('User Transactions Response Function:', response);
                    console.log('User Transactions Data Function:', response.data.userTransactionsData); 
                    setUserTransactionsData(response.data.userTransactionsData); 
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
                    const response = await axios.post('/api/transaction/income-expense/delete', {transactionID: transactionID});

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
        <div className="ml-6 max-w-[1115px]">
        <Table className="mt-2 mb-2 max-w-[1050px]">
            <TableHeader>
                <TableRow>
                    <TableHead className="px-2">Transaction ID</TableHead>
                    <TableHead className="px-2">Amount</TableHead>
                    <TableHead className="px-2">Status</TableHead>
                    <TableHead className="px-2">Date</TableHead>
                    <TableHead className="px-2 max-md:hidden">Type</TableHead>
                    <TableHead className="px-2 max-md:hidden">Category</TableHead>
                    <TableHead className="px-2 max-md:hidden">Receiver ID</TableHead>
                    <TableHead className="px-2 max-md:hidden">Sender ID</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {userTransactionsData.map((t: Transaction) => {
                    const status = getTransactionStatus (new Date(t.dateOfTransaction))
                    const amount = formatAmount(t.totalAmountOfTransaction)

                    const isIncome = t.transactionType === 'Income';
                    const isExpense = t.transactionType === 'Expense';

                    return(
                        <TableRow key={t._id} className={`${isExpense || amount[0] === '-' ? 'bg-[#FFFBFA]' : 'bg-[#F6FEF9]'} !over:bg-none !border-b-default`}>
                            <TableCell className="max-w-[250px] pl-2 pr-10">
                                <div className="flex items-center gap-3">
                                    <h1 className="text-14 truncate font-semibold text-[#344054]">
                                        {removeSpecialCharacters(t.transactionName)}
                                    </h1>
                                </div>
                            </TableCell>

                            <TableCell className = {`pl-2 pr-10 font-semibold ${
                                isExpense || amount[0] === '-' ?
                                'text-[#f04438]' 
                                : 'text-[#039855]'
                                }`}>
                                {isExpense ? `-${amount}` : isIncome ? `+${amount}`: amount}
                            </TableCell>

                            <TableCell className="pl-2 pr-10">
                                <CategoryBadge category={status}/>
                            </TableCell>

                            <TableCell className="min-w-32 pl-2 pr-10">
                                {formatDateTime(new Date(t.dateOfTransaction)).dateTime}
                            </TableCell>

                            <TableCell className="pl-2 pr-10 capitalize min-w-24 max-md:hidden">
                                {t.transactionType}
                            </TableCell>

                            <TableCell className="pl-2 pr-5 capitalize min-w-24 max-md:hidden">
                                <CategoryBadge category={t.transactionCategory} />
                            </TableCell>

                            <TableCell className="pl-2 pr-10 max-md:hidden">
                                {t.senderID}
                            </TableCell>

                            <TableCell className="pl-2 pr-10 max-md:hidden">
                                {t.receiverID}
                            </TableCell>

                            <TableCell className="pl-2 max-md:hidden">
                                <button onClick={() => onEdit(t._id)} className="text-blue-500 hover:underline mr-2">Edit</button>
                                <button onClick={() => onDelete(t._id)} className="text-blue-500 hover:underline mr-2">Delete</button>
                            </TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
        </div>
    )
}
export default TransactionsIncomeExpenseTable