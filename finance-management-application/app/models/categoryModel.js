const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    categoryTitle: {type: String, required: true, unique: true},
    categoryDescription: {type: String, required: true},
    categoryType: {type: String, enum: ['Transactions', 'Group Circle'], required: true}
});

const User =  mongoose.model('User', userSchema);
module.exports = User;