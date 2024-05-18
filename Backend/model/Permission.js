// models/Permission.js
const mongoose = require('mongoose');

const PermissionSchema = new mongoose.Schema({
  permissionId: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
    required: true,
  },
//   orgAdminId: {
//     type: mongoose.Schema.Types.ObjectId, ref: 'organizationadmins'
//   },
  userStatus: {
    type: Boolean,
    required: true,
  },
  superAdmin: {
    type: Boolean,
    required: true,
  },
  organizationAdmin: {
    type: Boolean,
    required: true,
  },
  merchant: {
    type: Boolean,
    default: false,
  },
  serviceAgent: {
    type: Boolean,
    default: false,
  },
  fieldAgent: {
    type: Boolean,
    default: false,
  },
  inventoryWorker: {
    type: Boolean,
    default: false,
  },
  consumer: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Permission', PermissionSchema);