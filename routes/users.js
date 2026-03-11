var express = require('express');
var router = express.Router();
let User = require('../schemas/users');

// CREATE - POST /api/v1/users
router.post('/', (req, res) => {
    try {
        const { username, password, email, fullName, avatarUrl, role } = req.body;
        
        // Validate required fields
        if (!username || !password || !email) {
            return res.status(400).json({
                message: "username, password, and email are required"
            });
        }

        // Check if user already exists
        const existingUser = User.findOne({
            $or: [{ username }, { email }]
        });

        if (existingUser) {
            return res.status(400).json({
                message: "username or email already exists"
            });
        }

        const user = User.create({
            username,
            password,
            email,
            fullName: fullName || "",
            avatarUrl: avatarUrl || "https://i.sstatic.net/l60Hf.png",
            role
        });

        res.status(201).json({
            message: "User created successfully",
            data: user
        });
    } catch (error) {
        res.status(500).json({
            message: "Error creating user",
            error: error.message
        });
    }
});

// READ - GET all users /api/v1/users
router.get('/', (req, res) => {
    try {
        const users = User.find({ isDeleted: false });
        res.status(200).json({
            message: "Get all users successfully",
            data: users
        });
    } catch (error) {
        res.status(500).json({
            message: "Error getting users",
            error: error.message
        });
    }
});

// READ - GET user by id /api/v1/users/:id
router.get('/:id', (req, res) => {
    try {
        const user = User.findById(req.params.id);
        
        if (!user || user.isDeleted) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "Get user successfully",
            data: user
        });
    } catch (error) {
        res.status(500).json({
            message: "Error getting user",
            error: error.message
        });
    }
});

// UPDATE - PUT /api/v1/users/:id
router.put('/:id', (req, res) => {
    try {
        const { fullName, avatarUrl, role } = req.body;
        
        const user = User.findById(req.params.id);
        
        if (!user || user.isDeleted) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const updatedUser = User.findByIdAndUpdate(req.params.id, {
            fullName: fullName || user.fullName,
            avatarUrl: avatarUrl || user.avatarUrl,
            role: role || user.role
        });

        res.status(200).json({
            message: "User updated successfully",
            data: updatedUser
        });
    } catch (error) {
        res.status(500).json({
            message: "Error updating user",
            error: error.message
        });
    }
});

// DELETE - Soft delete /api/v1/users/:id
router.delete('/:id', (req, res) => {
    try {
        const user = User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "User deleted successfully",
            data: user
        });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting user",
            error: error.message
        });
    }
});

// ENABLE - POST /api/v1/users/enable
router.post('/enable', async (req, res) => {
    try {
        const { email, username } = req.body;

        if (!email || !username) {
            return res.status(400).json({
                message: "email and username are required"
            });
        }

        const user = await User.findOneAndUpdate(
            { email, username, isDeleted: false },
            { status: true },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found or invalid email/username"
            });
        }

        res.status(200).json({
            message: "User enabled successfully",
            data: user
        });
    } catch (error) {
        res.status(500).json({
            message: "Error enabling user",
            error: error.message
        });
    }
});

// DISABLE - POST /api/v1/users/disable
router.post('/disable', async (req, res) => {
    try {
        const { email, username } = req.body;

        if (!email || !username) {
            return res.status(400).json({
                message: "email and username are required"
            });
        }

        const user = await User.findOneAndUpdate(
            { email, username, isDeleted: false },
            { status: false },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found or invalid email/username"
            });
        }

        res.status(200).json({
            message: "User disabled successfully",
            data: user
        });
    } catch (error) {
        res.status(500).json({
            message: "Error disabling user",
            error: error.message
        });
    }
});

module.exports = router;
