/* eslint-disable no-prototype-builtins */
import { type ClassValue, clsx } from "clsx";
import qs from "query-string";
import { twMerge } from "tailwind-merge";
import { z } from "zod";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// FORMAT DATE TIME
export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    month: "short", // abbreviated month name (e.g., 'Oct')
    day: "numeric", // numeric day of the month (e.g., '25')
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };

  const dateDayOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    year: "numeric", // numeric year (e.g., '2023')
    month: "2-digit", // abbreviated month name (e.g., 'Oct')
    day: "2-digit", // numeric day of the month (e.g., '25')
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    month: "short", // abbreviated month name (e.g., 'Oct')
    year: "numeric", // numeric year (e.g., '2023')
    day: "numeric", // numeric day of the month (e.g., '25')
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };

  const formattedDateTime: string = new Date(dateString).toLocaleString(
    "en-US",
    dateTimeOptions
  );

  const formattedDateDay: string = new Date(dateString).toLocaleString(
    "en-US",
    dateDayOptions
  );

  const formattedDate: string = new Date(dateString).toLocaleString(
    "en-US",
    dateOptions
  );

  const formattedTime: string = new Date(dateString).toLocaleString(
    "en-US",
    timeOptions
  );

  return {
    dateTime: formattedDateTime,
    dateDay: formattedDateDay,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

export function formatAmount(amount: number): string {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  return formatter.format(amount);
}

export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));

export const removeSpecialCharacters = (value: string) => {
  return value.replace(/[^\w\s]/gi, "");
};

interface UrlQueryParams {
  params: string;
  key: string;
  value: string;
}

export function formUrlQuery({ params, key, value }: UrlQueryParams) {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
}

export function getAccountTypeColors(type: AccountTypes) {
  switch (type) {
    case "depository":
      return {
        bg: "bg-blue-25",
        lightBg: "bg-blue-100",
        title: "text-blue-900",
        subText: "text-blue-700",
      };

    case "credit":
      return {
        bg: "bg-success-25",
        lightBg: "bg-success-100",
        title: "text-success-900",
        subText: "text-success-700",
      };

    default:
      return {
        bg: "bg-green-25",
        lightBg: "bg-green-100",
        title: "text-green-900",
        subText: "text-green-700",
      };
  }
}

export function countTransactionCategories(
  transactions: Transaction[]
): CategoryCount[] {
  const categoryCounts: { [category: string]: number } = {};
  let totalCount = 0;

  // Iterate over each transaction
  transactions &&
    transactions.forEach((transaction) => {
      // Extract the category from the transaction
      const category = transaction.transactionCategory;

      // If the category exists in the categoryCounts object, increment its count
      if (categoryCounts.hasOwnProperty(category)) {
        categoryCounts[category]++;
      } else {
        // Otherwise, initialize the count to 1
        categoryCounts[category] = 1;
      }

      // Increment total count
      totalCount++;
    });

  // Convert the categoryCounts object to an array of objects
  const aggregatedCategories: CategoryCount[] = Object.keys(categoryCounts).map(
    (category) => ({
      name: category,
      count: categoryCounts[category],
      totalCount,
    })
  );

  // Sort the aggregatedCategories array by count in descending order
  aggregatedCategories.sort((a, b) => b.count - a.count);

  return aggregatedCategories;
}

export function extractCustomerIdFromUrl(url: string) {
  // Split the URL string by '/'
  const parts = url.split("/");

  // Extract the last part, which represents the customer ID
  const customerId = parts[parts.length - 1];

  return customerId;
}

export function encryptId(id: string) {
  return btoa(id);
}

export function decryptId(id: string) {
  return atob(id);
}

export const getTransactionStatus = (date: Date) => {
  const today = new Date();
  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(today.getDate() - 2);

  return date > twoDaysAgo ? "Processing" : "Success";
};

