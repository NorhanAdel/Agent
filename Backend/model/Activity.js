const { ref, required } = require('joi');
const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  // Activity_Id:{type:mongoose.Schema.ObjectId, auto: true,
  //   required: true},
  Activity_Name: { type: String ,required:true },//
  Activity_Type: { type: String ,required:true },//
  Organization_ID: { type: mongoose.Schema.Types.ObjectId,
    ref:'agents', 
   },
  Organization_name: { type: String ,required:true},//
  Account_ID: { type: Number },
  Account_Name: { type: String ,required:true},
  Contact_ID: { type: Number },
  Contact_Name: { type: String },
  Contact_Mobile_Number: { type: String },
  Contact_Address: { type: String  ,required:false},
  Agent_ID: { type: mongoose.Schema.Types.ObjectId  ,ref:"users"},
  Agent_Name: { type: String ,required:true},
  Activity_status: { type: String ,required:false },//
  Activity_Planned_Time: { type: Date ,required:false },//
  Activity_Actual_Time: { type: Date  },
  Checkin_Location:{type:String ,required:false},
  Attachment:[{ type: String ,required:false}],
}  );

activitySchema.set('toJSON', { virtuals: true });

const Activity = mongoose.model('Agent_Activity', activitySchema);

module.exports = Activity;