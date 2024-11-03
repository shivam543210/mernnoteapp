//connect to mongoose 
const mongoose = require('mongoose');
require("dotenv").config();

const connectiondb = async () =>{

    try{
        const connect =await mongoose.connect(process.env.MONGO_URI );
        console.log('MongoDB connected');


    }catch(err){
        console.log(err);
        console.log('MongoDB not connected');


    }
}
module.exports = connectiondb;
