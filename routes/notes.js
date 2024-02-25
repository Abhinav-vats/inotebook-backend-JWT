const express = require('express');

const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');


// ROUTE 1: Fetch all the notes of the user using GET "/api/notes/fetch". Doesn't require login    
router.get('/fetch', fetchuser, async (req, res) => {

    try {
        const notes = await Notes.find({ user: req.user.id });

        res.json(notes);

    } catch (err) {
        if (err.status != null && err.status != undefined) {

            res.status(err.status).json(err)
        } else
            res.status(500).send({ error: "INTERNAL SERVER ERROR" })
    }

})


// ROUTE 2: Add a new notes of the user using Post "/api/notes". Doesn't require login    
router.post('/',  [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be atleast of 5 characters').isLength({ min: 5 })
], fetchuser,async (req, res) => {

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, description, tag } = req.body;

        const note = new Notes({ title, description, tag, user: req.user.id })

        const savedNote = await note.save();

        res.json(savedNote);

    } catch (err) {
        if (err.status != null && err.status != undefined) {
            res.status(err.status).json(err)
        } else {
            res.status(500).send({ error: "INTERNAL SERVER ERROR" });
        }
    }

})

module.exports = router