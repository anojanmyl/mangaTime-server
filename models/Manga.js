const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mangaSchema = new Schema({
  rank: Number,
  title: String,
  start_date: String,
  score: Number,
  image_url: String,
  description: String,
  userId: [String],
  chapters: String,
});

const Manga = mongoose.model("Manga", mangaSchema);

module.exports = Manga;
