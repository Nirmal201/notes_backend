const Note = require("../models/note");
const User = require("../models/user");

const initialNotes = [
  {
    content: "HTML is easy",
    important: false,
  },
  {
    content: "Browser can execute only Javascript",
    important: true,
  },
];

const nonExistingId = async () => {
  const note = new Note({ content: "willremovethissoon" });
  console.log("note object casted using mongoose model - ", note);
  await note.save();
  console.log("note object actually saved in mongoose database - ", note);

  await note.remove();
  console.log("note object actually removed in mongoose database - ", note);

  console.log("Is the _id property exists.... - ", note._id.toString());

  return note._id.toString();
};

const noteInDb = async () => {
  const notes = await Note.find({});
  return notes.map((note) => note.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

module.exports = {
  initialNotes,
  nonExistingId,
  noteInDb,
  usersInDb,
};
