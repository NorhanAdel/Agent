// const mongoose = require('mongoose');
const Activity = require('../model/Activity');
const cloudinary = require('cloudinary').v2;
const User = require('../model/Users'); 
exports.addActivity = async (req, res) => {
  try {
    const {
      // Activity_Id,
      Activity_Name,
      Activity_Type,
      Organization_name,
      Account_ID,
      Account_Name,
      Contact_ID,
      Contact_Name,
      Contact_Mobile_Number,
      Contact_Address,
      Agent_ID,
      Agent_Name,
      Activity_status,
      Activity_Planned_Time,
      Checkin_Location,
      // Attachment:[]
    } = req.body;
    
    const arrivalTime = new Date();
    const user = await User.findOne({ Username: Agent_Name });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const activity = await Activity.create({
      // Activity_Id,
      Activity_Name,
      Activity_Type,
      Organization_name,
      Account_ID,
      Account_Name,
      Contact_ID,
      Contact_Name,
      Contact_Mobile_Number,
      Contact_Address,
      Agent_ID:user.id,
      Agent_Name,
      Activity_status,
      Activity_Planned_Time,
      Activity_Actual_Time: arrivalTime,
      Checkin_Location,
      Attachment: []
    });
   
    // Send success response
    res.status(200).json({ message: 'Arrival time recorded successfully', activity });
  } catch (error) {
    // Handle errors
    console.error('Error recording arrival time:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// activitycontroller.js

exports.updateActivityActualTime = async (req, res) => {
  try {
    const { activityId } = req.params; // Assuming you're passing activityId in the URL params
    console.log('Activity ID:', activityId);
    const arrivalTime = new Date();

    const updatedActivity = await Activity.findByIdAndUpdate(activityId, {
      Activity_Actual_Time: arrivalTime,
    }, { new: true });

    if (!updatedActivity) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    res.status(200).json({ message: 'Activity actual time updated successfully', activity: updatedActivity });
  } catch (error) {
    console.error('Error updating activity actual time:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const path = require('path');

exports.updateActivityAttachment = async (req, res) => {
  try {
    const { activityId } = req.params;

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Construct the attachment URL
    const attachmentUrl = path.join('/uploads', req.file.filename);

    // Update the activity with the new attachment URL
    const updatedActivity = await Activity.findByIdAndUpdate(activityId, {
      Attachment: attachmentUrl
    }, { new: true });

    if (!updatedActivity) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    res.status(200).json({ message: 'Attachment updated successfully', activity: updatedActivity });
  } catch (error) {
    console.error('Error updating activity attachment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



