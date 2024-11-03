const express = require('express');
const router = express.Router();
const Note = require('../modls/note'); // Ensure the path is correct
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/jwt');
const NoteController = require('../controller/notecontroller');

// Get all notes
router.get('/', auth, NoteController.getAllNotes);

// Get a note by ID
router.get('/:id', auth, NoteController.getNoteById);

// Create a new note with validation
router.post(
    '/',
    auth,
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    NoteController.createNote
);

// Update a note with validation
router.put(
    '/:id',
    auth,
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().notEmpty().withMessage('Description cannot be empty'),
    NoteController.updateNote
);

// Delete a note
router.delete('/:id', auth, NoteController.deleteNote);

module.exports = router;