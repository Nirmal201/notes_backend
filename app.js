const config = require("./utils/config");
const express = require("express");
require("express-async-errors");
const app = express();
const cors = require("cors");
const notesRouter = require("./controllers/notes");
const userRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const mongoose = require("mongoose");

logger.info("connecting to ", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((e) => {
    logger.error("error connecting to MongoDB", e.message);
  });

app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use(middleware.requestLogger);

app.use("/api/notes", notesRouter);
app.use("/api/users", userRouter);
app.use("/api/login", loginRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
// ***  original in INDEX file ***

// app.get("/", (req, res) => {
//   console.log(res);
//   res.send("<h1>Hello World</h1>");
// });

// //GET all
// app.get("/api/notes", (req, res) => {
//   Note.find({}).then((notes) => {
//     res.json(notes.map((note) => note.toJSON()));
//   });
// });

// //POST
// app.post("/api/notes", (req, res, next) => {
//   const body = req.body;

//   if (body.content === undefined) {
//     return res.status(400).json({ error: "content missing" });
//   }
//   const note = new Note({
//     content: body.content,
//     important: body.important || false,
//     date: new Date(),
//   });

//   note
//     .save()
//     .then((savedNote) => savedNote.toJSON())
//     .then((savedAndFormattedNote) => {
//       res.json(savedAndFormattedNote);
//     })
//     .catch((error) => next(error));
// });

// //GET by id
// app.get("/api/notes/:id", (req, res, next) => {
//   Note.findById(req.params.id)
//     .then((note) => {
//       if (note) {
//         res.json(note);
//       } else {
//         res.status(404).end();
//       }
//     })
//     .catch((error) => {
//       next(error);
//     });
// });

// //DELETE
// app.delete("/api/notes/:id", (req, res, next) => {
//   Note.findByIdAndRemove(req.params.id)
//     // eslint-disable-next-line no-unused-vars
//     .then((result) => {
//       res.status(204).end();
//     })
//     .catch((error) => {
//       next(error);
//     });
// });

// //PUT
// app.put("/api/notes/:id", (req, res, next) => {
//   const body = req.body;

//   const note = {
//     content: body.content,
//     important: body.important,
//   };
//   Note.findByIdAndUpdate(req.params.id, note, {
//     new: true,
//   })
//     .then((updatedNote) => res.json(updatedNote))
//     .catch((error) => next(error));
// });

// //unknown Endpoint
// const unknownEndpoint = (request, response) => {
//   response.status(404).send({ error: "unknown endpoint" });
// };
// app.use(unknownEndpoint);

// //Error Handler
// const errorHandler = (error, req, res, next) => {
//   console.log(error.message);
//   if (error.name === "CastError" && error.kind === "ObjectId") {
//     return res.status(400).send({ error: "malformatted id" });
//   } else if (error.name === "ValidationError") {
//     return res.status(400).json({ error: error.message });
//   }
//   next(error);
// };
// app.use(errorHandler);

// *** END of original in INDEX file ***

// eslint-disable-next-line no-undef
// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
//   console.log(`Server running on ${PORT}....`);
// });
