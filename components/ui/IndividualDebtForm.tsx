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
import CustomLoanTransactionFormInput from './CustomLoanTransactionFormInput';
import CustomDebtTransactionFormInput from './CustomDebtTransactionFormInput';
import { debtTransactionFormSchema } from '@/lib/utils'
import axios from 'axios'
import 'react-datepicker/dist/react-datepicker.css';
import { connectToDatabase } from '@/lib/database'
import { useRouter } from 'next/navigation'
import { fetchTransaction } from '@/lib/transaction/fetchTransaction';
import CustomTransactionFormInput from './CustomTransactionFormInput';

interface IndividualTransactionsDetailsProps{
    type: string,
    oldDebtTransactionID?: string,
  }

interface TransactionsIndividualDetails{
    transactionIndividualDetailsName: string, 
    transactionIndividualDetailsDescription: string, 
    transactionIndividualDetailsType: string, 
    transactionIndividualDetailsCurrency: string, 
    transactionIndividualDetailsAmount: number
}

const IndividualDebtTransactionForm = ({ type, oldDebtTransactionID }: IndividualTransactionsDetailsProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    console.log('Type: ', type);
    console.log('Old Transaction ID: ', oldDebtTransactionID || '');
    // const [errorMessage, setErrorMessage] = useState<string | null>(null);
    // const [user, setUser] = useState<any>(null);

    const formSchema = debtTransactionFormSchema();

    // Initialize the form using react-hook-form and Zod resolver
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            debtName: "",
            debtCategory:  "",
            startingDateOfDebt: new Date(),
            debtDescription: "",
            debtCurrency: "USD",
            debtAmount: 0.00,
            // debtTermYear: 0,
            // debtTermMonth: 0,
            interestRate: 0.00,
            interestRateType: "Monthly",
            receiverID: "",
            senderID: "",
            // debtPayerGroup: type === "Group" ? z.string().min(1, {message: 'Group is required'}) : z.string(), "",
            debtPayerGroup: "",
            debtPaymentPlan: "Monthly",
            debtRegularPaymentAmount: 0,
            debtStatus: "Not Paid",
            debtProofOfURL: "Empty",
        },
    });

    const {watch} = form;

    const debtAmount = String(watch('debtAmount')) || '0';
    const interestRate = String(watch('interestRate')) || '0';
    const interestRateType = String(watch('interestRateType')) || 'Monthly';
    const debtRegularPaymentAmount = String(watch('debtRegularPaymentAmount')) || '0';
    const debtPaymentPlan = String(watch('debtPaymentPlan')) || 'Monthly';

    const debtAmountNumber = parseFloat(debtAmount);
    const interestRateNumber = parseFloat(interestRate);
    const debtRegularPaymentAmountNumber = parseFloat(debtRegularPaymentAmount);

    const monthlyInterestRate = useMemo(() => {
        if(interestRateType === 'Yearly'){
            return interestRateNumber / 12 / 100;
        } else if(interestRateType === 'Weekly'){
            return interestRateNumber * 4 / 100;
        } else if(interestRateType === 'Daily'){
            return interestRateNumber * 30 / 100;
        }
        return interestRateNumber / 100;
    }, [interestRateType, interestRateNumber])

    
    const monthlyPayment = useMemo(() => {
        if(debtPaymentPlan === 'Yearly'){
            return debtRegularPaymentAmountNumber / 12;
        } else if(debtPaymentPlan === 'Weekly'){
            return debtRegularPaymentAmountNumber * 4;
        } else if(debtPaymentPlan === 'Daily'){
            return debtRegularPaymentAmountNumber * 30;
        }
        return debtRegularPaymentAmountNumber;
    }, [debtPaymentPlan, debtRegularPaymentAmountNumber])

    const {numberOfPayments, totalInterest, remainderAmount, totalPaid, minimumPayment} = useMemo(() => {
        if(debtAmountNumber <= 0 || debtRegularPaymentAmountNumber <= 0 || monthlyInterestRate <= 0){
            return{
                numberOfPayments: 0, 
                totalInterest: 0, 
                remainderAmount: 0, 
                totalPaid: 0, 
                minimumPayment: 0,
            }
        }
    
        console.log('Amount: ', debtAmountNumber);
        console.log('Monthly Interest Rate: ', monthlyInterestRate);
        console.log('Debt Monthly Payment Amount: ', monthlyPayment);

        const minimumPayment = debtAmountNumber * monthlyInterestRate;

        if(monthlyPayment < minimumPayment){
            return {
                numberOfPayments: 0,
                totalInterest: 0,
                remainderAmount: 0,
                totalPaid: 0,
                minimumPayment
            }
        }else{
            const numberOfPaymentsExact = Math.log(monthlyPayment / (monthlyPayment - (debtAmountNumber * monthlyInterestRate))) / Math.log(1 + monthlyInterestRate);
        console.log('Number of Payments Exact: ', numberOfPaymentsExact);
    
        const hasRemainder = numberOfPaymentsExact % 1 !== 0;
    
        const numberOfPayments = hasRemainder ? Math.ceil(numberOfPaymentsExact) : numberOfPaymentsExact;
        console.log('Number of Payments: ', numberOfPayments);

        const totalInterest = debtAmountNumber * monthlyInterestRate;

        let totalPaid = 0;

        totalPaid = debtAmountNumber + totalInterest;

        console.log('Total Paid: ', totalPaid);
        console.log('Total Interest: ', totalInterest);
    
        // Step 4: Calculate total interest and remainder if there's a partial payment
        let remainderAmount = 0;

        if (hasRemainder) {
            const amountBeforeRemainder = debtRegularPaymentAmountNumber * (numberOfPayments - 1);
            console.log('Amount before remainder: ', amountBeforeRemainder);
    
            remainderAmount = totalPaid - amountBeforeRemainder;
            console.log('Remainder: ', remainderAmount);
        }

        return {numberOfPayments, totalInterest, remainderAmount, totalPaid, minimumPayment: 0};   
        }
    }, [debtAmountNumber, debtRegularPaymentAmountNumber, monthlyInterestRate]);

    useEffect(() => {
        const fetchTransactionData = async (oldDebtTransactionID: string) => {
            try {
                setIsLoading(true);
                const response = await axios.get('/api/transaction/debt/fetchTransaction', {
                    params: { debtTransactionID: oldDebtTransactionID }, 
                });
    
                console.log('Fetch Transaction Response: ', response);
                console.log('Fetch Transaction Data: ', response.data.existingTransactionData);

                const fetchedData = response.data.existingTransactionData;
                console.log('Fetched Data: ', fetchedData);

                fetchedData.startingDateOfDebt = new Date(fetchedData.startingDateOfDebt);
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
    
        if (type === 'edit' && oldDebtTransactionID) {
            fetchTransactionData(oldDebtTransactionID);
        }
    }, [type, oldDebtTransactionID]);

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
        console.log('Data being sent: Name: ', data.debtName, 'Category: ', data.debtCategory);
        setIsLoading(true);
        // setErrorMessage(null);

        try {
            if (type === 'add') {
                console.log('Transaction Addition initiated');

                const loggedInUserID = sessionStorage.getItem('loggedInUserID');

                console.log('Logged In User ID: ', loggedInUserID);

                const loanTransactionData = {
                    userID: loggedInUserID,
                    debtName: data.debtName,
                    debtCategory:  data.debtCategory,
                    startingDateOfDebt: data.startingDateOfDebt,
                    debtDescription: data.debtDescription,
                    debtCurrency: data.debtCurrency,
                    debtAmount: data.debtAmount,
                    // debtTermYear: data.debtTermYear,
                    // debtTermMonth: data.debtTermMonth,
                    interestRate: data.interestRate,
                    interestRateType: data.interestRateType,
                    receiverID: data.receiverID,
                    senderID: data.senderID,
                    debtPayerGroup: data.debtPayerGroup,
                    debtPaymentPlan: data.debtPaymentPlan,
                    debtRegularPaymentAmount: data.debtRegularPaymentAmount,
                    debtStatus: data.debtStatus,
                    debtProofOfURL: data.debtProofOfURL,
                };
                console.log('Add Loan data being sent:', loanTransactionData);

                // Add request
                const response = await axios.post('/api/transaction/debt/add', loanTransactionData);                
                
                console.log(response);

                if(response.status === 200) {
                    // setTransactionData(response.data);
                    alert('Loan Addition successful');
                    router.push('/debts')
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
                    oldDebtTransactionID: oldDebtTransactionID,
                    newDebtName: data.debtName,
                    newDebtCategory:  data.debtCategory,
                    newStartingDateOfDebt: data.startingDateOfDebt,
                    newDebtDescription: data.debtDescription,
                    newDebtCurrency: data.debtCurrency,
                    newDebtAmount: data.debtAmount,
                    // newDebtTermYear: data.debtTermYear,
                    // newDebtTermMonth: data.debtTermMonth,
                    newInterestRate: data.interestRate,
                    newInterestRateType: data.interestRateType,
                    newReceiverID: data.receiverID,
                    newSenderID: data.senderID,
                    newDebtPayerGroup: data.debtPayerGroup,
                    newDebtPaymentPlan: data.debtPaymentPlan,
                    newDebtRegularPaymentAmount: data.debtRegularPaymentAmount,
                    newDebtStatus: data.debtStatus,
                    newDebtProofOfURL: data.debtProofOfURL,
                };
                console.log('Edit Loan data being sent:', loanTransactionData);

                // Edit request
                const response = await axios.post('/api/transaction/debt/edit', loanTransactionData);

                console.log(response);
                
                if(response.status === 200) {
                    // setUser(response.data.loggedInUser);
                    // setUser(response.data);
                    // setTransactionData(response.data);
                    alert('Loan Edit successful');
                    // sessionStorage.setItem('loggedInUser', response.data.loggedInUserInfo)
                    router.push('/debts')
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
                <h1>Debts</h1>
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
                oldDebtTransactionID ? 
                (
                    <>
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="transaction-form-layout">
                        <div className='flex gap-4 my-[10px]'>
                            <h1>Old Debt Transaction ID: {oldDebtTransactionID}</h1>
                        </div>
                        <div className="transaction-form-row-layout">
                        <div className='transaction-column-first-item'>
                            <CustomDebtTransactionFormInput control={form.control} typeInfo='debtName' labelInfo='Debt Name' placeholderInfo='Enter your debt name' formType='edit'/>
                            <CustomDebtTransactionFormInput control={form.control} typeInfo='debtCategory' labelInfo='Debt Category' placeholderInfo='Enter your debt category' formType='edit'/>
                            <CustomDebtTransactionFormInput control={form.control} typeInfo='debtDescription' labelInfo='Debt Description' placeholderInfo='Enter your debt Description' formType='edit'/>

                            {/* <div className='flex flex-row gap-[30px]'>
                                <div className='w-[235px]'>
                                    <CustomDebtTransactionFormInput control={form.control} typeInfo='debtTermYear' labelInfo='Debt Term Year' placeholderInfo='Enter your Year Term' formType='edit'/>
                                </div>
                                <div className='w-[235px]'>
                                    <CustomDebtTransactionFormInput control={form.control} typeInfo='debtTermMonth' labelInfo='Debt Term Month' placeholderInfo='Enter your Month Term' formType='edit'/>
                                </div>
                            </div> */}

                            <div className='flex flex-row gap-[30px]'>
                                <div className='w-[235px]'>
                                    <CustomDebtTransactionFormInput control={form.control} typeInfo='interestRate' labelInfo='Interest Rate Amount' placeholderInfo='Enter your debt Interest Rate Amount' formType='edit' />
                                </div>
                                <div className='w-[235px]'>
                                    <CustomDebtTransactionFormInput control={form.control} typeInfo='interestRateType' labelInfo='Types of Interest Rates' placeholderInfo='Enter your debt Type of Interest Rates' formType='edit' options={
                                        [
                                            {value: "Daily"},
                                            {value: "Weekly"},
                                            {value: "Monthly"},
                                            {value: "Yearly"}
                                        ]
                                    }/>
                                </div>
                            </div>

                            <div className='flex flex-row gap-[30px]'>
                                <div className='w-[235px]'>
                                    <CustomDebtTransactionFormInput control={form.control} typeInfo='debtRegularPaymentAmount' labelInfo='Regular Payment Amount' placeholderInfo='Enter your Regular Amount of Payment' formType='edit'/>
                                </div>
                                <div className='w-[235px]'>
                                    <CustomDebtTransactionFormInput control={form.control} typeInfo='debtPaymentPlan' labelInfo='Payment Plan' placeholderInfo='Enter your Payment Plan' formType='edit'
                                    options={[
                                        {value: 'Weekly'},
                                        {value: 'Biweekly'},
                                        {value: 'Monthly'},
                                        {value: 'Quarterly'},
                                        {value: 'Yearly'}
                                    ]}/>
                                </div>
                            </div>
                            <div className='flex flex-row gap-[30px]'>
                                <div className='w-[325px]'>
                                    <CustomDebtTransactionFormInput control={form.control} typeInfo='debtAmount' labelInfo='Debt Amount' placeholderInfo='Total Amount' formType='edit'/>                                                                                                              
                                </div>
                                <div className='w-[325px]'>
                                    <CustomDebtTransactionFormInput control={form.control} typeInfo='debtCurrency' labelInfo='Debt Currency' placeholderInfo='Enter your Debt Currency' formType='edit' options={currencyOptions}/>
                                </div>
                            </div>
                            <CustomDebtTransactionFormInput control={form.control} typeInfo='debtProofOfURL' labelInfo='Loan Proof of URL' placeholderInfo='Enter your Loan Proof of URL' formType='edit'/>
                            {/*  */}
                        {/* TODO: Have to make it so that the individual details has a button which can be dyanmic and add or decrease based on the details */}
                            </div>
                            <div className='transaction-column-second-item'>
                                <CustomDebtTransactionFormInput control={form.control} typeInfo='startingDateOfDebt' labelInfo='Starting Date of Debt' placeholderInfo='Enter your Date of Debt' formType='edit'/>
                                <CustomDebtTransactionFormInput control={form.control} typeInfo='receiverID' labelInfo='Receiver ID' placeholderInfo='Enter your Receiver ID' formType='edit'/>
                                <CustomDebtTransactionFormInput control={form.control} typeInfo='senderID' labelInfo='Sender ID' placeholderInfo='Enter your Sender ID' formType='edit'/>
                                <CustomDebtTransactionFormInput control={form.control} typeInfo='debtPayerGroup' labelInfo='Group Payer' placeholderInfo='Enter your Group' formType='edit'/>
                                <CustomDebtTransactionFormInput control={form.control} typeInfo='debtStatus' labelInfo='Loan Status' placeholderInfo='Enter your Transaction Status' formType='edit'
                                options={[
                                    {value: 'Not Paid'},
                                    {value: 'In Progress'},
                                    {value: 'Done'}
                                ]}/>
                                <div className='quick-calculation-box'>
                                <h3>Quick Calculation</h3>
                                <p>Debt Amount: ${debtAmountNumber.toFixed(2)}</p>
                                <p>Regular Payment: ${debtRegularPaymentAmountNumber.toFixed(2)} ({debtPaymentPlan})</p>
                                <p>Monthly Payment: ${monthlyPayment.toFixed(2)}</p>
                                <p>Interest Rate: {interestRate}% ({interestRateType})</p>
                                <p>Monthly Interest Rate: {(monthlyInterestRate * 100).toFixed(2)}%</p>
                                <p>Total Interest Paid: ${totalInterest.toFixed(2)}</p>
                                <p>Number of Payments: {numberOfPayments}</p>
                                <p>Last Payment Total: ${remainderAmount.toFixed(2)}</p>
                                {minimumPayment > 0
                                ? 
                                (
                                    <>
                                        <p>Payment amount is not enough</p>
                                        <p>Minimum Payment: ${minimumPayment.toFixed(2)}</p>
                                    </>
                                )
                                :
                                (
                                    <p>Payment amount is enough</p>
                                )
                                }                                
                                <p>Total Paid: ${totalPaid.toFixed(2)}</p>
                                </div>
                                </div>
                        </div>

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
                            <CustomDebtTransactionFormInput control={form.control} typeInfo='debtName' labelInfo='Debt Name' placeholderInfo='Enter your debt name' formType='add'/>
                            <CustomDebtTransactionFormInput control={form.control} typeInfo='debtCategory' labelInfo='Debt Category' placeholderInfo='Enter your debt category' formType='add'/>
                            <CustomDebtTransactionFormInput control={form.control} typeInfo='debtDescription' labelInfo='Debt Description' placeholderInfo='Enter your debt Description' formType='add'/>

                            <div className='flex flex-row gap-[30px]'>
                                <div className='w-[235px]'>
                                    <CustomDebtTransactionFormInput control={form.control} typeInfo='interestRate' labelInfo='Interest Rate Amount' placeholderInfo='Enter your debt Interest Rate Amount' formType='add' />
                                </div>
                                <div className='w-[235px]'>
                                    <CustomDebtTransactionFormInput control={form.control} typeInfo='interestRateType' labelInfo='Types of Interest Rates' placeholderInfo='Enter your debt Type of Interest Rates' formType='add' options={
                                        [
                                            {value: "Daily"},
                                            {value: "Weekly"},
                                            {value: "Monthly"},
                                            {value: "Yearly"}
                                        ]
                                    }/>
                                </div>
                            </div>

                            <div className='flex flex-row gap-[30px]'>
                                <div className='w-[235px]'>
                                <CustomDebtTransactionFormInput control={form.control} typeInfo='debtAmount' labelInfo='Debt Amount' placeholderInfo='Total Amount' formType='add'/>
                                </div>
                                <div className='w-[235px]'>
                                    <CustomDebtTransactionFormInput control={form.control} typeInfo='debtCurrency' labelInfo='Debt Currency' placeholderInfo='Enter your Debt Currency' formType='add' options={currencyOptions}/>
                                </div>
                            </div>

                            <div className='flex flex-row gap-[30px]'>
                                <div className='w-[235px]'>
                                <CustomDebtTransactionFormInput control={form.control} typeInfo='debtRegularPaymentAmount' labelInfo='Regular Payment Amount' placeholderInfo='Enter your Group' formType='add'/>
                                </div>
                                <div className='w-[235px]'>
                                    <CustomDebtTransactionFormInput control={form.control} typeInfo='debtPaymentPlan' labelInfo='Payment Plan' placeholderInfo='Enter your Debt Status' formType='add'
                                    options={[
                                        {value: 'Weekly'},
                                        {value: 'Biweekly'},
                                        {value: 'Monthly'},
                                        {value: 'Quarterly'},
                                        {value: 'Yearly'}
                                    ]}/>
                                </div>
                            </div>
                            <CustomDebtTransactionFormInput control={form.control} typeInfo='debtProofOfURL' labelInfo='Loan Proof of URL' placeholderInfo='Enter your Loan Proof of URL' formType='add'/>
                        </div>

                            <div className='transaction-column-second-item'>
                                <CustomDebtTransactionFormInput control={form.control} typeInfo='startingDateOfDebt' labelInfo='Starting Date of Debt' placeholderInfo='Enter your Date of Debt' formType='add'/>
                                <CustomDebtTransactionFormInput control={form.control} typeInfo='receiverID' labelInfo='Receiver ID' placeholderInfo='Enter your Receiver ID' formType='add'/>
                                <CustomDebtTransactionFormInput control={form.control} typeInfo='senderID' labelInfo='Sender ID' placeholderInfo='Enter your Sender ID' formType='add'/>
                                <CustomDebtTransactionFormInput control={form.control} typeInfo='debtPayerGroup' labelInfo='Group Payer' placeholderInfo='Enter your Group' formType='add'/>
                                <CustomDebtTransactionFormInput control={form.control} typeInfo='debtStatus' labelInfo='Loan Status' placeholderInfo='Enter your Transaction Status' formType='add'
                                options={[
                                    {value: 'Not Paid'},
                                    {value: 'In Progress'},
                                    {value: 'Done'}
                                ]}/>

                                <div className='quick-calculation-box'>
                                <h3>Quick Calculation</h3>
                                <p>Debt Amount: ${debtAmountNumber.toFixed(2)}</p>
                                <p>Regular Payment: ${debtRegularPaymentAmountNumber.toFixed(2)} ({debtPaymentPlan})</p>
                                <p>Monthly Payment: ${monthlyPayment.toFixed(2)}</p>
                                <p>Interest Rate: {interestRate}% ({interestRateType})</p>
                                <p>Monthly Interest Rate: {(monthlyInterestRate * 100).toFixed(2)}%</p>
                                <p>Total Interest Paid: ${totalInterest.toFixed(2)}</p>
                                <p>Number of Payments: {numberOfPayments}</p>
                                <p>Last Payment Total: ${remainderAmount.toFixed(2)}</p>
                                {minimumPayment > 0
                                ? 
                                (
                                    <>
                                        <p>Payment amount is not enough</p>
                                        <p>Minimum Payment: ${minimumPayment.toFixed(2)}</p>
                                    </>
                                )
                                :
                                (
                                    <p>Payment amount is enough</p>
                                )
                                }                                
                                <p>Total Paid: ${totalPaid.toFixed(2)}</p>
                                </div>
                            </div>

                            {/* <CustomDebtTransactionFormInput control={form.control} typeInfo='debtTermYear' labelInfo='Debt Term Year' placeholderInfo='Enter your Year Term' formType='edit'/>
                            <CustomDebtTransactionFormInput control={form.control} typeInfo='debtTermMonth' labelInfo='Debt Term Month' placeholderInfo='Enter your Month Term' formType='edit'/>                             */}
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

export default IndividualDebtTransactionForm
