const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');

router.post('/notes', noteController.createNote);
router.get('/notes/:id', noteController.getNote);
router.put('/notes/:id', noteController.updateNote);

module.exports = router;