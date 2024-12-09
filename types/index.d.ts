/* eslint-disable no-unused-vars */

declare type SearchParamProps = {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

// ========================================

declare type SignUpParams = {
  firstName: string;
  lastName: string;
  address1: string;
  city: string;
  state: string;
  postalCode: string;
  dateOfBirth: string;
  ssn: string;
  email: string;
  password: string;
};

declare type LoginUser = {
  email: string;
  password: string;
};

declare type User = {
  userID: string;
  username: string;
  // password: string;
  email: string;
  // MUST DO: FIND AN APP WHICH ALLOWS FOR BANK ACCOUNT CONNECTION TO THE APP
  // dwollaCustomerUrl: string;
  // dwollaCustomerId: string;
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  city: string;
  state: string;
  postalCode: string;
  dateOfBirth: Date;
  selectedPlan: string;
  // ssn: string;
  // goals: Goals[];
  // friends: [];
  // groups: [];
};

declare type Goals = {
  goalName: string;
  goalType: string;
  goalCurrentAmount: number;
  goalAmount: number;
}

declare type NewUserParams = {
  userId: string;
  email: string;
  name: string;
  password: string;
};

declare type Account = {
  id: string;
  availableBalance: number;
  currentBalance: number;
  officialName: string;
  mask: string;
  institutionId: string;
  name: string;
  type: string;
  subtype: string;
  // appwriteItemId: string;
  accountSharableId: string;
};

// declare type TransactionDetails = {
//   transactionID: string;
//   // $id: string;
//   name: string;
//   // paymentChannel: string;
//   type: string;
//   accountId: string;
//   amount: number;
//   pending: boolean;
//   category: string;
//   date: string;
//   image: string;
//   // type: string;
//   $createdAt: string;
//   // channel: string;
//   senderAccountID: string;
//   receiverAccountID: string;
// };

declare type Bank = {
  $id: string;
  accountId: string;
  bankId: string;
  accessToken: string;
  fundingSourceUrl: string;
  userId: string;
  bankSharableId: string;
  typeOfAccount: string;
  typeOfCard: string;
  cardNumber: string;
  expiryDate: string;
};

declare type bankCardDetails = {
  name: string;
  currentBalance: number;
  cardNumber: string;
  expiryDate: string;
  typeOfAccount: string;
  typeOfCard: string;
  mask: string;
};

declare type AccountTypes =
  | "depository"
  | "credit"
  | "loan "
  | "investment"
  | "other";

declare type Category = "Food and Drink" | "Travel" | "Transfer";

declare type CategoryCount = {
  name: string;
  count: number;
  totalCount: number;
};

declare type Receiver = {
  firstName: string;
  lastName: string;
};

declare type TransferParams = {
  sourceFundingSourceUrl: string;
  destinationFundingSourceUrl: string;
  amount: string;
};

declare type AddFundingSourceParams = {
  dwollaCustomerId: string;
  processorToken: string;
  bankName: string;
};

declare type NewDwollaCustomerParams = {
  firstName: string;
  lastName: string;
  email: string;
  type: string;
  address1: string;
  city: string;
  state: string;
  postalCode: string;
  dateOfBirth: string;
  ssn: string;
};

declare type Badges = {
   name: string;
   userID: string;
   scoreExp: number;
}

declare type Challenges = {
  name: string;
  userID: string;
  scorePoints: number;
}

declare type Community = {
  name: string;
  userID: string;
  scoreExp: number;
}

//DATABASE IMPLEMENTATION: After database implementation, maybe could cross reference it with the user database using the user id and just take the data from there, 
//which means that the friends array in the user interface could just be an array filled with user IDs
declare type Friend = {
  userID: number;
  name: string;
  img: string;
}

//DATABASE IMPLEMENTATION: After database implementation, maybe could cross reference it with the group database using the group id and just take the data from there
//which means that the friends array in the user interface could just be an array filled with group IDs
declare type Group = {
  groupID: number;
  name: string;
  type: string;
  members: Friend[];
  inviteCode?: string;
  img: string;
}


declare type LeaderboardProfile = {
  name: string;
  location: string;
  scoreExp: number;
  img: string;
  dateLastUpdated: Date;
  badges: Badges[];       
  challenges: Challenges[]; 
  community: Community[];   
};


declare interface BankCardProps {
  bankCardDetails: bankCardDetails[];
  userName: string;
  showBalance?: boolean;
}

declare interface BankInfoProps {
  account: Account;
  // appwriteItemId?: string;
  type: "full" | "card";
}

declare interface HeaderBoxProps {
  type?: "title" | "greeting";
  title: string;
  subtext: string;
  user?: string;
}

declare interface PageHeaderProps {
  topTitle: string;
  bottomTitle: string;
  topDescription: string;
  bottomDescription: string;
  connectBank?: boolean;
}

declare interface PaginationProps {
  page: number;
  totalPages: number;
}

declare interface PlaidLinkProps {
  user: User;
  variant?: "primary" | "ghost";
  dwollaCustomerId?: string;
}

// declare type User = sdk.Models.Document & {
//   accountId: string;
//   email: string;
//   name: string;
//   items: string[];
//   accessToken: string;
//   image: string;
// };

declare type SocialListUser = {
  userID: number;
  username: string;
  level: number;
  friends: Friend[];
  groups: Group[];
}

declare interface AuthFormProps {
  type: "sign-in" | "sign-up";
}

declare interface BankDropdownProps {
  accounts: Account[];
  setValue?: UseFormSetValue<any>;
  otherStyles?: string;
}

declare interface BankTabItemProps {
  account: Account;
  // appwriteItemId?: string;
}

declare interface ExpenseBoxProps {
  accounts: Account[];
  totalBanks: number;
  totalLeftToSpendBalance: number;
  expenseData: Expenses[];
}

type Expenses = {
  category: string;
  amount: number;
};

type BoxOverviewData = {
  category: string;
  amount: number;
};

type BoxOverviewTextData = {
  name: string,
  category: string, 
  amount: number,
  fillColor: string,
}  

declare interface DoughnutChartProps {
  doughnutChartData: BoxOverviewTextData[];
  chartOverviewType: string,
}

declare interface BoxOverviewProps {
  accounts: Account[];
  totalBanks: number;
  totalLeftBalance: number;
  boxData: BoxOverviewData[];
  boxTextData: BoxOverviewTextData[];
  typeBox: string;
}

declare interface SavingsBoxProps {
  accounts: Account[];
  totalBanks: number;
  totalLeftToSaveBalance: number;
  savingsData: Savings[];
}

type Savings = {
  category: string;
  amount: number;
};

declare interface DebtsBoxProps {
  accounts: Account[];
  totalBanks: number;
  totalLeftToPayBalance: number;
  debtsData : Debts[];
}

  type Debts = {
    category: string;
    amount: number;
  };

declare interface FooterProps {
  user: User;
}

declare interface RightSidebarProps {
  user: User;
  transactions: Transaction[];
  bankAccounts: Bank[] & Account[];
  goalsTracker: Goals[];
}

declare type SidebarUser = {
  username: string;
  firstName: string;
  lastName: string;
  selectedPlan: string;
}

declare interface SidebarProps {
  user: SidebarUser
}

declare type MobileNavUser = {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  selectedPlan: string;
}

declare interface MobileNavProps {
  user: MobileNavUser
}


declare interface RecentTransactionsProps {
  accounts: Account[];
  transactions: Transaction[];
  // appwriteItemId: string;
  page: number;
}

declare interface TransactionHistoryTableProps {
  transactions: Transaction[];
  page: number;
}

declare interface CategoryBadgeProps {
  category: string;
}

declare interface TransactionTableProps {
  Transactions: Transaction[];
}

declare interface CategoryProps {
  category: CategoryCount;
}

// declare interface DoughnutChartProps {
//   totalExpenseBalance: number,
//   totalCurrentMonthDebtBalance: number
// }

declare interface PaymentTransferFormProps {
  accounts: Account[];
}

// Actions
declare interface getAccountsProps {
  userId: string;
}

declare interface getAccountProps {
  // appwriteItemId: string;
}

declare interface getInstitutionProps {
  institutionId: string;
}

declare interface getTransactionsProps {
  accessToken: string;
}

declare interface CreateFundingSourceOptions {
  customerId: string; // Dwolla Customer ID
  fundingSourceName: string; // Dwolla Funding Source Name
  plaidToken: string; // Plaid Account Processor Token
  _links: object; // Dwolla On Demand Authorization Link
}

declare interface CreateTransactionProps {
  name: string;
  amount: string;
  senderId: string;
  senderBankId: string;
  receiverId: string;
  receiverBankId: string;
  email: string;
}

declare interface getTransactionsByBankIdProps {
  bankId: string;
}

declare interface signInProps {
  email: string;
  password: string;
}

declare interface getUserInfoProps {
  userID: string;
}

declare interface exchangePublicTokenProps {
  publicToken: string;
  user: User;
}

declare interface createBankAccountProps {
  accessToken: string;
  userId: string;
  accountId: string;
  bankId: string;
  fundingSourceUrl: string;
  sharableId: string;
}

declare interface getBanksProps {
  userId: string;
}

declare interface getBankProps {
  documentId: string;
}

declare interface getBankByAccountIdProps {
  accountId: string;
}

declare interface LeaderboardProfileProps{
  leaderboardData: LeaderboardProfile[];
  selectedSection?: string;
  selectedOption?: string;
}

/* Social List */

declare interface SocialListProfileUserProps{
  socialListUserData: Friend[];
}

declare interface SocialListProfileGroupProps{
  socialListGroupData: Group[];
  selectedOption?: string;

}

declare interface CustomInputProps<schemaType> {
  control: Control<z.infer<typeof schemaType>>,
  typeInfo: FieldPath<z.infer<typeof schemaType>>,
  labelInfo: string,
  placeholderInfo: string
}

declare interface CustomTransactionInputProps<schemaType> {
  control: Control<z.infer<typeof schemaType>>,
  typeInfo: FieldPath<z.infer<typeof schemaType>>,
  labelInfo: string,
  placeholderInfo: string,
  formType: string,
  options?: {value: string}[]
}

declare interface transactionIndividualDetails {
  nameOfTransactionIndividual: string;
  descriptionOfTransactionIndividual: string;
  // typeOfTransactionIndividual: string;
  amountOfTransactionIndividual: number;
  // individualTransactionCurrency: string;
};

declare type Transaction = {
  _id: string;
  userID: string;
  transactionName: string;
  transactionCategory: string;
  dateOfTransaction: Date;
  transactionDescription: string;
  receiverID: string;
  senderID: string;
  transactionCurrency: string;
  transactionType: string;
  transactionStatus: string;
  transactionIndividualDetails: transactionIndividualDetails[]; 
  transactionCycleType: string;
  transactionPlannedCycle: string;
  transactionPlannedCycleDate: Date;
  totalAmountOfTransaction: number;
  transactionProofURL: string;
  __v: number;
}

declare type Loan = {
  _id: string;
  userID: string;
  loanName: string;
  loanCategory: string;
  startingDateOfLoan: string;
  loanDescription: string;
  loanAmount: number;
  loanCurrency: string;
  loanTermYear: number;
  loanTermMonth: number;
  loanStatus: string;
  interestRate: number;
  interestRateType: string;
  receiverID: string;
  senderID: string;
  __v: number;
}

declare type Debt = {
  _id: string;
  userID: string,
  debtName: string,
  debtCategory: string,
  startingDateOfDebt: Date,
  debtDescription: string,
  debtCurrency: string,
  debtAmount: number,
  debtTermYear: number,
  debtTermMonth: number,
  interestRate: number,
  interestRateType: string,
  receiverID: string,
  senderID: string,
  debtPayerGroup: string,
  debtPaymentPlan: string,
  debtRegularPaymentAmount: number,
  debtStatus: string,
  debtProofOfURL: string,
  __v: number;
}

declare type ChartDataItem = {
  date: string;
  name: string;
  type: string;
  amount: number;
}

declare type AreaChartDataItem = {
  date: string;
  income: number;
  expense: number;
}

declare interface IncomeExpenseAreaChartProps {
  userID: string;
  // chartData: Array<ChartDataItem>;
    // settedTimeRange?: "7 Days" | "30 Days" | "90 Days";
}

declare type floatingButtonOptionItem = {  
  label: string;
  value: string;
  route: string;
  icon: string;
}

declare interface floatingButtonProps {  
  floatingButtonOptions : floatingButtonOptionItem[]
}
