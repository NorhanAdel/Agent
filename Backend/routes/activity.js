const express = require('express');
const router = express.Router();
// const multer = require('multer');
// const upload = multer({ dest: 'uploads/' }); // or configure it as needed
const upload=require('../middleware/upload')
const arrivalController = require('../controller/activitycontroller');
const Activity = require('../model/Activity');

// Route to retrieve activities

router.get('/activities', async (req, res) => {
  try {
    const activities = await Activity.find({});
    res.status(200).json(activities);
  } catch (error) {
    console.error('Error retrieving activities:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//nouran
router.put('/activities/:activityId/actual-time', arrivalController.updateActivityActualTime);

// Route to record arrival time
//mohammed
router.post('/arrival', arrivalController.addActivity);

router.get('/activity/:activityId', async (req, res) => {
  try {
    const { activityId } = req.params;

    // Find the activity by activity ID
    const activity = await Activity.findById(activityId);

    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    res.status(200).json(activity);
  } catch (error) {
    console.error('Error retrieving activity details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
//with meeeeeeeeeeeeeeeeeee
// router.put('/activities/:activityId/attachments', arrivalController.updateActivityAttachment);
router.put('/activities/:activityId/attachments', upload.single('Attachment'), arrivalController.updateActivityAttachment);


module.exports = router;