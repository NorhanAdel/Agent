const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  Username: { type: String, required: true },
  User_Password: { type: String, required: true },
  UserMobile_Number: { type: String, required: true, unique: true },
  UserNational_ID: { type: String, required: true, unique: true },
  Organization_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'agents' },
  User_Email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(value) {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  permissionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }
});

userSchema.pre('save', async function(next) {
  const user = this;
  if (!user.isModified('User_Password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.User_Password, salt);
    user.User_Password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
