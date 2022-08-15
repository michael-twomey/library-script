#! /usr/bin/env node

console.log('This script populates your db with authors, genres, books, and book instances. Specify db connection url as arg (e.g. node popdb.js mongodb+srv://db-username:db-password@cluster0.uwwlz8f.mongodb.net/local-library?retryWrites=true&w=majority');
const userArgs = process.argv.slice(2);

const mongoose = require('mongoose');

const mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('error', (err) => {
  console.log(`MongoDB connection error: ' + ${err}`);
});

const Author = require('./models/author');
const Genre = require('./models/genre');
const Book = require('./models/book');
const BookInstance = require('./models/bookinstance');
