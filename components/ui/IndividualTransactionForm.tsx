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
import CustomTransactionFormInput from './CustomTransactionFormInput'
import { transactionFormSchema, authFormSchema } from '@/lib/utils'
import axios from 'axios'
import 'react-datepicker/dist/react-datepicker.css';
import { connectToDatabase } from '@/lib/database'
import { useRouter } from 'next/navigation'
import { fetchTransaction } from '@/lib/transaction/fetchTransaction';

interface IndividualTransactionsDetailsProps{
    type: string,
    oldTransactionID?: string,
  }

interface TransactionsIndividualDetails{
    transactionIndividualDetailsName: string, 
    transactionIndividualDetailsDescription: string, 
    transactionIndividualDetailsType: string, 
    transactionIndividualDetailsCurrency: string, 
    transactionIndividualDetailsAmount: number
}

const IndividualTransactionForm = ({ type, oldTransactionID }: IndividualTransactionsDetailsProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [transactionIndividualDetails, setTransactionIndividualDetails] = useState<TransactionsIndividualDetails[]>([{
        transactionIndividualDetailsName: '', 
        transactionIndividualDetailsDescription: '', 
        transactionIndividualDetailsType: '', 
        transactionIndividualDetailsCurrency: '', 
        transactionIndividualDetailsAmount: 0
    }])

    console.log('Type: ', type);
    console.log('Old Transaction ID: ', oldTransactionID || '');
    // const [errorMessage, setErrorMessage] = useState<string | null>(null);
    // const [user, setUser] = useState<any>(null);

    const formSchema = transactionFormSchema();

    const addTransactionIndividualDetailsRow = () => {
        setTransactionIndividualDetails([...transactionIndividualDetails, {transactionIndividualDetailsName: '', transactionIndividualDetailsDescription: '', transactionIndividualDetailsType: '', transactionIndividualDetailsCurrency: '', transactionIndividualDetailsAmount: 0}])
    }

    const deleteTransactionIndividualDetailsRow = (index: number) => {
        setTransactionIndividualDetails(transactionIndividualDetails.filter((_, i) => i !== index));
    }

    const handleIndividualTransactionDetailChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, field: keyof TransactionsIndividualDetails, value: string | number) => {
        if(e){
            const updatedDetails = transactionIndividualDetails.map((detail, i) => 
                i === index ? {...detail, [field]: value} : detail
            );
                setTransactionIndividualDetails(updatedDetails);
        }
    };

    // Initialize the form using react-hook-form and Zod resolver
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            transactionName: "",
            transactionCategory: "",
            dateOfTransaction: new Date(),
            transactionDescription: "",
            receiverID: "",
            senderID: "",
            transactionCurrency: "USD",
            transactionIndividualDetails: [],
            transactionType: "Expense",
            transactionStatus: "Not Paid",
            transactionPlannedCycleType: "One-Time",
            transactionPlannedCycle: "None",
            transactionPlannedCycleDate: new Date(),
            transactionProofOfURL: "Empty",
            totalAmountOfTransaction: 0
            // username: "",
            // email: "",
            // password: "",
            // firstName: "",
            // lastName: "",
            // addressLine1: "",
            // addressLine2: "",
            // addressLine3: "",
            // city: "",
            // state: "",
            // postalCode: "",
            // dateOfBirth: new Date(), 
            // country: "",
            // selectedPlan: ""
        },
    });

    useEffect(() => {
        const fetchTransactionData = async (oldTransactionID: string) => {
            try {
                setIsLoading(true);
                const response = await axios.get('/api/transaction/fetchTransaction', {
                    params: { transactionID: oldTransactionID }, 
                });
    
                console.log('Fetch Transaction Response: ', response);
                console.log('Fetch Transaction Data: ', response.data.existingTransactionData);

                const fetchedData = response.data.existingTransactionData;
                console.log('Fetched Data: ', fetchedData);

                Object.keys(fetchedData).forEach((key) => {
                    if (key !== 'transactionIndividualDetails') {
                        form.setValue(key as keyof z.infer<typeof formSchema>, fetchedData[key]);
                        // console.log('Updated form values:', form.watch());
                    }
                });

                setTransactionIndividualDetails(
                    fetchedData.transactionIndividualDetails.map((detail: any) => ({
                        transactionIndividualDetailsName: detail.nameOfTransactionIndividual || "",
                        transactionIndividualDetailsDescription: detail.descriptionOfTransactionIndividual || "",
                        transactionIndividualDetailsType: detail.typeOfTransactionIndividual || "",
                        transactionIndividualDetailsCurrency: detail.individualTransactionCurrency || "",
                        transactionIndividualDetailsAmount: detail.amountOfTransactionIndividual || 0,
                })));

                // setTransactionData(response.data.existingTransactionData);
            } catch (error) {
                console.log('Error in fetching data: ', error);
                alert('Error in fetching data');
                setIsLoading(false);
            } finally {
                setIsLoading(false);
            }
        };
    
        if (type === 'edit' && oldTransactionID) {
            fetchTransactionData(oldTransactionID);
        }
    }, [type, oldTransactionID]);
    

    // Submit handler for form
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        console.log('Submit button clicked');
        console.log('Data being sent: Name: ', data.transactionName, 'Category: ', data.transactionCategory);
        setIsLoading(true);
        // setErrorMessage(null);

        try {
            if (type === 'add') {
                console.log('Transaction Addition initiated');
                console.log('Transaction Individual Details: ', transactionIndividualDetails);
                const formattedTransactionDetails = transactionIndividualDetails.map(detail => ({
                    nameOfTransactionIndividual: detail.transactionIndividualDetailsName,
                    descriptionOfTransactionIndividual: detail.transactionIndividualDetailsDescription,
                    typeOfTransactionIndividual: detail.transactionIndividualDetailsType,
                    amountOfTransactionIndividual: detail.transactionIndividualDetailsAmount,
                    individualTransactionCurrency: detail.transactionIndividualDetailsCurrency
                }));                
                const loggedInUserID = sessionStorage.getItem('loggedInUserID');

                console.log('Logged In User ID: ', loggedInUserID);

                const transactionData = {
                    userID: loggedInUserID,
                    transactionName: data.transactionName,
                    transactionCategory: data.transactionCategory,
                    dateOfTransaction: data.dateOfTransaction,
                    transactionDescription: data.transactionDescription,
                    receiverID: data.receiverID,
                    senderID: data.senderID,
                    transactionCurrency: data.transactionCurrency,
                    transactionIndividualDetails: formattedTransactionDetails,
                    transactionType: data.transactionType,
                    transactionStatus: data.transactionStatus,
                    transactionCycleType: data.transactionPlannedCycleType,
                    transactionPlannedCycle: data.transactionPlannedCycle,
                    transactionPlannedCycleDate: data.transactionPlannedCycleDate,
                    transactionProofURL: data.transactionProofOfURL,
                    totalAmountOfTransaction: data.totalAmountOfTransaction
                };
                console.log('Add Transaction data being sent:', transactionData);

                // Add request
                const response = await axios.post('/api/transaction/add', transactionData);                
                
                console.log(response);

                if(response.status === 200) {
                    // setTransactionData(response.data);
                    alert('Transaction Addition successful');
                    router.push('/income-expense')
                } else if (response.status === 400 || response.status === 500){
                    alert('Transaction Addition unsuccessful');
                }
            }

            if (type === 'edit') {
                console.log('Transaction Edit initiated');
                const formattedTransactionDetails = transactionIndividualDetails.map(detail => ({
                    nameOfTransactionIndividual: detail.transactionIndividualDetailsName,
                    descriptionOfTransactionIndividual: detail.transactionIndividualDetailsDescription,
                    typeOfTransactionIndividual: detail.transactionIndividualDetailsType,
                    amountOfTransactionIndividual: detail.transactionIndividualDetailsAmount,
                    individualTransactionCurrency: detail.transactionIndividualDetailsCurrency
                }));                
                const loggedInUserID = sessionStorage.getItem('loggedInUserID');

                console.log('Logged In User ID: ', loggedInUserID);

                console.log('Data received from form: ', data);

                const transactionData = {
                    userID: loggedInUserID,
                    oldTransactionID: oldTransactionID,
                    newTransactionName: data.transactionName,
                    newTransactionCategory: data.transactionCategory,
                    newDateOfTransaction: data.dateOfTransaction,
                    newTransactionDescription: data.transactionDescription,
                    newReceiverID: data.receiverID,
                    newSenderID: data.senderID,
                    newTransactionCurrency: data.transactionCurrency,
                    newTransactionIndividualDetails: formattedTransactionDetails,
                    newTransactionType: data.transactionType,
                    newTransactionStatus: data.transactionStatus,
                    newTransactionCycleType: data.transactionPlannedCycleType,
                    newTransactionPlannedCycle: data.transactionPlannedCycle,
                    newTransactionPlannedCycleDate: data.transactionPlannedCycleDate,
                    newTransactionProofURL: data.transactionProofOfURL,
                    newTotalAmountOfTransaction: data.totalAmountOfTransaction
                };
                console.log('Edit Transaction data being sent:', transactionData);

                // Edit request
                const response = await axios.post('/api/transaction/edit', transactionData);

                console.log(response);
                
                if(response.status === 200) {
                    // setUser(response.data.loggedInUser);
                    // setUser(response.data);
                    // setTransactionData(response.data);
                    alert('Transaction Edit successful');
                    // sessionStorage.setItem('loggedInUser', response.data.loggedInUserInfo)
                    router.push('/transactionHistory')
                } else {
                    // setErrorMessage('Login unsuccessful');
                    alert('Transaction Edit unsuccessful');
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
                <h1>Transactions</h1>
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
                oldTransactionID ? 
                (
                    <>
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="transaction-form-layout">
                        <div className='flex gap-4 my-[10px]'>
                            <h1>Old Transaction ID: {oldTransactionID}</h1>
                        </div>
                        <div className="transaction-form-row-layout">
                        <div className='transaction-column-first-item'>
                            <CustomTransactionFormInput control={form.control} typeInfo='transactionName' labelInfo='Transaction Name' placeholderInfo='Enter your transaction name' formType='edit'/>
                            <CustomTransactionFormInput control={form.control} typeInfo='transactionCategory' labelInfo='Transaction Category' placeholderInfo='Enter your category' formType='edit'/>
                            <CustomTransactionFormInput control={form.control} typeInfo='transactionDescription' labelInfo='Transaction Description' placeholderInfo='Enter your Description' formType='edit'/>
                            <CustomTransactionFormInput control={form.control} typeInfo='transactionType' labelInfo='Transaction Type' placeholderInfo='Enter your Transaction Type' formType='edit'/>
                            <CustomTransactionFormInput control={form.control} typeInfo='transactionProofOfURL' labelInfo='Transaction Proof of URL' placeholderInfo='Enter your Transaction Proof URL' formType='edit'/>
                            <CustomTransactionFormInput control={form.control} typeInfo='transactionPlannedCycleType' labelInfo='Transaction Planned Cycle Type' placeholderInfo='Enter your Transaction Planned Cycle Type' formType='edit'/>
                            <CustomTransactionFormInput control={form.control} typeInfo='transactionPlannedCycle' labelInfo='Transaction Planned Cycle' placeholderInfo='Enter your Transaction Planned Cycle' formType='edit'/>
                            </div>
                            <div className='transaction-column-second-item'>
                            <CustomTransactionFormInput control={form.control} typeInfo='receiverID' labelInfo='Receiver ID' placeholderInfo='Enter your Receiver ID' formType='edit'/>
                            <CustomTransactionFormInput control={form.control} typeInfo='senderID' labelInfo='Sender ID' placeholderInfo='Enter your Sender ID' formType='edit'/>
                            <CustomTransactionFormInput control={form.control} typeInfo='transactionCurrency' labelInfo='Transaction Currency' placeholderInfo='Enter your Transaction Currency' formType='edit'/>
                            <CustomTransactionFormInput control={form.control} typeInfo='transactionStatus' labelInfo='Transaction Status' placeholderInfo='Enter your Transaction Status' formType='edit'/>
                            <CustomTransactionFormInput control={form.control} typeInfo='totalAmountOfTransaction' labelInfo='Total Amount' placeholderInfo='Total Amount' formType='edit'/>                                                    
                            <CustomTransactionFormInput control={form.control} typeInfo='dateOfTransaction' labelInfo='Date of Transaction' placeholderInfo='Enter your Date of Transaction' formType='edit'/>
                            <CustomTransactionFormInput control={form.control} typeInfo='transactionPlannedCycleDate' labelInfo='Transaction Planned Cycle Date' placeholderInfo='Enter your Transaction Planned Cycle Date' formType='edit'/>
                            </div>
                        </div>
                            {/*  */}
                        {/* TODO: Have to make it so that the individual details has a button which can be dyanmic and add or decrease based on the details */}

                        <div className="my-6"></div> {/* Adds margin on the y-axis */}

                        <table className='transaction-table padding-[10px]'>
                            <thead>
                                <tr>
                                    <th>Edit Name</th>
                                    <th>Description</th>
                                    <th>Type</th>
                                    <th>Currency</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactionIndividualDetails.map((transactionIndividualDetail, index) => (
                                    <tr key={index}>
                                    <td className='input-td w-[200px]'>
                                        <input
                                        type="text"
                                        value={transactionIndividualDetail.transactionIndividualDetailsName}
                                        onChange={(e) => handleIndividualTransactionDetailChange(e, index, 'transactionIndividualDetailsName', e.target.value)}
                                        className='w-[200px]'
                                        />
                                    </td>
                                    <td className='input-td w-[400px]'>
                                        <input
                                        type="text"
                                        value={transactionIndividualDetail.transactionIndividualDetailsDescription}
                                        onChange={(e) => handleIndividualTransactionDetailChange(e, index, 'transactionIndividualDetailsDescription', e.target.value)}
                                        className='w-[400px]'
                                        />
                                    </td>
                                    <td className='input-td w-[100px]'>
                                        <input
                                        type="text"
                                        value={transactionIndividualDetail.transactionIndividualDetailsType}
                                        onChange={(e) => handleIndividualTransactionDetailChange(e, index, 'transactionIndividualDetailsType', e.target.value)}
                                        className='w-[100px]'
                                        />
                                    </td>
                                    <td className='input-td w-[100px]'>
                                        <input
                                        type="text"
                                        value={transactionIndividualDetail.transactionIndividualDetailsCurrency}
                                        onChange={(e) => handleIndividualTransactionDetailChange(e, index, 'transactionIndividualDetailsCurrency', e.target.value)}
                                        className='w-[100px]'
                                        />
                                    </td>
                                    <td className='input-td w-[75px]'>
                                        <input
                                        type="number"
                                        value={transactionIndividualDetail.transactionIndividualDetailsAmount}
                                        onChange={(e) => handleIndividualTransactionDetailChange(e, index, 'transactionIndividualDetailsAmount', e.target.value)}
                                        className='w-[75px]'
                                        />
                                    </td>
                                    <td className='button-td'>
                                        <button type="button" className='remove-button' onClick={() => deleteTransactionIndividualDetailsRow(index)}>
                                        Remove
                                        </button>
                                    </td>
                                    </tr>
                                ))}
                                <tr>
                                    <td colSpan={5}>
                                        <button type="button" onClick={() => addTransactionIndividualDetailsRow()}>
                                            Add
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

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
                            <CustomTransactionFormInput control={form.control} typeInfo='transactionName' labelInfo='Transaction Name' placeholderInfo='Enter your transaction name' formType='add'/>
                            <CustomTransactionFormInput control={form.control} typeInfo='transactionCategory' labelInfo='Transaction Category' placeholderInfo='Enter your category' formType='add'/>
                            <CustomTransactionFormInput control={form.control} typeInfo='transactionDescription' labelInfo='Transaction Description' placeholderInfo='Enter your Description' formType='add'/>
                            <CustomTransactionFormInput control={form.control} typeInfo='transactionType' labelInfo='Transaction Type' placeholderInfo='Enter your Transaction Type' formType='add'/>
                            <CustomTransactionFormInput control={form.control} typeInfo='transactionProofOfURL' labelInfo='Transaction Proof of URL' placeholderInfo='Enter your Transaction Proof URL' formType='add'/>
                            <CustomTransactionFormInput control={form.control} typeInfo='transactionPlannedCycleType' labelInfo='Transaction Planned Cycle Type' placeholderInfo='Enter your Transaction Planned Cycle Type' formType='add'/>
                            <CustomTransactionFormInput control={form.control} typeInfo='transactionPlannedCycle' labelInfo='Transaction Planned Cycle' placeholderInfo='Enter your Transaction Planned Cycle' formType='add'/>
                            </div>
                            <div className='transaction-column-second-item'>
                            <CustomTransactionFormInput control={form.control} typeInfo='receiverID' labelInfo='Receiver ID' placeholderInfo='Enter your Receiver ID' formType='add'/>
                            <CustomTransactionFormInput control={form.control} typeInfo='senderID' labelInfo='Sender ID' placeholderInfo='Enter your Sender ID' formType='add'/>
                            <CustomTransactionFormInput control={form.control} typeInfo='transactionCurrency' labelInfo='Transaction Currency' placeholderInfo='Enter your Transaction Currency' formType='add'/>
                            <CustomTransactionFormInput control={form.control} typeInfo='transactionStatus' labelInfo='Transaction Status' placeholderInfo='Enter your Transaction Status' formType='add'/>
                            <CustomTransactionFormInput control={form.control} typeInfo='totalAmountOfTransaction' labelInfo='Total Amount' placeholderInfo='Total Amount' formType='add'/>                                                    
                            <CustomTransactionFormInput control={form.control} typeInfo='dateOfTransaction' labelInfo='Date of Transaction' placeholderInfo='Enter your Date of Transaction' formType='add'/>
                            <CustomTransactionFormInput control={form.control} typeInfo='transactionPlannedCycleDate' labelInfo='Transaction Planned Cycle Date' placeholderInfo='Enter your Transaction Planned Cycle Date' formType='add'/>
                            </div>
                        </div>

                        {/* <div className="transaction-form-row-layout">
                            <div className='transaction-column-first-item'>
                            <CustomTransactionFormInput control={form.control} typeInfo='transactionDescription' labelInfo='Transaction Description' placeholderInfo='Enter your Transaction Description' />
                            <CustomTransactionFormInput control={form.control} typeInfo='transactionProofOfURL' labelInfo='Transaction Proof of URL' placeholderInfo='Enter your Transaction Proof URL' />
                            </div>
                            <div className='transaction-column-second-item'>
                            <CustomTransactionFormInput control={form.control} typeInfo='transactionCurrency' labelInfo='Transaction Currency' placeholderInfo='Enter your Transaction Currency' />
                            <CustomTransactionFormInput control={form.control} typeInfo='totalAmountOfTransaction' labelInfo='Total Amount' placeholderInfo='Total Amount' />                        
                            </div>
                        </div>

                        <div className="transaction-form-row-layout">
                            <div className='transaction-column-first-item'>
                            <CustomTransactionFormInput control={form.control} typeInfo='transactionType' labelInfo='Transaction Type' placeholderInfo='Enter your Transaction Type' />
                            <CustomTransactionFormInput control={form.control} typeInfo='transactionPlannedCycle' labelInfo='Transaction Planned Cycle' placeholderInfo='Enter your Transaction Planned Cycle' />
                            </div>
                            <div className='transaction-column-second-item'>
                            <CustomTransactionFormInput control={form.control} typeInfo='dateOfTransaction' labelInfo='Date of Transaction' placeholderInfo='Enter your Date of Transaction' />
                            <CustomTransactionFormInput control={form.control} typeInfo='transactionPlannedCycleDate' labelInfo='Transaction Planned Cycle Date' placeholderInfo='Enter your Transaction Planned Cycle Date' />
                            </div>
                        </div> */}
                            
                        {/* TODO: Have to make it so that the individual details has a button which can be dyanmic and add or decrease based on the details */}
                        {/* <CustomTransactionFormInput control={form.control} typeInfo='transactionIndividualDetails' labelInfo='Transaction Individual Details' placeholderInfo='Enter your Transaction Details' /> */}

                        <div className="my-6"></div> {/* Adds margin on the y-axis */}

                        <table className='transaction-table padding-[10px]'>
                            <thead>
                                <tr>
                                    <th>Add Name</th>
                                    <th>Description</th>
                                    <th>Type</th>
                                    <th>Currency</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactionIndividualDetails.map((transactionIndividualDetail, index) => (
                                    <tr key={index}>
                                    <td className='input-td w-[200px]'>
                                        <input
                                        type="text"
                                        value={transactionIndividualDetail.transactionIndividualDetailsName}
                                        onChange={(e) => handleIndividualTransactionDetailChange(e, index, 'transactionIndividualDetailsName', e.target.value)}
                                        className='w-[200px]'
                                        />
                                    </td>
                                    <td className='input-td w-[400px]'>
                                        <input
                                        type="text"
                                        value={transactionIndividualDetail.transactionIndividualDetailsDescription}
                                        onChange={(e) => handleIndividualTransactionDetailChange(e, index, 'transactionIndividualDetailsDescription', e.target.value)}
                                        className='w-[400px]'
                                        />
                                    </td>
                                    <td className='input-td w-[100px]'>
                                        <input
                                        type="text"
                                        value={transactionIndividualDetail.transactionIndividualDetailsType}
                                        onChange={(e) => handleIndividualTransactionDetailChange(e, index, 'transactionIndividualDetailsType', e.target.value)}
                                        className='w-[100px]'
                                        />
                                    </td>
                                    <td className='input-td w-[100px]'>
                                        <input
                                        type="text"
                                        value={transactionIndividualDetail.transactionIndividualDetailsCurrency}
                                        onChange={(e) => handleIndividualTransactionDetailChange(e, index, 'transactionIndividualDetailsCurrency', e.target.value)}
                                        className='w-[100px]'
                                        />
                                    </td>
                                    <td className='input-td w-[75px]'>
                                        <input
                                        type="number"
                                        value={transactionIndividualDetail.transactionIndividualDetailsAmount}
                                        onChange={(e) => handleIndividualTransactionDetailChange(e, index, 'transactionIndividualDetailsAmount', e.target.value)}
                                        className='w-[75px]'
                                        />
                                    </td>
                                    <td className='button-td'>
                                        <button type="button" className='remove-button' onClick={() => deleteTransactionIndividualDetailsRow(index)}>
                                        Remove
                                        </button>
                                    </td>
                                    </tr>
                                ))}
                                <tr>
                                    <td colSpan={5}>
                                        <button type="button" onClick={() => addTransactionIndividualDetailsRow()}>
                                            Add
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        {/* <CustomTransactionFormInput control={form.control} typeInfo='dateOfTransaction' labelInfo='Date of Transaction' placeholderInfo='Enter your Date of Transaction' /> */}

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

export default IndividualTransactionForm
