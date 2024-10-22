const mongoose = require('mongoose');

const savingHistorySchema = mongoose.Schema({
    paymentDate: {type: Date},
    type: {type: String, enum: ['Normal Savings', 'Extra Savings'], required: true, default: 'Normal Savings'},
    amount: {type: Number},
    finacedItem: {type: mongoose.Schema.ObjectId, ref: 'FinancedItem', required: true}
})

const financedItemSchema = mongoose.Schema({
    payer: {type: mongoose.Schema.ObjectId, default: 'Undefined', required: true},
    goalItem: {type: String, required: true},
    budgetAmount: {type: Number},
    status: {type: String, enum: ['Planning', 'Waiting for approval', 'Approved', 'Rejected', 'Pending', 'In Progress', 'Done', 'Cancelled'], default: 'Planning'}, 
    savingPlan: {
        typeOfRepayment:{type: String, enum: ['Daily', 'Weekly', 'Monthly', 'Yearly'], default: 'Monthly', required: true},
        repaymentAmount: {type: Number, default: 0, required: true}
    },
    savingHistory: [{type: mongoose.Schema.ObjectId, ref: 'SavingHistory', required: true}],
});

const FinancialProject = mongoose.model('FinancialProject', financialProjectSchema);
const PlanPoints = mongoose.model('PlanPoints', planPointsSchema);

module.exports = {FinancialProject, PlanPoints};