const notesRouter = require("express").Router();
const Note = require("../models/note");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

notesRouter.get("/", async (req, res) => {
  const notes = await Note.find({}).populate("user", { username: 1, name: 1 });
  res.json(notes.map((note) => note.toJSON()));
});

notesRouter.get("/:id", async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (note) {
    res.json(note.toJSON());
  } else {
    res.status(404).end();
  }
});

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  console.log("autho", authorization);

  if (authorization && authorization.toLowerCase().startsWith("bearer")) {
    return authorization.substring(7);
  }
  return null;
};
notesRouter.post("/", async (request, response) => {
  const body = request.body;
  console.log("body", body);
  const token = getTokenFrom(request);
  console.log("Token", token);

  const decodedToken = jwt.verify(token, process.env.SECRET);
  console.log("decodeToken", decodedToken);

  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  const user = await User.findById(decodedToken.id);

  console.log("user", user);

  const note = new Note({
    content: body.content,
    important: body.important === undefined ? false : body.important,
    date: new Date(),
    user: user._id,
  });

  const savedNote = await note.save();
  user.notes = user.notes.concat(savedNote._id);
  await user.save();

  response.json(savedNote.toJSON());
});

notesRouter.delete("/:id", async (request, response) => {
  await Note.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

notesRouter.put("/:id", (request, response, next) => {
  const body = request.body;

  const note = {
    content: body.content,
    important: body.important,
  };

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then((updatedNote) => {
      response.json(updatedNote.toJSON());
    })
    .catch((error) => next(error));
});

module.exports = notesRouter;
