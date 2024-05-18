const bcrypt = require('bcryptjs');
const User = require('./model/Users');

async function authenticateUser(password) {
  const user = await User.findOne({});
  if (!user) {
    throw new Error('User not found');
  }

  const isPasswordMatch = await bcrypt.compare(password, user.User_Password);
  if (!isPasswordMatch) {
    throw new Error('Incorrect password');
  }

  return user;
}

module.exports = authenticateUser;
