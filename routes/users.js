const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Manga = require("../models/Manga");
const protectPrivateRoute = require("../middlewares/protectPrivateRoute");
const requireAuth = require("../middlewares/requireAuth");

router.patch("/me", (req, res, next) => {
  const userId = req.session.currentUser;

  // If no file is sent, req.file is undefined, leading to an error when trying to
  // acces req.file.path (undefined.path) => Cannot read property path of undefined.
  if (req.file) {
    req.body.profileImg = req.file.path; // Add profileImage key to req.body
  }

  User.findByIdAndUpdate(userId, req.body, { new: true })
    .select("-password") // Remove the password field from the found document.
    .then((userDocument) => {
      res.status(200).json(userDocument);
    })
    .catch(next);
});

router.get("/me", (req, res, next) => {
  User.findById(req.session.currentUser)
    .select("-password") // Remove the password field from the found document.
    .then((userDocument) => {
      return res.status(200).json(userDocument);
    })
    .catch(next);
});

router.get("/me/mangas", (req, res, next) => {
  const currentUserId = req.session.currentUser; // We retrieve the users id from the session.

  // And then get all the items matching the id_user field that matches the logged in users id.
  Manga.find({ userId: currentUserId })
    .then((documents) => {
      res.status(200).json(documents);
    })
    .catch(next);
});

router.patch(`/manga`, async (req, res, next) => {
  const userId = req.session.currentUser;
  const totalmanga = req.body;
  console.log(req.body);
  try {
    const userUpdate = await User.findByIdAndUpdate(userId, {
      $push: { totalmanga: totalmanga },
    });
    res.json(userUpdate);
  } catch (error) {
    next(error);
  }
});

//ICI
router.get("/dashboard", requireAuth, async (req, res, next) => {
  const userId = req.session.currentUser;

  try {
    const user = await User.findById(userId);
    res.status(200).json(user.totalmanga);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.patch("/me/manga", async (req, res, next) => {
  const userId = req.session.currentUser;

  // Regarder dans req.body
  // prendre les infos qui nous interessent ,
  // update le user (on peut recuperer son id dans la session)
  // update la bonne clé dans le model user
  // ne pas oublier d'update la fonction dans apiHandler qui devrait pointer sur cette route
  // (updateUserMangas)

  console.log(req.body);

  try {
    const mangas = req.body.mangas;

    User.findByIdAndUpdate(userId, { totalmanga: mangas }, { new: true }).then(
      (updatedDocument) => {
        return res.status(200).json(updatedDocument);
      }
    );
  } catch (error) {
    next(error);
  }
});

router.patch("/dashboard", async (req, res, next) => {
  const userId = req.session.currentUser;
  console.log("REQ", req.body);
  try {
    const mangaId = req.body.mangaId;

    User.findByIdAndUpdate(
      userId,
      { $pull: { totalmanga: { id: mangaId } } },
      { new: true }
    ).then((updatedDocument) => {
      return res.status(200).json(updatedDocument);
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
