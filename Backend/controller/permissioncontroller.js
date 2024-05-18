// controllers/permissionController.js
const Permission = require('../model/Permission');

// Create a new permission
exports.createPermission = async (req, res) => {
  try {
    const permission = new Permission(req.body);
    await permission.save();
    res.status(201).send(permission);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Get all permissions
exports.getAllPermissions = async (req, res) => {
  try {
    const permissions = await Permission.find();
    res.status(200).send(permissions);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get a single permission by ID
exports.getPermissionById = async (req, res) => {
  try {
    const permission = await Permission.findById(req.params.id);
    if (!permission) {
      return res.status(404).send();
    }
    res.status(200).send(permission);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Update a permission by ID
exports.updatePermissionById = async (req, res) => {
  try {
    const permission = await Permission.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!permission) {
      return res.status(404).send();
    }
    res.status(200).send(permission);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete a permission by ID
exports.deletePermissionById = async (req, res) => {
  try {
    const permission = await Permission.findByIdAndDelete(req.params.id);
    if (!permission) {
      return res.status(404).send();
    }
    res.status(200).send(permission);
  } catch (error) {
    res.status(500).send(error);
  }
};