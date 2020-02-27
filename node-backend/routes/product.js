const express = require("express");
const router = express.Router();
const fs = require("fs");
const axios = require("axios");
const multer = require("multer");
const _ = require("lodash");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const { mimetype } = file;
  if (
    mimetype === "image/png" ||
    mimetype === "image/jpeg" ||
    mimetype === "application/pdf"
  ) {
    cb(null, true);
  } else {
    return cb(new Error("Invalid file type"), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

router.post(
  "/createNewProduct",
  [
    upload.fields([
      { name: 0, maxCount: 5 },
      { name: 1, maxCount: 5 }
    ])
  ],
  async (req, res) => {
    console.log(req.files);

    res.send("Images received!");
  }
);

module.exports = router;
