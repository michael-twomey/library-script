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

function createAuthor(firstName, familyName, dateBirth, dateDeath) {
  const newAuthorInfo = {
    first_name: firstName,
    family_name: familyName,
  };
  if (dateBirth) {
    newAuthorInfo.date_of_birth = dateBirth;
  }
  if (dateDeath) {
    newAuthorInfo.date_of_death = dateDeath;
  }
  return new Promise((resolve, reject) => {
    const newAuthor = new Author(newAuthorInfo);
    newAuthor.save((err) => {
      if (err) {
        reject(err);
      }
      resolve(newAuthor);
    });
  });
}

function createGenre(name) {
  const newGenreInfo = { name };
  return new Promise((resolve, reject) => {
    const newGenre = new Genre(newGenreInfo);
    newGenre.save((err) => {
      if (err) {
        reject(err);
      }
      resolve(newGenre);
    });
  });
}

function createBook(title, author, summary, isbn, genre) {
  const newBookInfo = {
    title: title,
    author: author,
    summary: summary,
    isbn: isbn,
  };
  if (genre) {
    newBookInfo.genre = genre;
  }
  return new Promise((resolve, reject) => {
    const newBook = new Book(newBookInfo);
    newBook.save((err) => {
      if (err) {
        reject(err);
      }
      resolve(newBook);
    });
  });
}

function createBookInstance(book, imprint, status, dueBack) {
  const newBookInstanceInfo = {
    book: book,
    imprint: imprint,
    status: status,
  };
  if (dueBack) {
    newBookInstanceInfo.due_back = dueBack;
  }
  const newBookInstance = new BookInstance(newBookInstanceInfo);
  return new Promise((resolve, reject) => {
    newBookInstance.save((err) => {
      if (err) {
        reject(err);
      }
      resolve(newBookInstance);
    });
  });
}


function getAuthorsArray() {
  return [
    createAuthor('Patrick', 'Rothfuss', '1973-06-06', false),
    createAuthor('Ben', 'Bova', '1932-11-8', false),
    createAuthor('Isaac', 'Asimov', '1920-01-02', '1992-04-06'),
    createAuthor('Bob', 'Billings', false, false),
    createAuthor('Jim', 'Jones', '1971-12-16', false),
  ];
}

function getGenreArray() {
  return [
    createGenre('Fantasy'),
    createGenre('Science Fiction'),
    createGenre('French Poetry'),
  ];
}

function getBookArray(authors, genres) {
  return [
    createBook('The Name of the Wind (The Kingkiller Chronicle, #1)', authors[0], 'I have stolen princesses back from sleeping barrow kings. I burned down the town of Trebon. I have spent the night with Felurian and left with both my sanity and my life. I was expelled from the University at a younger age than most people are allowed in. I tread paths by moonlight that others fear to speak of during day. I have talked to Gods, loved women, and written songs that make the minstrels weep.', '9781473211896', [genres[0]]),
    createBook('The Wise Man\'s Fear (The Kingkiller Chronicle, #2)', authors[0], 'Picking up the tale of Kvothe Kingkiller once again, we follow him into exile, into political intrigue, courtship, adventure, love and magic... and further along the path that has turned Kvothe, the mightiest magician of his age, a legend in his own time, into Kote, the unassuming pub landlord.', '9788401352836', [genres[0]]),
    createBook('The Slow Regard of Silent Things (Kingkiller Chronicle)', authors[0], 'Deep below the University, there is a dark place. Few people know of it: a broken web of ancient passageways and abandoned rooms. A young woman lives there, tucked among the sprawling tunnels of the Underthing, snug in the heart of this forgotten place.', '9780756411336', [genres[0]]),
    createBook('Apes and Angels', authors[1], 'Humankind headed out to the stars not for conquest, nor exploration, nor even for curiosity. Humans went to the stars in a desperate crusade to save intelligent life wherever they found it. A wave of death is spreading through the Milky Way galaxy, an expanding sphere of lethal gamma ...', '9780765379528', [genres[1]]),
    createBook('Death Wave', authors[1], 'In Ben Bova\'s previous novel New Earth, Jordan Kell led the first human mission beyond the solar system. They discovered the ruins of an ancient alien civilization. But one alien AI survived, and it revealed to Jordan Kell that an explosion in the black hole at the heart of the Milky Way galaxy has created a wave of deadly radiation, expanding out from the core toward Earth. Unless the human race acts to save itself, all life on Earth will be wiped out...', '9780765379504', [genres[1]]),
    createBook('Test Book 1', authors[4], 'Summary of test book 1', 'ISBN111111', [genres[0], genres[1]]),
    createBook('Test Book 2', authors[4], 'Summary of test book 2', 'ISBN222222'),
  ];
}

function getBookInstanceArray(books) {
  return [
    createBookInstance(books[0], 'London Gollancz, 2014.', 'Available'),
    createBookInstance(books[1], ' Gollancz, 2011.', 'Loaned'),
    createBookInstance(books[2], ' Gollancz, 2015.'),
    createBookInstance(books[3], 'New York Tom Doherty Associates, 2016.', 'Available'),
    createBookInstance(books[3], 'New York Tom Doherty Associates, 2016.', 'Available'),
    createBookInstance(books[3], 'New York Tom Doherty Associates, 2016.', 'Available'),
    createBookInstance(books[4], 'New York, NY Tom Doherty Associates, LLC, 2015.', 'Available'),
    createBookInstance(books[4], 'New York, NY Tom Doherty Associates, LLC, 2015.', 'Maintenance'),
    createBookInstance(books[4], 'New York, NY Tom Doherty Associates, LLC, 2015.', 'Loaned'),
    createBookInstance(books[0], 'Imprint XXX2'),
    createBookInstance(books[1], 'Imprint XXX3'),
  ];
}

function addAuthors() {
  return Promise.all(getAuthorsArray());
}

function addGenres() {
  return Promise.all(getGenreArray());
}

function addBooks(authors, genres) {
  return Promise.all(getBookArray(authors, genres));
}

function addBookInstances(books) {
  return Promise.all(getBookInstanceArray(books));
}

async function populateDB() {
  const authors = await addAuthors();
  const genres = await addGenres();
  const books = await addBooks(authors, genres);
  const bookInstances = await addBookInstances(books);
  console.log(authors);
  console.log(genres);
  console.log(books);
  console.log(bookInstances);
  console.log('Population complete.');
  mongoose.connection.close();
}

populateDB();