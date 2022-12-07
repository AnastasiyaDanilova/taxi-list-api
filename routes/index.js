const router = require('express').Router();
const authRegisterRouter = require('./authRegisterRouter');
const notesRouter = require('./noteRouter')
const userRouter = require('./userRouter')

router.use(authRegisterRouter);

router.use('/notes', notesRouter);

router.use('/users', userRouter)

module.exports = router;