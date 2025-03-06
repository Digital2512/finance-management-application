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
    typeOfRepayment: string;
    // Other props if needed
  }

const TransactionsRepaymentTable = ({userID, typeOfRepayment} : TransactionsTableProps) => {
    const [userTransactionsData, setUserTransactionsData] = useState<Repayment[]>([]);    
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const onEdit = (transactionID: string) => {
        if(typeOfRepayment === 'Savings'){
            router.push(`/savings/individual-repayment-transaction?repaymentTransactionID=${transactionID}`);
        }else{
            router.push(`/debts/individual-repayment-transaction?repaymentTransactionID=${transactionID}`);
        }
    }

    useEffect(() => {
        const fetchUserTransactions = async (userID: string) => {
            setIsLoading(true);
            console.log('Logged In User ID Use Effect', userID);
            if (userID) {
                try {
                    const response = await axios.get('/api/transaction/repayment/fetchUserTransactions', {
                        params: { userID: userID }
                    });
    
                    console.log('User Repayment Transactions Response Function:', response);
                    console.log('User Repayment Transactions Data Function:', response.data.userRepaymentTransactionsData); 
                    setUserTransactionsData(response.data.userRepaymentTransactionsData); 
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

    console.log('User Repayment Transactions Data Table:', userTransactionsData);

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
                    const response = await axios.post('/api/transaction/repayment/delete', {transactionID: transactionID});

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
        
        console.log("=================================================")
    console.log('Users Repayment Table: ', userTransactionsData);

    const savingsUserTransactionData = userTransactionsData.filter((curr) => curr.transactionType === 'Savings');
    const debtUserTransactionData = userTransactionsData.filter((curr) => curr.transactionType === 'Debts');

    console.log('Savings Repayment Table: ', savingsUserTransactionData);
    console.log('Debts Repayment Table: ', debtUserTransactionData);
    console.log("=================================================")

    return(
        <Table className="ml-6 max-w-[1100px]">
            <TableHeader>
                <TableRow>
                    <TableHead className="px-2">Transaction ID</TableHead>
                    <TableHead className="px-2">Date</TableHead>
                    <TableHead className="px-2">Amount</TableHead>
                    <TableHead className="px-2 max-md::hidden">Type</TableHead>
                    <TableHead className="px-2 max-md::hidden">Sender ID</TableHead>
                    <TableHead className="px-2 max-md::hidden">Receiver ID</TableHead>
                    <TableHead className="px-2">Status</TableHead>
                    {/* <TableHead className="px-2">Type Of Repayment</TableHead> */}
                    {/* <TableHead className="px-2 max-md:hidden">Category</TableHead>
                    <TableHead className="px-2 max-md:hidden">Receiver ID</TableHead>
                    <TableHead className="px-2 max-md:hidden">Sender ID</TableHead> */}
                </TableRow>
            </TableHeader>
            <TableBody>
            {typeOfRepayment === 'Savings' ? (
            savingsUserTransactionData.map((r: Repayment) => {
            const dateStatus = getTransactionStatus(new Date(r.dateOfRepayment));
            const status = r.repaymentStatus;
            const amount = formatAmount(r.repaymentAmount);

            return (
                <TableRow key={r._id}>
                <TableCell className="max-w-[100px] pl-2 pr-10">
                    <div className="flex items-center gap-3">
                    <h1 className="text-14 truncate font-semibold text-[#344054]">
                        {r.transactionID}
                    </h1>
                    </div>
                </TableCell>

                <TableCell className="max-w-[100px] pl-2 pr-10">
                    {formatDateTime(new Date(r.dateOfRepayment)).dateTime}
                </TableCell>

                <TableCell className="pl-2 pr-10 font-semibold text-[#f04438]">
                    {formatAmount(r.repaymentAmount)}
                </TableCell>

                <TableCell className="pl-2 pr-10">
                    {r.typeOfRepayment}
                </TableCell>

                <TableCell className="pl-2 pr-10">{r.senderID}</TableCell>

                <TableCell className="pl-2 pr-10">{r.receiverID}</TableCell>

                <TableCell className="pl-2 pr-10">{r.repaymentStatus}</TableCell>

                <TableCell className="pl-2 pr-10 flex flex-col max-md:hidden">
                    <button
                    onClick={() => onEdit(r._id)}
                    className="text-blue-500 hover:underline mr-2"
                    >
                    Edit
                    </button>
                    <button
                    onClick={() => onDelete(r._id)}
                    className="text-blue-500 hover:underline mr-2"
                    >
                    Delete
                    </button>
                </TableCell>
                </TableRow>
            );
            })
        ) : typeOfRepayment === 'Debts' ? (
            debtUserTransactionData.map((r: Repayment) => {
                const dateStatus = getTransactionStatus(new Date(r.dateOfRepayment));
                const status = r.repaymentStatus;
                const amount = formatAmount(r.repaymentAmount);

            return (
                <TableRow key={r._id}>
                <TableCell className="max-w-[100px] pl-2 pr-10">
                    <div className="flex items-center gap-3">
                    <h1 className="text-14 truncate font-semibold text-[#344054]">
                        {r.transactionID}
                    </h1>
                    </div>
                </TableCell>

                <TableCell className="max-w-[100px] pl-2 pr-10">
                    {formatDateTime(new Date(r.dateOfRepayment)).dateTime}
                </TableCell>

                <TableCell className="pl-2 pr-10 font-semibold text-[#f04438]">
                    {formatAmount(r.repaymentAmount)}
                </TableCell>

                <TableCell className="pl-2 pr-10">
                    {r.typeOfRepayment}
                </TableCell>

                <TableCell className="pl-2 pr-10">{r.senderID}</TableCell>

                <TableCell className="pl-2 pr-10">{r.receiverID}</TableCell>

                <TableCell className="pl-2 pr-10">{r.repaymentStatus}</TableCell>

                <TableCell className="pl-2 pr-10 flex flex-col max-md:hidden">
                    <button
                    onClick={() => onEdit(r._id)}
                    className="text-blue-500 hover:underline mr-2"
                    >
                    Edit
                    </button>
                    <button
                    onClick={() => onDelete(r._id)}
                    className="text-blue-500 hover:underline mr-2"
                    >
                    Delete
                    </button>
                </TableCell>
                </TableRow>
            );
            })
        ): (<p>No Repayment Transactions</p>)}
</TableBody>

        </Table>
    )
}
export default TransactionsRepaymentTable