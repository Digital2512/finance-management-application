'use client'

import React from 'react'
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
import CustomLoanTransactionFormInput from './CustomLoanTransactionFormInput';
import { loanTransactionFormSchema } from '@/lib/utils'
import axios from 'axios'
import 'react-datepicker/dist/react-datepicker.css';
import { connectToDatabase } from '@/lib/database'
import { useRouter } from 'next/navigation'
import { fetchTransaction } from '@/lib/transaction/fetchTransaction';
import CustomTransactionFormInput from './CustomTransactionFormInput';

interface IndividualTransactionsDetailsProps{
    type: string,
    oldLoanTransactionID?: string,
  }

interface TransactionsIndividualDetails{
    transactionIndividualDetailsName: string, 
    transactionIndividualDetailsDescription: string, 
    transactionIndividualDetailsType: string, 
    transactionIndividualDetailsCurrency: string, 
    transactionIndividualDetailsAmount: number
}

const IndividualLoanTransactionForm = ({ type, oldLoanTransactionID }: IndividualTransactionsDetailsProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    console.log('Type: ', type);
    console.log('Old Transaction ID: ', oldLoanTransactionID || '');
    // const [errorMessage, setErrorMessage] = useState<string | null>(null);
    // const [user, setUser] = useState<any>(null);

    const formSchema = loanTransactionFormSchema();

    // Initialize the form using react-hook-form and Zod resolver
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            loanName: "",
            loanCategory: "",
            startingDateOfLoan: new Date(),
            loanDescription: "",
            loanCurrency: "USD",
            loanAmount: 0,
            loanTermYear: 0,
            loanTermMonth: 0,
            interestRateAmount: 0,
            typeOfInterest: "Monthly",
            receiverID: "",
            senderID: "",
            loanStatus: "Not Paid",
            loanProofOfURL: "Empty",
        },
    });

    useEffect(() => {
        const fetchTransactionData = async (oldLoanTransactionID: string) => {
            try {
                setIsLoading(true);
                const response = await axios.get('/api/transaction/loan/fetchTransaction', {
                    params: { loanTransactionID: oldLoanTransactionID }, 
                });
    
                console.log('Fetch Transaction Response: ', response);
                console.log('Fetch Transaction Data: ', response.data.existingTransactionData);

                const fetchedData = response.data.existingTransactionData;
                console.log('Fetched Data: ', fetchedData);

                fetchedData.dateOfTransaction = new Date(fetchedData.dateOfTransaction);
                fetchedData.transactionPlannedCycleDate = new Date(fetchedData.transactionPlannedCycleDate);
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
    
        if (type === 'edit' && oldLoanTransactionID) {
            fetchTransactionData(oldLoanTransactionID);
        }
    }, [type, oldLoanTransactionID]);

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
        console.log('Data being sent: Name: ', data.loanName, 'Category: ', data.loanCategory);
        setIsLoading(true);
        // setErrorMessage(null);

        try {
            if (type === 'add') {
                console.log('Transaction Addition initiated');

                const loggedInUserID = sessionStorage.getItem('loggedInUserID');

                console.log('Logged In User ID: ', loggedInUserID);

                const loanTransactionData = {
                    userID: loggedInUserID,
                    loanName: data.loanName,
                    loanCategory: data.loanCategory,
                    startingDateOfLoan: data.startingDateOfLoan,
                    loanDescription: data.loanDescription,
                    loanCurrency: data.loanCurrency,
                    loanAmount: data.loanAmount,
                    loanTermYear: data.loanTermYear,
                    loanTermMonth: data.loanTermMonth,
                    interestRateAmount: data.interestRateAmount,
                    typeOfInterest: data.typeOfInterest,
                    receiverID: data.receiverID,
                    senderID: data.senderID,
                    loanStatus: data.loanStatus,
                    loanProofOfURL: data.loanProofOfURL
                };
                console.log('Add Loan data being sent:', loanTransactionData);

                // Add request
                const response = await axios.post('/api/transaction/loan/add', loanTransactionData);                
                
                console.log(response);

                if(response.status === 200) {
                    // setTransactionData(response.data);
                    alert('Loan Addition successful');
                    router.push('/loans')
                } else if (response.status === 400 || response.status === 500){
                    alert('Loan Addition unsuccessful');
                }
            }

            if (type === 'edit') {
                console.log('Loan Edit initiated');

                const loggedInUserID = sessionStorage.getItem('loggedInUserID');

                console.log('Logged In User ID: ', loggedInUserID);

                console.log('Data received from form: ', data);

                const loanTransactionData = {
                    userID: loggedInUserID,
                    oldLoanTransactionID: oldLoanTransactionID,
                    newLoanName: data.loanName,
                    newLoanCategory: data.loanCategory,
                    newStartingDateOfLoan: data.startingDateOfLoan,
                    newLoanDescription: data.loanDescription,
                    newLoanCurrency: data.loanCurrency,
                    newLoanAmount: data.loanAmount,
                    newLoanTermYear: data.loanTermYear,
                    newLoanTermMonth: data.loanTermMonth,
                    newInterestRateAmount: data.interestRateAmount,
                    newTypeOfInterest: data.typeOfInterest,
                    newReceiverID: data.receiverID,
                    newSenderID: data.senderID,
                    newLoanStatus: data.loanStatus,
                    newLoanProofOfURL: data.loanProofOfURL
                };
                console.log('Edit Loan data being sent:', loanTransactionData);

                // Edit request
                const response = await axios.post('/api/transaction/loan/edit', loanTransactionData);

                console.log(response);
                
                if(response.status === 200) {
                    // setUser(response.data.loggedInUser);
                    // setUser(response.data);
                    // setTransactionData(response.data);
                    alert('Loan Edit successful');
                    // sessionStorage.setItem('loggedInUser', response.data.loggedInUserInfo)
                    router.push('/loans')
                } else {
                    // setErrorMessage('Login unsuccessful');
                    alert('Loan Edit unsuccessful');
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
                oldLoanTransactionID ? 
                (
                    <>
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="transaction-form-layout">
                        <div className='flex gap-4 my-[10px]'>
                            <h1>Old Loan Transaction ID: {oldLoanTransactionID}</h1>
                        </div>
                        <div className="transaction-form-row-layout">
                        <div className='transaction-column-first-item'>
                            <CustomLoanTransactionFormInput control={form.control} typeInfo='loanName' labelInfo='Loan Name' placeholderInfo='Enter your loan name' formType='edit'/>
                            <CustomLoanTransactionFormInput control={form.control} typeInfo='loanCategory' labelInfo='Loan Category' placeholderInfo='Enter your loan category' formType='edit'/>
                            <CustomLoanTransactionFormInput control={form.control} typeInfo='loanDescription' labelInfo='Loan Description' placeholderInfo='Enter your loan Description' formType='edit'/>

                            <CustomLoanTransactionFormInput control={form.control} typeInfo='interestRateAmount' labelInfo='Interest Rate Amount' placeholderInfo='Enter your Loan Interest Rate Amount' formType='edit' />
                            <CustomLoanTransactionFormInput control={form.control} typeInfo='typeOfInterest' labelInfo='Types of Intest Rates' placeholderInfo='Enter your Loan Type of Interest Rates' formType='edit' options={
                                [
                                    {value: "Daily"},
                                    {value: "Weekly"},
                                    {value: "Monthly"},
                                    {value: "Yearly"}
                                ]
                            }/>
                            </div>
                            <div className='transaction-column-second-item'>
                            <CustomLoanTransactionFormInput control={form.control} typeInfo='receiverID' labelInfo='Receiver ID' placeholderInfo='Enter your Receiver ID' formType='edit'/>
                            <CustomLoanTransactionFormInput control={form.control} typeInfo='senderID' labelInfo='Sender ID' placeholderInfo='Enter your Sender ID' formType='edit'/>

                            <CustomLoanTransactionFormInput control={form.control} typeInfo='loanTermYear' labelInfo='Loan Term Year' placeholderInfo='Enter your Year Term' formType='edit'/>
                            <CustomLoanTransactionFormInput control={form.control} typeInfo='loanTermMonth' labelInfo='Loan Term Month' placeholderInfo='Enter your Month Term' formType='edit'/>                            

                            <CustomLoanTransactionFormInput control={form.control} typeInfo='loanCurrency' labelInfo='Loan Currency' placeholderInfo='Enter your Transaction Currency' formType='edit' options={currencyOptions}/>                            
                            <CustomLoanTransactionFormInput control={form.control} typeInfo='loanAmount' labelInfo='Loan Amount' placeholderInfo='Total Amount' formType='edit'/>                                                    
                            </div>
                        </div>
                            <CustomLoanTransactionFormInput control={form.control} typeInfo='startingDateOfLoan' labelInfo='Starting Date of Loan' placeholderInfo='Enter your Date of Transaction' formType='edit'/>
                            <CustomLoanTransactionFormInput control={form.control} typeInfo='loanStatus' labelInfo='Loan Status' placeholderInfo='Enter your Transaction Status' formType='edit'
                            options={[
                                {value: 'Not Paid'},
                                {value: 'In Progress'},
                                {value: 'Done'}
                            ]}/>
                        <CustomLoanTransactionFormInput control={form.control} typeInfo='loanProofOfURL' labelInfo='Loan Proof of URL' placeholderInfo='Enter your Loan Proof URL' formType='edit'/>
                            {/*  */}
                        {/* TODO: Have to make it so that the individual details has a button which can be dyanmic and add or decrease based on the details */}

                        <Button type="submit" disabled={isLoading}>
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
                            <CustomLoanTransactionFormInput control={form.control} typeInfo='loanName' labelInfo='Loan Name' placeholderInfo='Enter your loan name' formType='add'/>
                            <CustomLoanTransactionFormInput control={form.control} typeInfo='loanCategory' labelInfo='Loan Category' placeholderInfo='Enter your loan category' formType='add'/>
                            <CustomLoanTransactionFormInput control={form.control} typeInfo='loanDescription' labelInfo='Loan Description' placeholderInfo='Enter your loan Description' formType='add'/>

                            <CustomLoanTransactionFormInput control={form.control} typeInfo='interestRateAmount' labelInfo='Interest Rate Amount' placeholderInfo='Enter your Loan Interest Rate Amount' formType='add' />
                            <CustomLoanTransactionFormInput control={form.control} typeInfo='typeOfInterest' labelInfo='Types of Intest Rates' placeholderInfo='Enter your Loan Type of Interest Rates' formType='add' options={
                                [
                                    {value: "Daily"},
                                    {value: "Weekly"},
                                    {value: "Monthly"},
                                    {value: "Yearly"}
                                ]
                            }/>
                            </div>
                            <div className='transaction-column-second-item'>
                            <CustomLoanTransactionFormInput control={form.control} typeInfo='receiverID' labelInfo='Receiver ID' placeholderInfo='Enter your Receiver ID' formType='add'/>
                            <CustomLoanTransactionFormInput control={form.control} typeInfo='senderID' labelInfo='Sender ID' placeholderInfo='Enter your Sender ID' formType='add'/>

                            <CustomLoanTransactionFormInput control={form.control} typeInfo='loanTermYear' labelInfo='Loan Term Year' placeholderInfo='Enter your Year Term' formType='add'/>
                            <CustomLoanTransactionFormInput control={form.control} typeInfo='loanTermMonth' labelInfo='Loan Term Month' placeholderInfo='Enter your Month Term' formType='add'/>                            

                            <CustomLoanTransactionFormInput control={form.control} typeInfo='loanCurrency' labelInfo='Loan Currency' placeholderInfo='Enter your Transaction Currency' formType='add' options={currencyOptions}/>                            
                            <CustomLoanTransactionFormInput control={form.control} typeInfo='loanAmount' labelInfo='Loan Amount' placeholderInfo='Total Amount' formType='add'/>                                                    
                            </div>
                        </div>
                            <CustomLoanTransactionFormInput control={form.control} typeInfo='startingDateOfLoan' labelInfo='Starting Date of Loan' placeholderInfo='Enter your Date of Transaction' formType='add'/>
                            <CustomLoanTransactionFormInput control={form.control} typeInfo='loanStatus' labelInfo='Loan Status' placeholderInfo='Enter your Transaction Status' formType='add'
                            options={[
                                {value: 'Not Paid'},
                                {value: 'In Progress'},
                                {value: 'Done'}
                            ]}/>
                        <CustomLoanTransactionFormInput control={form.control} typeInfo='loanProofOfURL' labelInfo='Loan Proof of URL' placeholderInfo='Enter your Loan Proof URL' formType='add'/>

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

export default IndividualLoanTransactionForm
