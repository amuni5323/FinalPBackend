// routes/booksRoutes.js

const express = require('express');
const router = express.Router();
const booksController = require('../controllers/booksController');  // Ensure this path is correct

// Create a new book
router.post('/books', booksController.createBook);

// Get all books
router.get('/books', booksController.getBooks);

// Get a specific book by ID
router.get('/books/:id', booksController.getBookById);

// Update a book by ID
router.put('/books/:id', booksController.updateBook);

// Delete a book by ID
router.delete('/books/:id', booksController.deleteBook);

module.exports = router;
