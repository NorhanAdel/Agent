// routes/contacts.js

const express = require('express');
const router = express.Router();
const Activity = require('../model/Activity');

////with meeeee

// Route to get contacts associated with a specific agent
router.get('/contacts/:agentId', async (req, res) => {
  try {
    const { agentId } = req.params;
    
    // Find all activities where Agent_ID matches the specified agentId
    const activities = await Activity.find({ Agent_ID: agentId });

    // Extract unique contacts from activities
    const contacts = activities.map(activity => ({
      Contact_ID: activity.Contact_ID,
      Contact_Name: activity.Contact_Name,
      // Add other contact fields as needed
    }));

    res.status(200).json(contacts);
  } catch (error) {
    console.error('Error retrieving contacts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
