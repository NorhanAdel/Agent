// routes/permissionRoutes.js
const express = require('express');
const permissionController = require('../controller/permissioncontroller');

const router = express.Router();

router.post('/permissions', permissionController.createPermission);
router.get('/permissions', permissionController.getAllPermissions);
router.get('/permissions/:id', permissionController.getPermissionById);
router.patch('/permissions/:id', permissionController.updatePermissionById);
router.delete('/permissions/:id', permissionController.deletePermissionById);

module.exports = router;