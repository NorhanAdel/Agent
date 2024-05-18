// routes/activities.js

const express = require('express');
const router = express.Router();
const Activity = require('../model/Activity');
//with meeeeeeeeeeeeeeeeeeee
// Route to get activities for a specific contact and agent
router.get('/activities/:contactId/:agentId', async (req, res) => {
  try {
    const { contactId, agentId } = req.params;
    
    // Find all activities where Contact_ID matches the specified contactId
    // and Agent_ID matches the specified agentId
    const activities = await Activity.find({ Contact_ID: contactId, Agent_ID: agentId });

    res.status(200).json(activities);
  } catch (error) {
    console.error('Error retrieving activities:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
//mohammed
router.get('/activities/:agentId', async (req, res) => {
  try {
    const {  agentId } = req.params;
    
    // Find all activities where Contact_ID matches the specified contactId
    // and Agent_ID matches the specified agentId
    const activities = await Activity.find({  Agent_ID: agentId });

    res.status(200).json(activities);
  } catch (error) {
    console.error('Error retrieving activities:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
//mostafa
router.get("/:agentId", async (req, res) => {
  try {
    const { agentId } = req.params;
    const activities = await Activity.find({ Agent_ID: agentId, Activity_status: "Fdf" });

    if (activities.length > 0) {
      res.json(activities);
    } else {
      res.status(404).send({ message: "No active activities found for this agent" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;
