const express = require('express');
const router = express.Router();
const Role = require('../schemas/role');
const User = require('../schemas/user');

// get all roles
router.get('/', async function (req, res, next) {
  try {
    let roles = await Role.find({ isDeleted: false });
    res.send(roles);
  } catch (err) {
    next(err);
  }
});

// get role by id
router.get('/:id', async function (req, res, next) {
  try {
    let role = await Role.findById(req.params.id);
    if (!role || role.isDeleted) {
      return res.status(404).send({ message: 'Role not found' });
    }
    res.send(role);
  } catch (err) {
    res.status(404).send({ message: 'Role not found' });
  }
});

// create role
router.post('/', async function (req, res, next) {
  try {
    let r = new Role(req.body);
    await r.save();
    res.status(201).send(r);
  } catch (err) {
    next(err);
  }
});

// update role
router.put('/:id', async function (req, res, next) {
  try {
    let r = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!r || r.isDeleted) {
      return res.status(404).send({ message: 'Role not found' });
    }
    res.send(r);
  } catch (err) {
    next(err);
  }
});

// soft delete
router.delete('/:id', async function (req, res, next) {
  try {
    let r = await Role.findById(req.params.id);
    if (!r || r.isDeleted) {
      return res.status(404).send({ message: 'Role not found' });
    }
    r.isDeleted = true;
    await r.save();
    res.send(r);
  } catch (err) {
    next(err);
  }
});

router.get('/:id/users', async function (req, res, next) {
  try {
    let roleId = req.params.id;
    let role = await Role.findById(roleId);
    if (!role || role.isDeleted) {
      return res.status(404).send({ message: 'Role not found' });
    }
    let users = await User.find({ role: roleId, isDeleted: false });
    res.send(users);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
