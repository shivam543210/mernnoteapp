const express = require('express');
const router = express.Router();
const Note = require('../modls/note'); // Ensure the path is correct
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/jwt');

// Get all notes for the authenticated user
router.get('/', auth, async (req, res) => {
    try {
        const notes = await Note.find({ userId: req.user.id }); // Use req.user.id
        res.json(notes);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get a note by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const note = await Note.findOne({ _id: req.params.id, userId: req.user.id }); // Use req.user.id
        if (!note) {
            return res.status(404).json({ message: 'Note not found or access denied' });
        }
        res.json(note);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Post a new note with validation
router.post(
    '/',
    auth, // Ensure auth middleware is applied
    body('title').notEmpty().withMessage('Title is required'), // Validate title
    body('description').notEmpty().withMessage('Description is required'), // Validate description
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            // Log to verify req.user
            console.log("Authenticated user ID:", req.user.id);

            // Create a new Note document with userId from req.user.id
            const note = new Note({
                title: req.body.title,
                description: req.body.description,
                userId: req.user.user.id, // Attach authenticated user's ID
            });

            // Save the note to the database
            const result = await note.save();
            res.status(201).json(result); // Respond with created note
        } catch (error) {
            console.error("Error creating note:", error);
            res.status(500).json({ error: 'Server error' });
        }
    }
);

// Update a note with validation
router.put('/:id', 
    auth, 
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().notEmpty().withMessage('Description cannot be empty'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const note = await Note.findOneAndUpdate(
                { _id: req.params.id, userId: req.user.id }, // Use req.user.id
                req.body,
                { new: true } // Return the updated document
            );

            if (!note) {
                return res.status(404).json({ message: 'Note not found or access denied' });
            }
            res.json(note);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error' });
        }
    }
);

// Delete a note
router.delete('/:id', auth, async (req, res) => {
    try {
        const note = await Note.findOneAndDelete({ _id: req.params.id, userId: req.user.id }); // Use req.user.id
        if (!note) {
            return res.status(404).json({ message: 'Note not found or access denied' });
        }
        res.json({ message: 'Note deleted successfully', note });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
