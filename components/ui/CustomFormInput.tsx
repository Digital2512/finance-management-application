import React from 'react'
import { z } from "zod"
import { Controller, Control, FieldPath } from "react-hook-form"
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
const CustomFormInput = <FormSchemaType extends z.ZodType<any, any>>(
  {control, typeInfo, labelInfo, placeholderInfo}: 
  CustomInputProps<FormSchemaType>) => {

  return (
    <FormField
      control={control}
      name={typeInfo}
      render={() => (
        <FormItem className='form-item'>
          <FormLabel className='form-label'>{labelInfo}</FormLabel>
          <div className='flex w-full flex-col'>
            <FormControl>
              {typeInfo === 'dateOfBirth' ? (
                <div className="relative">
                  <Controller
                    name="dateOfBirth"
                    control={control}
                    render={({ field }) => (
                      <>
                        <DatePicker
                          placeholderText={placeholderInfo}
                          selected={field.value}
                          onChange={(date) => field.onChange(date)}
                          dateFormat="dd-MM-yyyy"
                          showFullMonthYearPicker
                          className="w-full input-class"
                        />
                        <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                          <Image src={'/icons/calendar-icon.svg'} width={20} height={20} alt='Calendar Icon'/>
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
                      className='input-class'
                      {...field}
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

export default CustomFormInput
