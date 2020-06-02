const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

const noteSchema = new mongoose.Schema({
  content: { type: String, minlength: 3, required: true },
  date: Date,
  important: Boolean,
});

noteSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject._v;
  },
});

module.exports = mongoose.model("Note", noteSchema);
