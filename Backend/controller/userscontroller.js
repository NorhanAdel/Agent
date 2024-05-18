const User = require('../model/Users');

exports.createUser = async (req, res) => {
  try {
    const {
      Username,
      User_Password,
      UserMobile_Number,
      UserNational_ID,
      Organization_ID,
      User_Email,
      permission_ID
    } = req.body;

    const user = new User({
      Username,
      User_Password,
      UserMobile_Number,
      UserNational_ID,
      Organization_ID,
      User_Email,
      permission_ID
    });

    await user.save();

    res.status(200).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
// exports.getUsers = async (req, res) => {
//   try {
//     const users = await User.find({});
//     res.status(200).json(users);
//   } catch (error) {
//     console.error('Error retrieving users:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

