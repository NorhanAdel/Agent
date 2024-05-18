const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const activityRoutes = require('./routes/activity');
const userRoutes= require('./routes/users');
const permissionRoutes = require('./routes/permission');
const contactRoutes = require('./routes/client');
const clientActivities = require('./routes/clientActivities');
const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://menna:menna123456789@projecterp.lccueui.mongodb.net/Agent' )
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// Routes
app.use('/api', activityRoutes);
app.use('/api/users', userRoutes);
app.use('/api',permissionRoutes);
app.use('/api', contactRoutes);
app.use('/api', clientActivities);



// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`));

