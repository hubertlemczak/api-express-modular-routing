const express = require('express');
const { users } = require('../../data');

const usersRouter = express.Router();

const getUserById = id => users.find(u => u.id === Number(id));
const getUserByEmail = email => users.find(u => u.email === email);
const isBodyInvalid = body => Object.keys(body).length === 0;

usersRouter.get('/', (req, res) => {
  res.status(200).json({ users });
});

usersRouter.get('/:id', (req, res) => {
  const user = getUserById(req.params.id);

  if (!user) {
    return res
      .status(404)
      .json({ error: 'A User with the provided ID does not exist' });
  }

  res.status(200).json({ user });
});

usersRouter.post('/', (req, res) => {
  const user = req.body;

  if (isBodyInvalid(req.body)) {
    return res.status(400).json({ error: 'Missing fields in request body' });
  }

  const isUser = getUserByEmail(req.body.email);
  if (isUser) {
    return res
      .status(409)
      .json({ error: 'A user with the provided email already exists' });
  }
  users.push({ id: Date.now(), ...user });

  res.status(200).json({ user });
});

usersRouter.put('/:id', (req, res) => {
  const user = getUserById(req.params.id);

  if (isBodyInvalid(req.body)) {
    return res.status(400).json({ error: 'Missing fields in request body' });
  }

  if (!user) {
    return res
      .status(404)
      .json({ error: 'A User with the provided ID does not exist' });
  }

  const isUser = getUserByEmail(req.body.email);

  if (isUser) {
    return res
      .status(409)
      .json({ error: 'A user with the provided email already exists' });
  }

  const updatedUser = { ...user, ...req.body };
  const index = users.indexOf(user);
  users.splice(index, 1, updatedUser);

  res.status(200).json({ user: updatedUser });
});

usersRouter.delete('/:id', (req, res) => {
  const user = getUserById(req.params.id);

  if (!user) {
    return res
      .status(404)
      .json({ error: 'A User with the provided ID does not exist' });
  }

  const index = users.indexOf(user);
  users.splice(index, 1);

  res.status(200).json({ user });
});

module.exports = usersRouter;
