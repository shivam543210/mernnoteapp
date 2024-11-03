const Note = require('../modls/note'); // Ensure this path is correct
const { validationResult } = require('express-validator');

// Get all notes for the authenticated user
exports.getAllNotes = async (req, res) => {
    try {
        const notes = await Note.find({ userId: req.user.id });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Get a note by ID
exports.getNoteById = async (req, res) => {
    try {
        const note = await Note.findOne({ _id: req.params.id, userId: req.user.id });
        if (!note) {
            return res.status(404).json({ message: 'Note not found or access denied' });
        }
        res.json(note);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Create a new note
exports.createNote = async (req, res) => {
    const errors = validationResult(req); //
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const note = new Note({
            title: req.body.title,
            description: req.body.description,
            userId: req.user.id,
        });
        const result = await note.save();
        res.status(201).json(result);
    } catch (error) {
        console.error("Error creating note:", error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Update a note
exports.updateNote = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const note = await Note.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            req.body,
            { new: true }
        );

        if (!note) {
            return res.status(404).json({ message: 'Note not found or access denied' });
        }
        res.json(note);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete a note
exports.deleteNote = async (req, res) => {
    try {
        const note = await Note.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!note) {
            return res.status(404).json({ message: 'Note not found or access denied' });
        }
        res.json({ message: 'Note deleted successfully', note });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