export const authFormSchema = (type: string) => z.object({
  firstName: type === "register" ? z.string().min(3, "First name must be at least 3 characters") : z.string().optional(),
  lastName: type === "register" ? z.string().min(3, "Last name must be at least 3 characters") : z.string().optional(),
  email: type === "register" ? z.string().email("Invalid email format") : z.string().optional(),
  addressLine1: type === "register" ? z.string().min(5, "Address line 1 must be at least 5 characters") : z.string().optional(),
  addressLine2: type === "register" ? z.string().min(5, "Address line 2 must be at least 5 characters") : z.string().optional(),
  addressLine3: type === "register" ? z.string().min(5, "Address line 3 must be at least 5 characters") : z.string().optional(),
  city: type === "register" ? z.string().min(1, "City is required") : z.string().optional(),
  state: type === "register" ? z.string().min(4, "State must be at least 4 characters") : z.string().optional(),
  postalCode: type === "register" ? z.string().length(6, "Postal code must be exactly 6 characters") : z.string().optional(),
  country: type === "register" ? z.string().min(4, "Country must be at least 4 characters") : z.string().optional(),
  dateOfBirth: type === "register" ? z.date().refine((date) => !isNaN(date.getTime()), {
    message: "Invalid date format",
  }) : z.date().optional(),
  selectedPlan: type === "register" ? z.string().min(5, "Selected plan must be at least 5 characters") : z.string().optional(),

  username: z
    .string()
    .min(8, "Username must be at least 8 characters long"),

  password: z
    .string()
    .min(12, "Password must be at least 12 characters long")
    .regex(/[A-Z]/, "Password must have at least one uppercase letter")
    .regex(/\d/, "Password must have at least one number")
    .regex(/[@$!%*?&.]/, "Password must have at least one special character"),
});

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
] as const;

const transactionIndividualDetailsSchema = z.object({
  nameOfTransactionIndividual: z.string().default('Undefined'),
  descriptionOfTransactionIndividual: z.string().default('Undefined'),
  typeOfTransactionIndividual: z.enum(['Income', 'Expense']),
  amountOfTransactionIndividual: z.number().min(0),
  individualTransactionCurrency: z.enum(currencyCodes)
});
export const transactionFormSchema = () => z.object({
  // transactionID: type === 'edit' ? z.string().min(1, {message: 'Old Transaction ID is required'}) : z.string().optional(),
  transactionName: z.string().min(1, {message: 'Name is required'}),
  transactionCategory: z.string().min(1, {message: 'Category is required'}),
  dateOfTransaction: z.date().default(new Date()),
  transactionDescription: z.string().min(1, {message: 'Description is required'}),
  receiverID: z.string().min(1, {message: 'Receiver ID is required'}),
  senderID: z.string().min(1, {message: 'Sender ID is required'}),
  // receiverID: z.union([z.string(), z.object({})]),
  // senderID: z.union([z.string(), z.object({})]),
  transactionCurrency: z.enum(currencyCodes),
  transactionIndividualDetails: z.array(transactionIndividualDetailsSchema),
  transactionType: z.enum(['Income', 'Expense']).default('Expense'),
  transactionStatus: z.enum(['Not Paid', 'Pending', 'Paid']).default('Not Paid'),
  transactionPlannedCycleType: z.enum(['One-Time', 'Recurring']).default('One-Time'),
  transactionPlannedCycle: z.enum(['None', 'Daily', 'Weekly', 'Monthly', 'Yearly']).default('None'),
  transactionPlannedCycleDate: z.date().optional(),
  transactionProofOfURL: z.string().default('Empty'),
  totalAmountOfTransaction: z.number().default(0),
});
// .refine(
//   data => {
//     const calculatedTotalAmount = data.transactionIndividualDetails.reduce(
//       (acc, detail) => acc + (detail.amountOfTransactionIndividual || 0),
//       0
//     );

//     return data.totalAmountOfTransaction = calculatedTotalAmount;
//   },
//   {
//     message: "Total amount mismatch or calculation error",
//   });

