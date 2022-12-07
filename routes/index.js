const router = require('express').Router();
const authRegisterRouter = require('./authRegisterRouter');
const notesRouter = require('./noteRouter')

router.use(authRegisterRouter);

router.use('/notes', notesRouter);

module.exports = router;