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
import { savingsTransactionFormSchema } from '@/lib/utils'
import axios from 'axios'
import 'react-datepicker/dist/react-datepicker.css';
import { connectToDatabase } from '@/lib/database'
import { useRouter } from 'next/navigation'
import { fetchTransaction } from '@/lib/transaction/fetchTransaction';
import CustomSavingsTransactionFormInput from './CustomSavingsTransactionFormInput';
import { formatAmount } from '@/lib/utils';

interface IndividualTransactionsDetailsProps{
    type: string,
    oldSavingsTransactionID?: string,
  }

interface TransactionsIndividualDetails{
    transactionIndividualDetailsName: string, 
    transactionIndividualDetailsDescription: string, 
    transactionIndividualDetailsType: string, 
    transactionIndividualDetailsCurrency: string, 
    transactionIndividualDetailsAmount: number
}

const IndividualSavingsTransactionForm = ({ type, oldSavingsTransactionID }: IndividualTransactionsDetailsProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    console.log('Type: ', type);
    console.log('Old Transaction ID: ', oldSavingsTransactionID || '');
    // const [errorMessage, setErrorMessage] = useState<string | null>(null);
    // const [user, setUser] = useState<any>(null);

    const formSchema = savingsTransactionFormSchema();

    // Initialize the form using react-hook-form and Zod resolver
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            savingsName: "",
            savingsCategory: "",
            dateOfSavings: new Date(),
            savingsDescription: "",
            savingsCurrency: "USD",
            savingsTotalAmount: 0,
            savingsGoalTermYear: 0,
            savingsGoalTermMonth: 0,
            savingsGoalDepositAmount: 0,
            savingsDepositAmountType: "Monthly",
            receiverID: "",
            senderID: "",
            savingsStatus: "Not Saved",
            savingsProofOfURL: "Empty",
        },
    });

    const {watch} = form;

    const savingsAmount = String(watch('savingsTotalAmount')) || '0';
    const savingsGoalYear = String(watch('savingsGoalTermYear')) || '0';
    const savingsGoalMonth = String(watch('savingsGoalTermMonth')) || '0';
    const savingsGoalDeposit = String(watch('savingsGoalDepositAmount')) || '0';
    const savingsGoalDepositType = String(watch('savingsDepositAmountType')) || 'Monthly';

    const savingsAmountNumber = parseFloat(savingsAmount);
    const savingsGoalYearNumber = parseFloat(savingsGoalYear);
    const savingsGoalMonthNumber = parseFloat(savingsGoalMonth);
    const savingsGoalDepositNumber = parseFloat(savingsGoalDeposit);

    const monthlyDepositAmount = useMemo(() => {
        var totalMonthlyDepositAmount =  0
        if(savingsGoalDepositType === 'Yearly'){
            totalMonthlyDepositAmount = savingsGoalDepositNumber / 12;
        }else if(savingsGoalDepositType === 'Weekly'){
            totalMonthlyDepositAmount = savingsGoalDepositNumber * 4;
        }else if(savingsGoalDepositType === 'Daily'){
            totalMonthlyDepositAmount = savingsGoalDepositNumber * 30;
        }else{
            totalMonthlyDepositAmount = savingsGoalDepositNumber;
        }

        if(totalMonthlyDepositAmount >= savingsAmountNumber){
            return savingsAmountNumber;
        }else{
            return totalMonthlyDepositAmount
        }
    }, [savingsGoalDepositType, savingsGoalDepositNumber])


    const goalTermMonthConversion = useMemo(() => {
        if(savingsGoalYearNumber === 0 || savingsGoalMonthNumber === 0){
            return 0
        }else{
            const goalYearToMonth = savingsGoalYearNumber / 12;
            const totalGoalTermMonth = goalYearToMonth + savingsGoalMonthNumber;
            return totalGoalTermMonth
        }
    }, [savingsGoalYearNumber, savingsGoalMonthNumber])

    const {numberOfDeposits, remainderAmount, totalDeposited, minimumDeposit, numberOfMonthlyDeposit} = useMemo(() => {
        if(savingsAmountNumber <= 0 || savingsGoalDepositNumber <= 0){
            return{
                numberOfDeposits: 0,
                remainderAmount: 0,
                totalDeposited: 0,
                minimumDeposit: 0,
            }
        }

        console.log('Amount: ', savingsGoalDepositNumber);
        console.log('Monthly Deposit: ', monthlyDepositAmount);

        const minimumDeposit = savingsAmountNumber / goalTermMonthConversion;

        if(savingsGoalDepositNumber < minimumDeposit){
            return{
                numberOfDeposits: 0,
                numberOfMonthlyDeposit: 0,
                totalDeposited: 0,
                remainderAmount:0,
                minimumDeposit
            }
        }else{
            const numberOfDepositExact = savingsAmountNumber / savingsGoalDepositNumber;
            console.log('Number of Deposits Exact: ', numberOfDepositExact);

            const numberOfMonthlyDepositExact = savingsAmountNumber / monthlyDepositAmount;
            console.log('Number of Monthly Deposits Exact: ', numberOfMonthlyDepositExact);
            
            const hasExactRemainder = numberOfDepositExact % 1 !==0;
            const hasMonthlyRemainder = numberOfMonthlyDepositExact % 1 !==0;

            const numberOfMonthlyDeposit = hasMonthlyRemainder ? Math.ceil(numberOfMonthlyDepositExact) : numberOfMonthlyDepositExact

            const numberOfDeposits = hasExactRemainder ? Math.ceil(numberOfDepositExact) : numberOfDepositExact;
            console.log('Number of Deposits: ', numberOfDeposits);

            let totalDeposited = 0;

            totalDeposited = savingsAmountNumber;

            console.log('Total Deposited: ', totalDeposited);

            let remainderAmount = 0;

            if(hasExactRemainder){
                const amountBeforeRemainder = savingsGoalDepositNumber * (numberOfDeposits - 1);
                console.log('Amount before Remainder: ', amountBeforeRemainder);

                remainderAmount = totalDeposited - amountBeforeRemainder;
                console.log('Remainder: ', remainderAmount);
            }

            return {numberOfDeposits, totalDeposited, remainderAmount, minimumDeposit: 0, numberOfMonthlyDeposit}
        }
    }, [savingsAmountNumber, savingsGoalDepositNumber, goalTermMonthConversion, monthlyDepositAmount])

    useEffect(() => {
        const fetchTransactionData = async (oldSavingsTransactionID: string) => {
            try {
                setIsLoading(true);
                const response = await axios.get('/api/transaction/savings/fetchTransaction', {
                    params: { savingsTransactionID: oldSavingsTransactionID }, 
                });
    
                console.log('Fetch Transaction Response: ', response);
                console.log('Fetch Transaction Data: ', response.data.existingTransactionData);

                const fetchedData = response.data.existingTransactionData;
                console.log('Fetched Data: ', fetchedData);

                fetchedData.dateOfSavings = new Date(fetchedData.dateOfSavings);
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
    
        if (type === 'edit' && oldSavingsTransactionID) {
            fetchTransactionData(oldSavingsTransactionID);
        }
    }, [type, oldSavingsTransactionID]);

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
        console.log('Data being sent: Debt ID: ', data.savingsName, 'Type of Repayment: ', data.savingsDepositAmountType, 'Repayment Category: ', data.savingsCategory);
        setIsLoading(true);
        // setErrorMessage(null);

        try {
            if (type === 'add') {
                console.log('Transaction Addition initiated');

                const loggedInUserID = sessionStorage.getItem('loggedInUserID');

                console.log('Logged In User ID: ', loggedInUserID);

                const repaymentTransactionData = {
                    userID: loggedInUserID,
                    savingsName: data.savingsName,
                    savingsCategory: data.savingsCategory,
                    dateOfSavings: data.dateOfSavings,
                    savingsDescription: data.savingsDescription,
                    savingsCurrency: data.savingsCurrency,
                    savingsTotalAmount: data.savingsTotalAmount,
                    savingsGoalTermYear: data.savingsGoalTermYear,
                    savingsGoalTermMonth: data.savingsGoalTermMonth,
                    savingsGoalDepositAmount: data.savingsGoalDepositAmount,
                    savingsDepositAmountType: data.savingsDepositAmountType,
                    receiverID: data.receiverID,
                    senderID: data.senderID,
                    savingsStatus: data.savingsStatus,
                    savingsProofOfURL: data.savingsProofOfURL,
                };
                console.log('Add Repayment data being sent:', repaymentTransactionData);

                // Add request
                const response = await axios.post('/api/transaction/savings/add', repaymentTransactionData);                
                
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

                const savingsTransactionData = {
                    userID: loggedInUserID,
                    oldSavingsTransactionID: oldSavingsTransactionID, 
                    newSavingsName: data.savingsName,
                    newSavingsCategory: data.savingsCategory,
                    newDateOfSavings: data.dateOfSavings,
                    newSavingsDescription: data.savingsDescription,
                    newSavingsCurrency: data.savingsCurrency,
                    newSavingsTotalAmount: data.savingsTotalAmount,
                    newSavingsGoalTermYear: data.savingsGoalTermYear,
                    newSavingsGoalTermMonth: data.savingsGoalTermMonth,
                    newSavingsGoalDepositAmount: data.savingsGoalDepositAmount,
                    newSavingsDepositAmountType: data.savingsDepositAmountType,
                    newReceiverID: data.receiverID,
                    newSenderID: data.senderID,
                    newSavingsStatus: data.savingsStatus,
                    newSavingsProofOfURL: data.savingsProofOfURL,
                };

                console.log('Edit Repayment data being sent:', savingsTransactionData);

                // Edit request
                const response = await axios.post('/api/transaction/savings/edit', savingsTransactionData);

                console.log(response);
                
                if(response.status === 200) {
                    // setUser(response.data.loggedInUser);
                    // setUser(response.data);
                    // setTransactionData(response.data);
                    alert('Savings Edit successful');
                    // sessionStorage.setItem('loggedInUser', response.data.loggedInUserInfo)
                    router.push('/savings')
                } else {
                    // setErrorMessage('Login unsuccessful');
                    alert('Savings Edit unsuccessful');
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
                <h1>Savings</h1>
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
                oldSavingsTransactionID ? 
                (
                    <>
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="transaction-form-layout">
                        <div className='flex gap-4 my-[10px]'>
                            <h1>Old Savings Transaction ID: {oldSavingsTransactionID}</h1>
                        </div>
                        <div className="transaction-form-row-layout">
                    <div className="transaction-form-row-layout">
                        <div className='transaction-column-first-item'>
                            <CustomSavingsTransactionFormInput control={form.control} typeInfo='savingsName' labelInfo='Savings Name' placeholderInfo='Enter your Savings name' formType='edit'/>
                            <CustomSavingsTransactionFormInput control={form.control} typeInfo='savingsCategory' labelInfo='Savings Category' placeholderInfo='Enter your Savings category' formType='edit'/>
                            <CustomSavingsTransactionFormInput control={form.control} typeInfo='savingsDescription' labelInfo='Savings Description' placeholderInfo='Enter your Savings Description' formType='edit'/>                            

                            <div className='flex flex-row gap-[30px]'>
                                <div className='w-[235px]'>
                                    <CustomSavingsTransactionFormInput control={form.control} typeInfo='savingsTotalAmount' labelInfo='Savings Total Amount' placeholderInfo='Enter your Savings Total Amount' formType='edit' />
                                </div>
                                <div className='w-[235px]'>
                                    <CustomSavingsTransactionFormInput control={form.control} typeInfo='savingsCurrency' labelInfo='Savings Currency' placeholderInfo='Enter your Savings Currency' formType='edit' options={currencyOptions}/>
                                </div>

                            </div>
                            
                            <div className='flex flex-row gap-[30px]'>
                            <div className='w-[235px]'>
                                <CustomSavingsTransactionFormInput control={form.control} typeInfo='savingsGoalTermYear' labelInfo='Savings Goal Term Year' placeholderInfo='Enter your Year Term' formType='edit'/>
                            </div>
                            <div className='w-[235px]'>
                                <CustomSavingsTransactionFormInput control={form.control} typeInfo='savingsGoalTermMonth' labelInfo='Savings Goal Term Month' placeholderInfo='Enter your Month Term' formType='edit'/>                            
                            </div>
                            </div>

                            <div className='flex flex-row gap-[30px]'>
                            <div className='w-[235px]'>
                                <CustomSavingsTransactionFormInput control={form.control} typeInfo='savingsGoalDepositAmount' labelInfo='Goal Deposit Amount' placeholderInfo='Enter your Goal Deposit Amount' formType='edit'/>
                            </div>
                            <div className='w-[235px]'>
                                <CustomSavingsTransactionFormInput control={form.control} typeInfo='savingsDepositAmountType' labelInfo='Goal Deposit Frequency' placeholderInfo='Enter your Goal Deposit Frequency' formType='edit' 
                                options={[
                                    {value: 'Daily'},
                                    {value: 'Weekly'},
                                    {value: 'Monthly'},
                                    {value: 'Yearly'}
                                ]}/>                            
                            </div>
                            </div>
                        </div>
                        <div className='transaction-column-second-item'>

                            <CustomSavingsTransactionFormInput control={form.control} typeInfo='receiverID' labelInfo='Receiver ID' placeholderInfo='Enter your Receiver ID' formType='edit'/>
                            <CustomSavingsTransactionFormInput control={form.control} typeInfo='senderID' labelInfo='Sender ID' placeholderInfo='Enter your Sender ID' formType='edit'/>

                            <CustomSavingsTransactionFormInput control={form.control} typeInfo='savingsStatus' labelInfo='Savings Status' placeholderInfo='Enter your Savings Status' formType='edit' options={[
                                {value: 'Not Saved'},
                                {value: 'In Progress'},
                                {value: 'Saved'}
                            ]}/>                            
                            <CustomSavingsTransactionFormInput control={form.control} typeInfo='savingsProofOfURL' labelInfo='Savings Proof of URL' placeholderInfo='Enter your Savings Proof of URL' formType='edit'/>

                            <div className='quick-calculation-box'>
                                <h3>Quick Calculation</h3>
                                <p>Savings Amount: ${savingsAmountNumber.toFixed(2)}</p>
                                <p>Regular Deposit : ${savingsGoalDepositNumber.toFixed(2)} ({savingsGoalDepositType})</p>
                                <p>Monthly Payment: ${monthlyDepositAmount.toFixed(2)}</p>
                                <p>Number of Deposits: {numberOfDeposits} ({savingsGoalDepositType})</p>
                                <p>Number of Monthly Deposits: {numberOfMonthlyDeposit}</p>
                                <p>Last Payment Total: ${remainderAmount.toFixed(2)}</p>
                                {minimumDeposit > 0 ? 
                                (
                                    <>
                                        <p>Deposit is not enough</p>
                                        <p>Minimum Deposit: ${minimumDeposit.toFixed(2)}</p>

                                        <p>If you are unable to raise the deposit, consider raising the goal term</p>
                                    </>
                                ): (
                                    <p>Deposit is enough</p>
                                )}
                                <p>Total Deposited: ${totalDeposited.toFixed(2)}</p>
                            </div>
                        </div>
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
                    <div className="transaction-form-row-layout">
                        <div className='transaction-column-first-item'>
                            <CustomSavingsTransactionFormInput control={form.control} typeInfo='savingsName' labelInfo='Savings Name' placeholderInfo='Enter your Savings name' formType='add'/>
                            <CustomSavingsTransactionFormInput control={form.control} typeInfo='savingsCategory' labelInfo='Savings Category' placeholderInfo='Enter your Savings category' formType='add'/>
                            <CustomSavingsTransactionFormInput control={form.control} typeInfo='savingsDescription' labelInfo='Savings Description' placeholderInfo='Enter your Savings Description' formType='add'/> 

                            <div className='flex flex-row gap-[30px]'>
                                <div className='w-[235px]'>
                                    <CustomSavingsTransactionFormInput control={form.control} typeInfo='savingsTotalAmount' labelInfo='Savings Total Amount' placeholderInfo='Enter your Savings Total Amount' formType='add' />
                                </div>
                                <div className='w-[235px]'>
                                    <CustomSavingsTransactionFormInput control={form.control} typeInfo='savingsCurrency' labelInfo='Savings Currency' placeholderInfo='Enter your Savings Currency' formType='add' options={currencyOptions}/>
                                </div>

                            </div>
                            
                            <div className='flex flex-row gap-[30px]'>
                            <div className='w-[235px]'>
                                <CustomSavingsTransactionFormInput control={form.control} typeInfo='savingsGoalTermYear' labelInfo='Savings Goal Term Year' placeholderInfo='Enter your Year Term' formType='add'/>
                            </div>
                            <div className='w-[235px]'>
                                <CustomSavingsTransactionFormInput control={form.control} typeInfo='savingsGoalTermMonth' labelInfo='Savings Goal Term Month' placeholderInfo='Enter your Month Term' formType='add'/>                            
                            </div>
                            </div>

                            <div className='flex flex-row gap-[30px]'>
                            <div className='w-[235px]'>
                                <CustomSavingsTransactionFormInput control={form.control} typeInfo='savingsGoalDepositAmount' labelInfo='Goal Deposit Amount' placeholderInfo='Enter your Goal Deposit Amount' formType='add'/>
                            </div>
                            <div className='w-[235px]'>
                                <CustomSavingsTransactionFormInput control={form.control} typeInfo='savingsDepositAmountType' labelInfo='Goal Deposit Frequency' placeholderInfo='Enter your Goal Deposit Frequency' formType='add' 
                                options={[
                                    {value: 'Daily'},
                                    {value: 'Weekly'},
                                    {value: 'Monthly'},
                                    {value: 'Yearly'}
                                ]}/>                            
                            </div>
                            </div>
                        </div>
                        <div className='transaction-column-second-item'>

                            <CustomSavingsTransactionFormInput control={form.control} typeInfo='receiverID' labelInfo='Receiver ID' placeholderInfo='Enter your Receiver ID' formType='add'/>
                            <CustomSavingsTransactionFormInput control={form.control} typeInfo='senderID' labelInfo='Sender ID' placeholderInfo='Enter your Sender ID' formType='add'/>

                            <CustomSavingsTransactionFormInput control={form.control} typeInfo='savingsStatus' labelInfo='Savings Status' placeholderInfo='Enter your Savings Status' formType='add' options={[
                                {value: 'Not Saved'},
                                {value: 'In Progress'},
                                {value: 'Saved'}
                            ]}/>                            
                            <CustomSavingsTransactionFormInput control={form.control} typeInfo='savingsProofOfURL' labelInfo='Savings Proof of URL' placeholderInfo='Enter your Savings Proof of URL' formType='add'/>

                            <div className='quick-calculation-box'>
                                <h3>Quick Calculation</h3>
                                <p>Savings Amount: ${savingsAmountNumber.toFixed(2)}</p>
                                <p>Regular Deposit : ${savingsGoalDepositNumber.toFixed(2)} ({savingsGoalDepositType})</p>
                                <p>Monthly Payment: ${monthlyDepositAmount.toFixed(2)}</p>
                                <p>Number of Deposits: {numberOfDeposits} ({savingsGoalDepositType})</p>
                                <p>Number of Monthly Deposits: {numberOfMonthlyDeposit}</p>
                                <p>Last Payment Total: ${remainderAmount.toFixed(2)}</p>
                                {minimumDeposit > 0 ? 
                                (
                                    <>
                                        <p>Deposit is not enough</p>
                                        <p>Minimum Deposit: ${minimumDeposit.toFixed(2)}</p>

                                        <p>If you are unable to raise the deposit, consider raising the goal term</p>
                                    </>
                                ): (
                                    <p>Deposit is enough</p>
                                )}
                                <p>Total Deposited: ${totalDeposited.toFixed(2)}</p>
                            </div>
                        </div>
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

export default IndividualSavingsTransactionForm
