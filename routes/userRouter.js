const router = require('express').Router();
const { deleteUser } = require('../controllers/userControllers');

router.delete('/:_id', deleteUser)

module.exports = router;