const express= require('express')
const cors=require('cors')
const dotenv=require('dotenv')
const mongoose=require('mongoose')
const db=mongoose.connect("mongodb+srv://dawar:Tiagitc@cluster0.07wbnuj.mongodb.net/MyExpenses")
const transactionRoutes = require('./routes/transactionRoutes');
dotenv.config();
const app=express();

app.use(cors())
app.use(express.json())
app.use("/api/v1/users", require("./routes/userRoutes"));
app.use("/api/v1/transactions", transactionRoutes);
const PORT=8080 || process.env.PORT

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
});

