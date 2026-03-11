const express = require('express');
const router = express.Router();
const User = require('../schemas/user');

// get all users
router.get('/', async function (req, res, next) {
  try {
    let users = await User.find({ isDeleted: false }).populate('role');
    res.send(users);
  } catch (err) {
    next(err);
  }
});

// get a user by id
router.get('/:id', async function (req, res, next) {
  try {
    let user = await User.findById(req.params.id).populate('role');
    if (!user || user.isDeleted) {
      return res.status(404).send({ message: 'User not found' });
    }
    res.send(user);
  } catch (err) {
    res.status(404).send({ message: 'User not found' });
  }
});

// create a user
router.post('/', async function (req, res, next) {
  try {
    let u = new User(req.body);
    await u.save();
    res.status(201).send(u);
  } catch (err) {
    next(err);
  }
});

// update user
router.put('/:id', async function (req, res, next) {
  try {
    let u = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!u || u.isDeleted) {
      return res.status(404).send({ message: 'User not found' });
    }
    res.send(u);
  } catch (err) {
    next(err);
  }
});

// soft delete
router.delete('/:id', async function (req, res, next) {
  try {
    let u = await User.findById(req.params.id);
    if (!u || u.isDeleted) {
      return res.status(404).send({ message: 'User not found' });
    }
    u.isDeleted = true;
    await u.save();
    res.send(u);
  } catch (err) {
    next(err);
  }
});

// enable a user by email + username
router.post('/enable', async function (req, res, next) {
  try {
    let { email, username } = req.body;
    if (!email || !username) {
      return res.status(400).send({ message: 'email and username are required' });
    }
    let u = await User.findOne({ email, username, isDeleted: false });
    if (!u) {
      return res.status(404).send({ message: 'User not found' });
    }
    u.status = true;
    await u.save();
    res.send(u);
  } catch (err) {
    next(err);
  }
});

// disable a user
router.post('/disable', async function (req, res, next) {
  try {
    let { email, username } = req.body;
    if (!email || !username) {
      return res.status(400).send({ message: 'email and username are required' });
    }
    let u = await User.findOne({ email, username, isDeleted: false });
    if (!u) {
      return res.status(404).send({ message: 'User not found' });
    }
    u.status = false;
    await u.save();
    res.send(u);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
