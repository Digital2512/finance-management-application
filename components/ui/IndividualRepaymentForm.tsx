'use client'

import React, {useMemo} from 'react'
import { useEffect, useState } from "react";
import Link from 'next/link'
import Image from 'next/image'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import CustomRepaymentHistoryFormInput from './CustomRepaymentHistoryFormInput';
import { loanTransactionFormSchema, repaymentTransactionFormSchema } from '@/lib/utils'
import axios from 'axios'
import 'react-datepicker/dist/react-datepicker.css';
import { connectToDatabase } from '@/lib/database'
import { useRouter } from 'next/navigation'
import { fetchTransaction } from '@/lib/transaction/fetchTransaction';
import CustomTransactionFormInput from './CustomTransactionFormInput';
import { formatAmount } from '@/lib/utils';

interface IndividualTransactionsDetailsProps{
    type: string,
    oldRepaymentTransactionID?: string,
  }

interface TransactionsIndividualDetails{
    transactionIndividualDetailsName: string, 
    transactionIndividualDetailsDescription: string, 
    transactionIndividualDetailsType: string, 
    transactionIndividualDetailsCurrency: string, 
    transactionIndividualDetailsAmount: number
}

const IndividualRepaymentTransactionForm = ({ type, oldRepaymentTransactionID }: IndividualTransactionsDetailsProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    console.log('Type: ', type);
    console.log('Old Transaction ID: ', oldRepaymentTransactionID || '');
    // const [errorMessage, setErrorMessage] = useState<string | null>(null);
    // const [user, setUser] = useState<any>(null);

    const formSchema = repaymentTransactionFormSchema();

    // Initialize the form using react-hook-form and Zod resolver
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            debtID: '',
            receiverID: '',
            senderID: '',
            typeOfRepayment: 'Normal',
            repaymentStatus: 'Not Paid',
            dateOfRepayment: new Date(),
            repaymentCurrency: 'USD',
            repaymentAmount: 0,
            repaymentProofOfURL: 'Empty'
        },
    });

    // const {watch} = form;

    // const loanAmount = String(watch('loanAmount')) || '0';
    // const interestRate = String(watch('interestRate')) || '0';
    // const interestRateType = watch('interestRateType') || 'Monthly';
    // const loanTermYear = String(watch('loanTermYear')) || '0';
    // const loanTermMonth = String(watch('loanTermMonth')) || '0';

    // const loanAmountNumber = parseFloat(loanAmount);
    // const interestRateNumber = parseFloat(interestRate);    
    // const loanTermYearNumber = parseFloat(loanTermYear);
    // const loanTermMonthNumber = parseFloat(loanTermMonth);


    // const totalLoanTermYears = useMemo(() => {
    //     return loanTermYearNumber + loanTermMonthNumber / 12;
    // }, [loanTermMonthNumber, loanTermYearNumber])

    // const totalInterest = useMemo(() => {
    //     if(interestRateType === 'Yearly') {
    //         return loanAmountNumber * (interestRateNumber / 100) * totalLoanTermYears;
    //     }else if(interestRateType === 'Monthly'){
    //         return loanAmountNumber * (interestRateNumber / 100) * totalLoanTermYears * 12;
    //     }else if(interestRateType === 'Weekly'){
    //         return loanAmountNumber * (interestRateNumber / 100) * totalLoanTermYears * 52;
    //     }else if(interestRateType === 'Daily'){
    //         return loanAmountNumber * (interestRateNumber / 100) * totalLoanTermYears * 365;
    //     }
    //     return 0;
    // }, [loanAmountNumber, interestRateNumber, interestRateType, totalLoanTermYears]);

    // const totalAmountAfter = useMemo(() => {
    //     return loanAmountNumber + totalInterest
    // }, [loanAmountNumber, totalInterest]);

    useEffect(() => {
        const fetchTransactionData = async (oldRepaymentTransactionID: string) => {
            try {
                setIsLoading(true);
                const response = await axios.get('/api/transaction/repayment/fetchTransaction', {
                    params: { repaymentTransactionID: oldRepaymentTransactionID }, 
                });
    
                console.log('Fetch Transaction Response: ', response);
                console.log('Fetch Transaction Data: ', response.data.existingTransactionData);

                const fetchedData = response.data.existingTransactionData;
                console.log('Fetched Data: ', fetchedData);

                fetchedData.dateOfRepayment = new Date(fetchedData.dateOfRepayment);
                console.log('Fetched Data After: ', fetchedData);

                Object.keys(fetchedData).forEach((key) => {
                    if (key !== 'transactionIndividualDetails') {
                        form.setValue(key as keyof z.infer<typeof formSchema>, fetchedData[key]);
                        // console.log('Updated form values:', form.watch());
                    }
                });

                // setTransactionData(response.data.existingTransactionData);
            } catch (error) {
                console.log('Error in fetching data: ', error);
                alert('Error in fetching data');
                setIsLoading(false);
            } finally {
                setIsLoading(false);
            }
        };
    
        if (type === 'edit' && oldRepaymentTransactionID) {
            fetchTransactionData(oldRepaymentTransactionID);
        }
    }, [type, oldRepaymentTransactionID]);

    const currencyCodes = [
        "AED", "AFN", "ALL", "AMD", "ANG", "AOA", "ARS", "AUD", "AWG", "AZN",
        "BAM", "BBD", "BDT", "BGN", "BHD", "BIF", "BMD", "BND", "BOB", "BRL",
        "BSD", "BTN", "BWP", "BYN", "BZD", "CAD", "CDF", "CHF", "CLP", "CNY",
        "COP", "CRC", "CUP", "CVE", "CZK", "DJF", "DKK", "DOP", "DZD", "EGP",
        "ERN", "ETB", "EUR", "FJD", "FKP", "FOK", "GBP", "GEL", "GGP", "GHS",
        "GIP", "GMD", "GNF", "GTQ", "GYD", "HKD", "HNL", "HRK", "HTG", "HUF",
        "IDR", "ILS", "IMP", "INR", "IQD", "IRR", "ISK", "JEP", "JMD", "JOD",
        "JPY", "KES", "KGS", "KHR", "KID", "KMF", "KRW", "KWD", "KYD", "KZT",
        "LAK", "LBP", "LKR", "LRD", "LSL", "LYD", "MAD", "MDL", "MGA", "MKD",
        "MMK", "MNT", "MOP", "MRU", "MUR", "MVR", "MWK", "MXN", "MYR", "MZN",
        "NAD", "NGN", "NIO", "NOK", "NPR", "NZD", "OMR", "PAB", "PEN", "PGK",
        "PHP", "PKR", "PLN", "PYG", "QAR", "RON", "RSD", "RUB", "RWF", "SAR",
        "SBD", "SCR", "SDG", "SEK", "SGD", "SHP", "SLL", "SOS", "SRD", "SSP",
        "STN", "SYP", "SZL", "THB", "TJS", "TMT", "TND", "TOP", "TRY", "TTD",
        "TVD", "TWD", "TZS", "UAH", "UGX", "USD", "UYU", "UZS", "VES", "VND",
        "VUV", "WST", "XAF", "XCD", "XOF", "XPF", "YER", "ZAR", "ZMW", "ZWL"
      ];      

    const currencyOptions = currencyCodes.map((code) => ({
        value: code
    }))
    

    // Submit handler for form
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        console.log('Submit button clicked');
        console.log('Data being sent: Debt ID: ', data.debtID, 'Type of Repayment: ', data.typeOfRepayment);
        setIsLoading(true);
        // setErrorMessage(null);

        try {
            if (type === 'add') {
                console.log('Transaction Addition initiated');

                const loggedInUserID = sessionStorage.getItem('loggedInUserID');

                console.log('Logged In User ID: ', loggedInUserID);

                const repaymentTransactionData = {
                    userID: loggedInUserID,
                    oldRepaymentTransactionID: oldRepaymentTransactionID,
                    debtID: data.debtID,
                    senderID: data.senderID,
                    receiverID: data.receiverID,
                    dateOfRepayment: data.dateOfRepayment,
                    typeOfRepayment: data.typeOfRepayment,
                    repaymentStatus: data.repaymentStatus,
                    repaymentCurrency: data.repaymentCurrency,
                    repaymentAmount: data.repaymentAmount,
                    repaymentProofOfURL: data.repaymentProofOfURL,
                };
                console.log('Add Repayment data being sent:', repaymentTransactionData);

                // Add request
                const response = await axios.post('/api/transaction/repayment/add', repaymentTransactionData);                
                
                console.log(response);

                if(response.status === 200) {
                    // setTransactionData(response.data);
                    alert('Repayment Addition successful');
                    router.push('/debts')
                } else if (response.status === 400 || response.status === 500){
                    alert('Repayment Addition unsuccessful');
                }
            }

            if (type === 'edit') {
                console.log('Loan Edit initiated');

                const loggedInUserID = sessionStorage.getItem('loggedInUserID');

                console.log('Logged In User ID: ', loggedInUserID);

                console.log('Data received from form: ', data);

                const repaymentTransactionData = {
                    userID: loggedInUserID,
                    oldRepaymentTransactionID: oldRepaymentTransactionID,
                    newDebtID: data.debtID,
                    newSenderID: data.senderID,
                    newReceiverID: data.receiverID,
                    newDateOfRepayment: data.dateOfRepayment,
                    newTypeOfRepayment: data.typeOfRepayment,
                    newRepaymentStatus: data.repaymentStatus,
                    newRepaymentCurrency: data.repaymentCurrency,
                    newRepaymentAmount: data.repaymentAmount,
                    newRepaymentProofOfURL: data.repaymentProofOfURL,
                };

                console.log('Edit Repayment data being sent:', repaymentTransactionData);

                // Edit request
                const response = await axios.post('/api/transaction/repayment/edit', repaymentTransactionData);

                console.log(response);
                
                if(response.status === 200) {
                    // setUser(response.data.loggedInUser);
                    // setUser(response.data);
                    // setTransactionData(response.data);
                    alert('Repayment Edit successful');
                    // sessionStorage.setItem('loggedInUser', response.data.loggedInUserInfo)
                    router.push('/debts')
                } else {
                    // setErrorMessage('Login unsuccessful');
                    alert('Repayment Edit unsuccessful');
                }
            }
        } catch (error: any) {
            console.log('Error:', error);
            // setErrorMessage(error.response?.data?.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="transaction-form">
            <header className="flex flex-col gap-5 md:gap-8">
                <h1>Loans</h1>
                {/* <Link href="/" className="flex cursor-pointer items-center gap-1 px-4">
                    <Image
                        src="/icons/logo-wallet-blue.svg"
                        width={34}
                        height={34}
                        alt="WalletWiz Logo"
                    />
                    <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">WalletWiz</h1>
                </Link> */}
            </header>

            {
                oldRepaymentTransactionID ? 
                (
                    <>
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="transaction-form-layout">
                        <div className='flex gap-4 my-[10px]'>
                            <h1>Old Repayment Transaction ID: {oldRepaymentTransactionID}</h1>
                        </div>
                    <div className="transaction-form-row-layout">
                        <div className='transaction-column-first-item'>
                            <CustomRepaymentHistoryFormInput control={form.control} typeInfo='debtID' labelInfo='Debt ID' placeholderInfo='Enter your debt ID' formType='edit'/>
                            <CustomRepaymentHistoryFormInput control={form.control} typeInfo='typeOfRepayment' labelInfo='Type of Repayment' placeholderInfo='Enter your repayment type' formType='edit' options={[
                                {value: 'Normal'},
                                {value: 'Extra'}                                
                            ]}/>

                            <div className='flex flex-row gap-[30px]'>
                                <div className='w-[235px]'>
                                <CustomRepaymentHistoryFormInput control={form.control} typeInfo='repaymentAmount' labelInfo='Repayment Amount' placeholderInfo='Enter your Repayment Amount' formType='edit'/>
                                </div>
                                <div className='w-[235px]'>
                                    <CustomRepaymentHistoryFormInput control={form.control} typeInfo='repaymentCurrency' labelInfo='Repayment Currency' placeholderInfo='Enter your Repayment Currency' formType='edit' options={currencyOptions}/>
                                </div>
                            </div>

                            <CustomRepaymentHistoryFormInput control={form.control} typeInfo='repaymentProofOfURL' labelInfo='Repayment Proof of URL' placeholderInfo='Enter your Repayment Proof of URL' formType='edit'/>
                        </div>

                            <div className='transaction-column-second-item'>
                                <CustomRepaymentHistoryFormInput control={form.control} typeInfo='dateOfRepayment' labelInfo='Date of Repayment' placeholderInfo='Enter your Date of Repayment' formType='edit'/>
                                <CustomRepaymentHistoryFormInput control={form.control} typeInfo='receiverID' labelInfo='Receiver ID' placeholderInfo='Enter your Receiver ID' formType='edit'/>
                                <CustomRepaymentHistoryFormInput control={form.control} typeInfo='senderID' labelInfo='Sender ID' placeholderInfo='Enter your Sender ID' formType='edit'/>
                                <CustomRepaymentHistoryFormInput control={form.control} typeInfo='repaymentStatus' labelInfo='Repayment Status' placeholderInfo='Enter your repayment status' formType='edit' options={
                                [
                                    {value: 'Not Paid'},
                                    {value: 'Pending'},
                                    {value: 'Paid'}
                                ]
                            }/>
                            </div>
                        </div>                        

                        <Button type="submit" disabled={isLoading} className='mt-[25px]'>
                            {isLoading ? 'Submitting...' : 'Submit'}
                        </Button>
                    </form>
                </Form>
                </>
                // <Button type="submit" disabled={isLoading}>
                //     {isLoading ? 'Edit Submitting...' : 'Edit Submit'}
                // </Button>             
                ): 
                (
                    <>
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="transaction-form-layout">
                    <div className="transaction-form-row-layout">
                        <div className='transaction-column-first-item'>
                            <CustomRepaymentHistoryFormInput control={form.control} typeInfo='debtID' labelInfo='Debt ID' placeholderInfo='Enter your debt ID' formType='add'/>
                            <CustomRepaymentHistoryFormInput control={form.control} typeInfo='typeOfRepayment' labelInfo='Type of Repayment' placeholderInfo='Enter your repayment type' formType='add' options={[
                                {value: 'Normal'},
                                {value: 'Extra'}                                
                            ]}/>

                            <div className='flex flex-row gap-[30px]'>
                                <div className='w-[235px]'>
                                <CustomRepaymentHistoryFormInput control={form.control} typeInfo='repaymentAmount' labelInfo='Repayment Amount' placeholderInfo='Enter your Repayment Amount' formType='add'/>
                                </div>
                                <div className='w-[235px]'>
                                    <CustomRepaymentHistoryFormInput control={form.control} typeInfo='repaymentCurrency' labelInfo='Repayment Currency' placeholderInfo='Enter your Repayment Currency' formType='add' options={currencyOptions}/>
                                </div>
                            </div>

                            <CustomRepaymentHistoryFormInput control={form.control} typeInfo='repaymentProofOfURL' labelInfo='Repayment Proof of URL' placeholderInfo='Enter your Repayment Proof of URL' formType='add'/>
                        </div>

                            <div className='transaction-column-second-item'>
                                <CustomRepaymentHistoryFormInput control={form.control} typeInfo='dateOfRepayment' labelInfo='Date of Repayment' placeholderInfo='Enter your Date of Repayment' formType='add'/>
                                <CustomRepaymentHistoryFormInput control={form.control} typeInfo='receiverID' labelInfo='Receiver ID' placeholderInfo='Enter your Receiver ID' formType='add'/>
                                <CustomRepaymentHistoryFormInput control={form.control} typeInfo='senderID' labelInfo='Sender ID' placeholderInfo='Enter your Sender ID' formType='add'/>
                                <CustomRepaymentHistoryFormInput control={form.control} typeInfo='repaymentStatus' labelInfo='Repayment Status' placeholderInfo='Enter your repayment status' formType='add' options={
                                [
                                    {value: 'Not Paid'},
                                    {value: 'Pending'},
                                    {value: 'Paid'}
                                ]
                            }/>
                            </div>
                        </div>                        

                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Submitting...' : 'Submit'}                            
                        </Button>                    
                    </form>
                </Form>
                </>
                )
            }
        </section>  
    );
}

export default IndividualRepaymentTransactionForm
