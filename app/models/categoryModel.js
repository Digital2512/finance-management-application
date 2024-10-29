const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    categoryTitle: {type: String, required: true, unique: true},
    categoryDescription: {type: String, required: true},
    categoryType: {type: String, enum: ['Transactions', 'Group Circle'], required: true}
});

const Category =  mongoose.model('Category', categorySchema);
module.exports = Category;