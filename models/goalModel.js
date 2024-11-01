import mongoose from "mongoose";

const goalTypeList = ['Savings', 'Debt Reduction', 'Investment', 'Retirement', 'Income', 'Lifestyle', 'Education']

const goalSchema = new mongoose.Schema({
    userID: {type: String, required: true},
    goalName: {type: String, required: true},
    goalType: {type: String, required: true, enum: goalTypeList},
    goalAmount: {type: number, required: true}
})

var Goal = mongoose.models.Goal || mongoose.model('Goal', goalSchema);

export default Goal