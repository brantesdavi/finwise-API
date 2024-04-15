const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    transactionId: String,
    spendOrIncome: Boolean,
    category: String,
    title: String,
    price: Number,
    date: Date,
    userId: String
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;