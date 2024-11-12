import TransactionsTable from '@/components/ui/TransactionsTable'
import React from 'react'

const incomeExpensePage = () => {
  const dummyTransactions: TransactionDetails[] = [
    {
      transactionID: "tx001",
      name: "Grocery Store",
      type: "expense",
      accountId: "acc123",
      amount: 56.75,
      pending: false,
      category: "Groceries",
      date: "2024-10-25T13:30:00Z",
      image: "https://example.com/images/receipt1.jpg",
      $createdAt: "2024-10-25T13:00:00Z",
      senderAccountID: "acc123",
      receiverAccountID: "store567",
    },
    {
      transactionID: "tx002",
      name: "Freelance Payment",
      type: "income",
      accountId: "acc456",
      amount: 1500.00,
      pending: false,
      category: "Income",
      date: "2024-10-24T10:15:00Z",
      image: "https://example.com/images/invoice1.jpg",
      $createdAt: "2024-10-24T09:45:00Z",
      senderAccountID: "client789",
      receiverAccountID: "acc456",
    },
    {
      transactionID: "tx003",
      name: "Electricity Bill",
      type: "expense",
      accountId: "acc123",
      amount: 120.40,
      pending: true,
      category: "Utilities",
      date: "2024-10-22T08:00:00Z",
      image: "https://example.com/images/bill1.jpg",
      $createdAt: "2024-10-22T07:30:00Z",
      senderAccountID: "acc123",
      receiverAccountID: "utilityCompany234",
    },
    {
      transactionID: "tx004",
      name: "Coffee Shop",
      type: "expense",
      accountId: "acc123",
      amount: 8.25,
      pending: false,
      category: "Dining",
      date: "2024-10-23T15:45:00Z",
      image: "https://example.com/images/coffee.jpg",
      $createdAt: "2024-10-23T15:30:00Z",
      senderAccountID: "acc123",
      receiverAccountID: "cafe567",
    },
    {
      transactionID: "tx005",
      name: "Salary Deposit",
      type: "income",
      accountId: "acc456",
      amount: 3000.00,
      pending: false,
      category: "Salary",
      date: "2024-10-20T09:00:00Z",
      image: "https://example.com/images/paystub.jpg",
      $createdAt: "2024-10-20T08:30:00Z",
      senderAccountID: "employer123",
      receiverAccountID: "acc456",
    },
  ];
  
  return (
    <TransactionsTable Transactions={dummyTransactions}></TransactionsTable>
  )
}

export default incomeExpensePage