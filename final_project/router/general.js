const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();

// TASK 6: Register a new user
public_users.post("/register", (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    let userExists = users.find(user => user.username === username);
    if (userExists) {
        return res.status(409).json({ message: "Username already exists." });
    }

    users.push({ username: username, password: password });
    return res.status(200).json({ message: "User registered successfully." });
});

// TASK 1: Get the book list available in the shop
public_users.get('/', function (req, res) {
    return res.status(200).send(JSON.stringify(books, null, 4));
});

// TASK 2: Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    let isbn = req.params.isbn;
    let book = books[isbn];

    if (book) {
        return res.status(200).json(book);
    } else {
        return res.status(404).json({ message: "Book not found." });
    }
});

// TASK 3: Get book details based on author
public_users.get('/author/:author', function (req, res) {
    let author = req.params.author;
    let filteredBooks = {};

    for (let key in books) {
        if (books[key].author === author) {
            filteredBooks[key] = books[key];
        }
    }

    return res.status(200).send(JSON.stringify(filteredBooks, null, 4));
});

// TASK 4: Get all books based on title
public_users.get('/title/:title', function (req, res) {
    let title = req.params.title;
    let filteredBooks = {};

    for (let key in books) {
        if (books[key].title === title) {
            filteredBooks[key] = books[key];
        }
    }

    return res.status(200).send(JSON.stringify(filteredBooks, null, 4));
});

// TASK 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
    let isbn = req.params.isbn;
    let book = books[isbn];

    if (book && book.reviews) {
        return res.status(200).json(book.reviews);
    } else {
        return res.status(404).json({ message: "No reviews found for this ISBN." });
    }
});

// TASK 10: Get all books (async/await)
public_users.get('/async-books', async (req, res) => {
    try {
        let response = await axios.get('http://localhost:5000/');
        return res.status(200).send(response.data);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching books", error: err.message });
    }
});

// TASK 11: Get book by ISBN (Promises)
public_users.get('/Promises-isbn/:isbn', (req, res) => {
    let isbn = req.params.isbn;
    axios.get(`http://localhost:5000/isbn/${isbn}`)
    .then(response => {
        return res.status(200).json(response.data);
    })
    .catch(err => {
        return res.status(500).json({ message: "Error fetching book by ISBN", error: err.message });
    });
});

// TASK 12: Get books by author (async/await)
public_users.get('/async-author/:author', async (req, res) => {
    try {
        let author = req.params.author;
        let response = await axios.get(`http://localhost:5000/author/${author}`);
        return res.status(200).send(response.data);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching books by author", error: err.message });
    }
});

// TASK 13: Get books by title (async/await)
public_users.get('/async-title/:title', async (req, res) => {
    try {
        let title = req.params.title;
        let response = await axios.get(`http://localhost:5000/title/${title}`);
        return res.status(200).send(response.data);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching books by title", error: err.message });
    }
});

module.exports.general = public_users;
