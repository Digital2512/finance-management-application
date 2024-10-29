'use client'

import React, { useState } from 'react'
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
import CustomFormInput from './CustomFormInput'
import { authFormSchema } from '@/app/lib/utils'
import axios from 'axios'
import 'react-datepicker/dist/react-datepicker.css';
import { connectToDatabase } from '@/app/lib/database'

const AuthForm = ({ type }: { type: string }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);

    // Schema for form validation using Zod
    const formSchema = authFormSchema(type);

    // Initialize the form using react-hook-form and Zod resolver
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            firstName: "",
            lastName: "",
            addressLine1: "",
            addressLine2: "",
            addressLine3: "",
            city: "",
            state: "",
            postalCode: "",
            dateOfBirth: new Date(), 
            country: "",
            selectedPlan: ""
        },
    });

    // Submit handler for form
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        console.log('Submit button clicked');
        setIsLoading(true);
        setErrorMessage(null);

        try {
            if (type === 'register') {
                console.log('Registration initiated');
                const userData = {
                    username: data.username,
                    email: data.email,
                    password: data.password,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    addressLine1: data.addressLine1,
                    addressLine2: data.addressLine2,
                    addressLine3: data.addressLine3,
                    city: data.city,
                    state: data.state,
                    postalCode: data.postalCode,
                    dateOfBirth: data.dateOfBirth,
                    country: data.country,
                    selectedPlan: data.selectedPlan
                };
                console.log('User data being sent:', userData);

                // Register request
                // const response = await axios.post('/api/auth/register', userData);
                const response = await axios.post('/api/auth/register', userData);                
                console.log(response);

                // await connectToDatabase();


                
                // if(response.status === 200) {
                //     setUser(response.data);
                //     alert('User registered successfully');
                // } else {
                //     setErrorMessage('User registration unsuccessful');
                // }
            }

            if (type === 'login') {
                console.log('Login initiated');
                const userData = {
                    username: data.username,
                    password: data.password,
                };
                console.log('User data being sent:', userData);

                // Login request
                const response = await axios.post('/api/auth/login', userData);
                
                if(response.status === 200) {
                    setUser(response.data);
                    alert('Login successful');
                } else {
                    setErrorMessage('Login unsuccessful');
                }
            }
        } catch (error: any) {
            console.log('Error:', error);
            setErrorMessage(error.response?.data?.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="auth-form">
            <header className="flex flex-col gap-5 md:gap-8">
                <Link href="/" className="flex cursor-pointer items-center gap-1 px-4">
                    <Image
                        src="/icons/logo-wallet-blue.svg"
                        width={34}
                        height={34}
                        alt="WalletWiz Logo"
                    />
                    <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">WalletWiz</h1>
                </Link>

                <div className="flex flex-col gap-1 px-4 md:gap-3">
                    <h1 className='text-24 lg:text-36 font-semibold text-gray-900'>
                        {user
                        ? 'Link Account'
                        : type === 'login'
                            ? 'Login'
                            : 'Register' }
                    </h1>
                    <p className='text-16 font-normal text-gray-600'>
                        {user
                        ? 'Link your account to get started'
                        : 'Please enter your details'}
                    </p>
                </div>
            </header>
            {user 
            ? (
                <div className="flex flex-col gap-4">
                    {/* Links */}
                </div>
            )
            :  (
                <>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 px-4">
                        <div className='flex gap-4'>
                            <CustomFormInput control={form.control} typeInfo='username' labelInfo='Username' placeholderInfo='Enter your username' />
                            <CustomFormInput control={form.control} typeInfo='password' labelInfo='Password' placeholderInfo='Enter your password' />
                        </div>
                        {type === 'register' && (
                            <>
                            <div className="flex gap-4">
                                <CustomFormInput control={form.control} typeInfo='firstName' labelInfo='First Name' placeholderInfo='Enter your First Name' />
                                <CustomFormInput control={form.control} typeInfo='lastName' labelInfo='Last Name' placeholderInfo='Enter your Last Name' />
                            </div>
                            <CustomFormInput control={form.control} typeInfo='email' labelInfo='Email' placeholderInfo='Enter your Email' />
                            <CustomFormInput control={form.control} typeInfo='addressLine1' labelInfo='Address Line 1' placeholderInfo='Enter your Address Line 1' />
                            <CustomFormInput control={form.control} typeInfo='addressLine2' labelInfo='Address Line 2' placeholderInfo='Enter your Address Line 2' />
                            <CustomFormInput control={form.control} typeInfo='addressLine3' labelInfo='Address Line 3' placeholderInfo='Enter your Address Line 3' />
                            <div className='flex gap-4'>
                                <CustomFormInput control={form.control} typeInfo='city' labelInfo='City' placeholderInfo='Enter your City' />
                                <CustomFormInput control={form.control} typeInfo='state' labelInfo='State' placeholderInfo='Enter your State' />
                            </div>
                            <div className='flex gap-4'>
                                <CustomFormInput control={form.control} typeInfo='postalCode' labelInfo='Postal Code' placeholderInfo='Enter your Postal Code' />
                                <CustomFormInput control={form.control} typeInfo='country' labelInfo='Country' placeholderInfo='Enter your Country' />
                            </div>
                            <CustomFormInput control={form.control} typeInfo='dateOfBirth' labelInfo='Date of Birth' placeholderInfo='Enter your Date of Birth' />
                            <CustomFormInput control={form.control} typeInfo='selectedPlan' labelInfo='Plan' placeholderInfo='Enter your Selected Plan' />
                            </>
                        )}

                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Submitting...' : 'Submit'}
                        </Button>
                    </form>
                </Form>
                </>
            )}
        </section>  
    );
}

export default AuthForm;
