const express = require('express');
const router = express.Router();
const { createUser } = require('../controller/userscontroller');
const User = require('../model/Users');

// nouran
router.post('/create', createUser);
router.get('/users', async (req, res) => {
    try {
      const users = await User.find({});
      res.status(200).json(users);
    } catch (error) {
      console.error('Error retrieving activities:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });module.exports = router;
