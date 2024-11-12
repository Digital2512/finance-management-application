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
import { fetchUserTransaction } from "@/lib/transaction/fetchUserTransaction"
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

const TransactionsTable = ({Transactions}: TransactionTableProps) => {
    const [userTransactionsData, setUserTransactionsData] = useState<any>(null);
    const router = useRouter();

    const onEdit = (transactionID: string) => {
        router.push(`/income-expense/individual-transaction-details?transactionID=${transactionID}`);
    }

    useEffect(() => {
        const fetchUserTransactions = async (loggedInUserID: string) => {
            if (loggedInUserID) {
                try {
                    const response = await axios.get('/api/transaction/fetchUserTransaction', {
                        params: { userID: loggedInUserID }
                    });
    
                    console.log('User Transactions Response Function:', response);
                    console.log('User Transactions Data Function:', response.data.userTransactionsData); 
                    setUserTransactionsData(response.data.userTransactionsData);
                } catch (error) {
                    console.error("Error fetching user transactions:", error);
                }
            } else {
                console.log("Error: No logged-in user ID found in session storage.");
            }
        };
    
        const loggedInUserID = sessionStorage.getItem('loggedInUserID');
        if (loggedInUserID) {
            fetchUserTransactions(loggedInUserID);
        } else {
            console.log('No Logged In User ID');
        }
    }, []); // Ensure only runs once

    console.log('User Transactions Data:', userTransactionsData);
    
    // After `userTransactionsData` is set, you can add further useEffect hooks if needed to track updates
    

    // HAS A PROBLEM ON ITS DATABASE (UNDEFINED DATABASE)
    // const onDelete = async (transactionID: string) => {
    //     const {result, message, deletedTransactionID} = await deleteTransaction(transactionID);

    //     if(result){
    //         alert('Deleted a transaction');
    //         router.push('/incomeExpense');
    //     }else{
    //         console.log('Unsuccessful Deleted ID Message: ', message)
    //         console.log('Transaction ID not Deleted', deletedTransactionID)
    //         alert('Failed to Delete a transaction');
    //     }
    // }

    return(
        <Table>
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
                {Transactions.map((t: TransactionDetails) => {
                    const status = getTransactionStatus (new Date(t.date))
                    const amount = formatAmount(t.amount)

                    const isIncome = t.type === 'income';
                    const isExpense = t.type === 'expense';

                    return(
                        <TableRow key={t.transactionID} className={`${isExpense || amount[0] === '-' ? 'bg-[#FFFBFA]' : 'bg-[#F6FEF9]'} !over:bg-none !border-b-default`}>
                            <TableCell className="max-w-[250px] pl-2 pr-10">
                                <div className="flex items-center gap-3">
                                    <h1 className="text-14 truncate font-semibold text-[#344054]">
                                        {removeSpecialCharacters(t.name)}
                                    </h1>
                                </div>
                            </TableCell>

                            <TableCell className = {`pl-2 pr-10 font-semibold ${
                                isExpense || amount[0] === '-' ?
                                'text-[#f04438]' 
                                : 'text-[#039855]'
                                }`}>
                                {isExpense ? `-${amount}` : isIncome ? amount: amount}
                            </TableCell>

                            <TableCell className="pl-2 pr-10">
                                <CategoryBadge category={status}/>
                            </TableCell>

                            <TableCell className="min-w-32 pl-2 pr-10">
                                {formatDateTime(new Date(t.date)).dateTime}
                            </TableCell>

                            <TableCell className="pl-2 pr-10 capitalize min-w-24 max-md:hidden">
                                {t.type}
                            </TableCell>

                            <TableCell className="pl-2 pr-10 capitalize min-w-24 max-md:hidden">
                                <CategoryBadge category={t.category} />
                            </TableCell>

                            <TableCell className="pl-2 pr-10 max-md:hidden">
                                {t.senderAccountID}
                            </TableCell>

                            <TableCell className="pl-2 pr-10 max-md:hidden">
                                {t.receiverAccountID}
                            </TableCell>

                            <TableCell className="pl-2 pr-10 max-md:hidden">
                                <button onClick={() => onEdit(t.transactionID)} className="text-blue-500 hover:underline mr-2">Edit</button>
                                {/* <button onClick={() => onDelete(t.transactionID)} className="text-blue-500 hover:underline mr-2">Delete</button> */}
                            </TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    )
}
export default TransactionsTable