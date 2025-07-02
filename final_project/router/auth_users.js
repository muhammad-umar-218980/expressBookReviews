const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    // check if username is already taken
    let existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return false;
    }
    return true;
}

const authenticatedUser = (username, password) => {
    // check if username and password match
    let user = users.find(user => user.username === username && user.password === password);
    if (user) {
        return true;
    }
    return false;
}

// Task 7: only registered users can login
regd_users.post("/login", (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({ data: username }, 'access', { expiresIn: 60 * 60 });
        req.session.authorization = { accessToken: accessToken, username: username };
        return res.status(200).json({ message: "User successfully logged in." });
    }

    return res.status(401).json({ message: "Invalid login. Check username and password." });
});

// Task 8: add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn;
    let review = req.query.review;
    let username = req.session.authorization.username;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found." });
    }

    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }

    books[isbn].reviews[username] = review;
    return res.status(200).json({ message: "Review added/updated successfully." });
});

// Task 9: delete the review by this user
regd_users.delete("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn;
    let username = req.session.authorization.username;

    if (books[isbn] && books[isbn].reviews && books[isbn].reviews[username]) {
        delete books[isbn].reviews[username];
        return res.status(200).json({ message: "Review deleted successfully." });
    }

    return res.status(404).json({ message: "Review not found for this user." });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
