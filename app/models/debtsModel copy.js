const mongoose = require('mongoose');

const repaymentHistorySchema = mongoose.Schema({
    individualPayer: {type: mongoose.Schema.ObjectId, default: 'Undefined', required: true},
    paymentDate: {type: Date},
    type: {type: String, enum: ['Normal Payments', 'Extra Payments'], required: true, default: 'Normal Payments'},
    amount: {type: Number},
    typeOfRepaymentPayer:  {type: String, enum: ['Individual', 'Shared'], default: 'Individual', required: true},
    sharedDebt: {type: mongoose.Schema.ObjectId, ref: 'SharedDebt', required: true}
})

const debtSchema = new mongoose.Schema({
    amount: {type: Number, required: true},
    category: {type: String, required: true},
    startingDate: {type: Date, default: Date.now},
    endingDate: {type: Date, default: Date.now},
    description: {type: String},
    interestRate: {
        interestRateType: {type: String, enum: ['Daily', 'Weekly', 'Monthly', 'Yearly'], default: 'Monthly', required: true},
        interestRate: {type: Number, required: true}
    },
    repaymentPlan: {
        typeOfRepayment:{type: String, enum: ['Daily', 'Weekly', 'Monthly', 'Yearly'], default: 'Monthly', required: true},
        repaymentAmount: {type: Number, default: 0, required: true}
    },
    repaymentHistory: [{type: mongoose.Schema.ObjectId, ref: 'RepaymentHistory', required: true}],
    receiver: {type: mongoose.Schema.ObjectId, ref: 'User', default: 'Undefined'},//might need to change to string to avoid user not found error due to the sende/receiver not being a registered user in the database
    payer: {type: mongoose.Schema.ObjectId, ref: 'User', default: 'Undefined'}//might need to change to string to avoid user not found error due to the sende/receiver not being a registered user in the database
});

const Debt = mongoose.model('Debt', debtSchema);
module.exports = Debt;