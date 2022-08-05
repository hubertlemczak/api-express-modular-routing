const express = require('express');
const { books } = require('../../data');

const booksRouter = express.Router();

const getBookById = id => books.find(f => f.id === Number(id));
const getBookByTitle = title => books.find(f => f.title === title);
const isBodyValid = body => Object.keys(body).length === 3;

booksRouter.get('/', (req, res) => {
  res.status(200).json({ books });
});

booksRouter.get('/:id', (req, res) => {
  const book = getBookById(req.params.id);

  if (!book) {
    return res
      .status(404)
      .json({ error: 'A book with the provided ID does not exist' });
  }

  res.status(200).json({ book });
});

booksRouter.post('/', (req, res) => {
  const book = req.body;

  if (!isBodyValid(req.body)) {
    return res.status(400).json({ error: 'Missing fields in request body' });
  }

  const isBook = getBookByTitle(req.body.title);
  if (isBook) {
    return res
      .status(409)
      .json({ error: 'A book with the provided title already exists' });
  }
  books.push({ id: Date.now(), ...book });

  res.status(200).json({ book });
});

booksRouter.put('/:id', (req, res) => {
  const book = getBookById(req.params.id);

  if (!isBodyValid(req.body)) {
    return res.status(400).json({ error: 'Missing fields in request body' });
  }

  if (!book) {
    return res
      .status(404)
      .json({ error: 'A book with the provided ID does not exist' });
  }

  const isBook = getBookByTitle(req.body.title);

  if (isBook) {
    return res
      .status(409)
      .json({ error: 'A book with the provided title already exists' });
  }

  const updatedBook = { ...book, ...req.body };
  const index = books.indexOf(book);
  books.splice(index, 1, updatedBook);

  res.status(200).json({ book: updatedBook });
});

booksRouter.patch('/:id', (req, res) => {
  const book = getBookById(req.params.id);

  if (!book) {
    return res
      .status(404)
      .json({ error: 'A book with the provided ID does not exist' });
  }

  const isBook = getBookByTitle(req.body.title);
  if (isBook) {
    return res
      .status(409)
      .json({ error: 'A book with the provided title already exists' });
  }

  const updatedBook = { ...book, ...req.body };
  const index = books.indexOf(book);
  books.splice(index, 1, updatedBook);

  res.status(200).json({ book: updatedBook });
});

booksRouter.delete('/:id', (req, res) => {
  const book = getBookById(req.params.id);

  if (!book) {
    return res
      .status(404)
      .json({ error: 'A book with the provided ID does not exist' });
  }

  const index = books.indexOf(book);
  books.splice(index, 1);

  res.status(200).json({ book });
});

module.exports = booksRouter;
