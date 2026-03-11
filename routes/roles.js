var express = require('express');
var router = express.Router();
let Role = require('../schemas/roles');
let User = require('../schemas/users');

// CREATE - POST /api/v1/roles
router.post('/', (req, res) => {
    try {
        const { name, description } = req.body;
        
        if (!name) {
            return res.status(400).json({
                message: "name is required"
            });
        }

        const existingRole = Role.findOne({ name });
        if (existingRole) {
            return res.status(400).json({
                message: "role name already exists"
            });
        }

        const role = Role.create({
            name,
            description: description || ""
        });

        res.status(201).json({
            message: "Role created successfully",
            data: role
        });
    } catch (error) {
        res.status(500).json({
            message: "Error creating role",
            error: error.message
        });
    }
});

// READ - GET all roles /api/v1/roles
router.get('/', (req, res) => {
    try {
        const roles = Role.find({ isDeleted: false });
        res.status(200).json({
            message: "Get all roles successfully",
            data: roles
        });
    } catch (error) {
        res.status(500).json({
            message: "Error getting roles",
            error: error.message
        });
    }
});

// READ - GET role by id /api/v1/roles/:id
router.get('/:id', (req, res) => {
    try {
        const role = Role.findById(req.params.id);
        
        if (!role || role.isDeleted) {
            return res.status(404).json({
                message: "Role not found"
            });
        }

        res.status(200).json({
            message: "Get role successfully",
            data: role
        });
    } catch (error) {
        res.status(500).json({
            message: "Error getting role",
            error: error.message
        });
    }
});

// UPDATE - PUT /api/v1/roles/:id
router.put('/:id', (req, res) => {
    try {
        const { name, description } = req.body;
        
        const role = Role.findById(req.params.id);
        
        if (!role || role.isDeleted) {
            return res.status(404).json({
                message: "Role not found"
            });
        }

        const updatedRole = Role.findByIdAndUpdate(req.params.id, {
            name: name || role.name,
            description: description || role.description
        });

        res.status(200).json({
            message: "Role updated successfully",
            data: updatedRole
        });
    } catch (error) {
        res.status(500).json({
            message: "Error updating role",
            error: error.message
        });
    }
});

// DELETE - Soft delete /api/v1/roles/:id
router.delete('/:id', (req, res) => {
    try {
        const role = Role.findByIdAndDelete(req.params.id);

        if (!role) {
            return res.status(404).json({
                message: "Role not found"
            });
        }

        res.status(200).json({
            message: "Role deleted successfully",
            data: role
        });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting role",
            error: error.message
        });
    }
});

// GET all users by role id /api/v1/roles/:id/users
router.get('/:id/users', (req, res) => {
    try {
        const role = Role.findById(req.params.id);
        
        if (!role || role.isDeleted) {
            return res.status(404).json({
                message: "Role not found"
            });
        }

        const users = User.find({ 
            role: req.params.id, 
            isDeleted: false 
        });

        res.status(200).json({
            message: `Get all users with role: ${role.name}`,
            role: role,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            message: "Error getting users by role",
            error: error.message
        });
    }
});

module.exports = router;
