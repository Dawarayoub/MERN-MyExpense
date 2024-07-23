const express = require('express');
const transactionRoutes = express.Router();
const transactionModel = require('../models/transactionModel');
const moment=require('moment')
transactionRoutes.post('/add-transaction', async (req, res)  => {
    try {
        const newTransaction = new transactionModel(req.body);
        await newTransaction.save();
        res.status(201).send("Transaction Created");
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

transactionRoutes.post('/get-transaction', async (req, res) => {
    try {
        const {frequency,selectedDate,type}=req.body
        const transactions = await transactionModel.find({

            ...(frequency!=='custom' ? {
            date:{
            $gt : moment().subtract(Number(frequency),'d').toDate()
        } } : {
            date:{$gte:selectedDate[0],
                $lte:selectedDate[1]
            }
        }),
        userid: req.body.userid,
        ...(type!="all" && {type})
        });
        res.status(200).json(transactions);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

transactionRoutes.put('/edit-transaction', async (req, res) => {
    try {
        const { transactionid, payload } = req.body;
        if (!transactionid || !payload) {
            return res.status(400).json({ message: 'Invalid request' });
        }
        await transactionModel.findOneAndUpdate(
            { _id: transactionid },
            payload,
            { new: true } // Return the updated document
        );
        res.status(200).send("Edit Successful");
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});
transactionRoutes.put('/delete-transaction', async (req, res) => {
    try{
        await transactionModel.findOneAndDelete({_id:req.body.transactionid})
        res.status(200).send('Transaction deleted')
    }
    catch(error){
        console.log(error)
        res.status(500).json(error)
    }
})

module.exports = transactionRoutes;
