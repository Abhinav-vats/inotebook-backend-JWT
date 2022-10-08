const mongoose = require('mongoose');

const NotesSchema = new mongoose.Schema({
    title:  {
        type: String,
        required: true
    },
    description:  {
        type: String,
        required: true,
        unique:true
    },
    tag:  {
        type: String,
        default: "General"
    },
    date:  {
        type: Date,
        default: Date.now
    },

});
const Notes  = mongoose.model('notes', NotesSchema);
Notes.createIndexes();

module.exports = Notes;