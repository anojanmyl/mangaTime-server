const express = require("express");
const router = express.Router();
const Manga = require("../models/Manga");
// const uploader = require("../config/cloudinary");
const requireAuth = require("../middlewares/requireAuth"); // Route protection middleware : )

router.get("/", (req, res, next) => {
  Manga.find({})
    .populate("userId") // Gives us the author's id (id_user) object document instead of just the id : )
    .then((MangaDocuments) => {
      res.status(200).json(MangaDocuments);
    })
    .catch(next); // cf app.js error handling middleware
  // same as below
  //.catch(error => next(error))
});

router.post("/", requireAuth, (req, res, next) => {
  const updateValues = { ...req.body };

  if (req.file) {
    updateValues.image = req.file.path;
  }

  updateValues.userId = req.session.currentUser; // Retrieve the authors id from the session.

  Manga.create(updateValues)
    .then((mangaDocument) => {
      mangaDocument
        .populate("userId")
        .execPopulate() // Populate on .create() does not work, but we can use populate() on the document once its created !
        .then((manga) => {
          console.log("here");
          res.status(201).json(manga); // send the populated document.
        })
        .catch(next);
    })
    .catch(next);
});

router.patch("/:id", requireAuth, (req, res, next) => {
  const manga = { ...req.body };

  Manga.findById(req.params.id)
    .then((mangaDocument) => {
      if (!mangaDocument)
        return res.status(404).json({ message: "Manga not found" });
      if (mangaDocument.id_user.toString() !== req.session.currentUser) {
        return res
          .status(403)
          .json({ message: "You are not allowed to update this document" });
      }

      Manga.findByIdAndUpdate(req.params.id, manga, { new: true })
        .populate("userId")
        .then((updatedDocument) => {
          return res.status(200).json(updatedDocument);
        })
        .catch(next);
    })
    .catch(next);
});

router.delete("/:id", requireAuth, (req, res, next) => {
  Manga.findById(req.params.id)
    .then((mangaDocument) => {
      if (!mangaDocument) {
        return res.status(404).json({ message: "Manga not found" });
      }
      if (mangaDocument.userId.toString() !== req.session.currentUser) {
        return res.status(403).json({ message: "You can't delete this Manga" });
      }

      Manga.findByIdAndDelete(req.params.id)
        .then(() => {
          return res.sendStatus(204);
        })
        .catch(next);
    })
    .catch(next);
});

module.exports = router;
