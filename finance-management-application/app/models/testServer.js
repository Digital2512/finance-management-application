const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();

const chosenDatabaseName = 'test';

mongoose.connect(`${process.env.MONGO_URI}${chosenDatabaseName}`)
.then(() => console.log('Database connected!'))
.catch((err) => console.log('Databse connection error: ', err));