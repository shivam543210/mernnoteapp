//make the schema for the note
const mongoose = require('mongoose');
const schema = mongoose.Schema;

const noteSchema = new schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: {
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model('note',noteSchema);
