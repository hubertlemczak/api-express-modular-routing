const express = require('express');
const { films } = require('../../data');

const filmsRouter = express.Router();

const getFilmById = id => films.find(f => f.id === Number(id));
const getFilmByTitle = title => films.find(f => f.title === title);
const isBodyValid = body => Object.keys(body).length === 2;

filmsRouter.get('/', (req, res) => {
  const director = req.query.director;
  console.log(req.query);
  let filteredFilms = films;
  if (director) {
    filteredFilms = films.filter(f => f.director === director);
  }
  res.status(200).json({ films: filteredFilms });
});

filmsRouter.get('/:id', (req, res) => {
  const film = getFilmById(req.params.id);

  if (!film) {
    return res
      .status(404)
      .json({ error: 'A film with the provided ID does not exist' });
  }

  res.status(200).json({ film });
});

filmsRouter.post('/', (req, res) => {
  const film = req.body;

  if (!isBodyValid(req.body)) {
    return res.status(400).json({ error: 'Missing fields in request body' });
  }

  const isFilm = getFilmByTitle(req.body.title);
  if (isFilm) {
    return res
      .status(409)
      .json({ error: 'A film with the provided title already exists' });
  }
  films.push({ id: Date.now(), ...film });

  res.status(200).json({ film });
});

filmsRouter.put('/:id', (req, res) => {
  const film = getFilmById(req.params.id);

  if (!isBodyValid(req.body)) {
    return res.status(400).json({ error: 'Missing fields in request body' });
  }

  if (!film) {
    return res
      .status(404)
      .json({ error: 'A film with the provided ID does not exist' });
  }

  const isFilm = getFilmByTitle(req.body.title);

  if (isFilm) {
    return res
      .status(409)
      .json({ error: 'A film with the provided title already exists' });
  }
  film.title = req.body.title;
  film.director = req.body.director;

  res.status(200).json({ film });
});

filmsRouter.patch('/:id', (req, res) => {
  const film = getFilmById(req.params.id);

  if (!film) {
    return res
      .status(404)
      .json({ error: 'A film with the provided ID does not exist' });
  }

  const isFilm = getFilmByTitle(req.body.title);
  if (isFilm) {
    return res
      .status(409)
      .json({ error: 'A film with the provided title already exists' });
  }
  film.title = req.body.title || film.title;
  film.director = req.body.director || film.director;

  res.status(200).json({ film });
});

filmsRouter.delete('/:id', (req, res) => {
  const film = getFilmById(req.params.id);

  if (!film) {
    return res
      .status(404)
      .json({ error: 'A film with the provided ID does not exist' });
  }

  const index = films.indexOf(film);
  films.splice(index, 1);

  res.status(200).json({ film });
});

module.exports = filmsRouter;
