const Note = require('../models/note');

// ошибки
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');

// текст ошибок
const {
  validationErrorText,
  conflictErrorEmailText,
} = require('../utils/const');

function createNote(req, res, next) {
  const {                               // вытаскиваем данные записи из тела запроса
    name,
    adress,
    time,
  } = req.body;

  Note.create({                        // создание записи с данными из тела запроса 
    name,
    adress,
    time,
  })
    .then((note) => {
      res.send({
        adress,
        time,
        noteId: note._id,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const errObject = Object.keys(err.errors).join(', ');
        next(new BadRequestError(validationErrorText(errObject)));
        return;
      }
      if (err.code === 11000) {
        next(new ConflictError(conflictErrorEmailText));
        return;
      }
      next(err);
    });
}

function getNotes(req, res, next) {

  Note.find({})
    .then((notes) => {
      res.send(notes);
    })
    .catch((err) => next(err));
}

function deleteNote(req, res, next) {
  Note.findById(req.params.noteId)
    .then((note) => {
      if (!note) {
        throw new NotFoundError('Запрашиваемая запись не найдена');
      }

      return note.remove()
        .then(() => {
          res.send(note);
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный id записи'));
        return;
      }
      next(err);
    });
}

module.exports = {
  createNote,
  getNotes,
  deleteNote
};