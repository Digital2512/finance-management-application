const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    groupName: {type: String, default: 'Undefined', required: true},
    groupDescription: {type: String},
    groupCategory: {type: String, required: true},
    groupLeader: {type: mongoose.Schema.ObjectId, ref: 'User', default: 'Undefined', required: true},
    groupMembers: [
        {type: mongoose.Schema.ObjectId, ref: 'User', default: 'Undefined', required: true}
    ]    
});

const Loan = mongoose.model('Loan', loanSchema);
module.exports = Loan;