const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: String,
  nickName: String,
  email: String,
  password: String,
  mangaId: [{ type: Schema.Types.ObjectId, ref: "Manga" }],
  data: {},
  totalmanga: [Object],
  chapters: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
