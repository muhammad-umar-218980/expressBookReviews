const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

// TASK 6: Register a new user
public_users.post("/register", (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required."
        });
    }

    let userExists = users.find(user => user.username === username);

    if (userExists) {
        return res.status(409).json({
            message: "Username already exists."
        });
    }

    users.push({ username: username, password: password });

    return res.status(200).json({
        message: "User registered successfully."
    });
});

// TASK 1: Get the list of all books
public_users.get('/', (req, res) => {
    return res.status(200).send(JSON.stringify(books, null, 4));
});

// TASK 2: Get book details by ISBN
public_users.get('/isbn/:isbn', (req, res) => {
    let isbn = req.params.isbn;
    let book = books[isbn];

    if (book) {
        return res.status(200).json(book);
    } else {
        return res.status(404).json({
            message: "Book not found."
        });
    }
});

// TASK 3: Get books by author
public_users.get('/author/:author', (req, res) => {
    let author = req.params.author;
    let filteredBooks = {};

    for (let key in books) {
        if (books[key].author === author) {
            filteredBooks[key] = books[key];
        }
    }

    return res.status(200).send(JSON.stringify(filteredBooks, null, 4));
});

// TASK 4: Get books by title
public_users.get('/title/:title', (req, res) => {
    let title = req.params.title;
    let filteredBooks = {};

    for (let key in books) {
        if (books[key].title === title) {
            filteredBooks[key] = books[key];
        }
    }

    return res.status(200).send(JSON.stringify(filteredBooks, null, 4));
});

// TASK 5: Get book reviews by ISBN
public_users.get('/review/:isbn', (req, res) => {
    let isbn = req.params.isbn;
    let book = books[isbn];

    if (book && book.reviews) {
        return res.status(200).json(book.reviews);
    } else {
        return res.status(404).json({
            message: "No reviews found for this ISBN."
        });
    }
});

module.exports.general = public_users;
