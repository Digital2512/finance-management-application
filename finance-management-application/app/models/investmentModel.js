const mongoose = require('mongoose');

const ARAPSchema = new mongoose.Schema({
    amount: {type: Number, required: true},
    category: {type: String, required: true},
    date: {type: Date, default: Date.now},
    description: {type: String},
    type: {type: String, enum: ['Account Receivable', 'Account Payable'], required: true},
    proofOfTransactionURL: {type: String, default: 'Empty Proof Of Transaction'}, //store the proof of transaction's picture
    receiver: {type: mongoose.Schema.ObjectId, ref: 'User', default: 'Undefined', required: true},//might need to change to string to avoid user not found error due to the sende/receiver not being a registered user in the database
    sender: {type: mongoose.Schema.ObjectId, ref: 'User', default: 'Undefined', required: true}//might need to change to string to avoid user not found error due to the sende/receiver not being a registered user in the database
});

const ARAP = mongoose.model('Expense', expenseSchema);
module.exports = ARAP;