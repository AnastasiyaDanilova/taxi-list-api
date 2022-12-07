const router = require('express').Router();

const {createNote, getNotes, deleteNote} = require('../controllers/noteControllers')


router.post('/', createNote)

router.get('/', getNotes)

router.delete('/:noteId', deleteNote)

module.exports = router;