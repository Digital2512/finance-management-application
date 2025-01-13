import React from 'react'
import { z } from "zod"
import { Controller, Control, FieldPath, useFormContext} from "react-hook-form"
import { Input } from "@/components/ui/input"
import DatePicker from "react-datepicker"
import Image from 'next/image'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import "react-datepicker/dist/react-datepicker.css" // Make sure this CSS is imported

// Define the component
const CustomSavingsTransactionFormInput = <FormSchemaType extends z.ZodType<any, any>>(
  {control, typeInfo, labelInfo, placeholderInfo, formType, options}: 
  CustomTransactionInputProps<FormSchemaType>) => {

  
  const {setValue, getValues, formState: {dirtyFields}} = useFormContext();
  const isNumericField = ['savingsTotalAmount', 'savingsGoalTermYear', 'savingsGoalTermMonth', 'savingsGoalDepositAmount'].includes(typeInfo);

  const handleDateChange = (field: any, date: Date | null) => {
    const formattedDate = date ? new Date(date) : null;
    field.onChange(formattedDate);
  }

  const isFieldDirty = dirtyFields[typeInfo]; 

  return (
    <FormField
      control={control}
      name={typeInfo}
      render={() => (
        <FormItem className='transaction-form-item'>
          <FormLabel className='transaction-form-label'>{labelInfo}</FormLabel>
          <div className='flex w-full flex-col'>
            <FormControl>
            {options ? (
                /* Dropdown logic goes here */
                <Controller
                  name={typeInfo}
                  control={control}
                  render={({ field }) => (
                    <select {...field} className="input-class w-full h-[40px]">
                      <option value="" disabled>
                      {placeholderInfo}
                      </option>
                      {options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.value}
                        </option>
                      ))}
                    </select>
                  )}
                />
              ) : typeInfo === "dateOfSavings" ? (
                <div className="relative">
                  <Controller
                    name={typeInfo}
                    control={control} 
                    render={({ field }) => (
                      <>
                        <DatePicker
                          placeholderText={placeholderInfo}
                          selected={ new Date(field.value)
                            // formType === "edit" && field.value
                            //   ? new Date(field.value)
                            //   : null
                          }
                          onChange={(date) => handleDateChange(field, date)}
                          dateFormat="dd-MM-yyyy"
                          showFullMonthYearPicker
                          className="input-class w-[300px] h-[40px] max-md:w-[445px]"
                        />
                        <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                          <Image
                            src={"/icons/calendar-icon.svg"}
                            width={20}
                            height={20}
                            alt="Calendar Icon"
                          />
                        </span>
                      </>
                    )}
                  />
                </div>
              ) : (
                <Controller
                  name={typeInfo}
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder={placeholderInfo}
                      className="input-class"
                      {...field}
                      value={
                        formType === "edit" && !isFieldDirty
                          ? field.value
                          : getValues(typeInfo) || ""
                      }
                      onChange={(e) =>{
                        const inputValue = e.target.value;

                        if(isNumericField){
                          if(/^-?\d*\.?\d*$/.test(inputValue) || inputValue === ''){
                            field.onChange(inputValue);
                          }
                        }else{
                          field.onChange(inputValue)
                        }
                      }
                      }
                    />
                  )}
                />
              )}
            </FormControl>
            <FormMessage className='form-message mt-2'/>
          </div>
        </FormItem>
      )}
    />
  )
}

export default CustomSavingsTransactionFormInput
