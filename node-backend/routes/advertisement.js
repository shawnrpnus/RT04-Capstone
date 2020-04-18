const express = require("express");
const router = express.Router();
const axios = require("axios");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  },
});

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

router.get("/", (req, res) => {
  res.send("Node backend working");
});

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

router.post(
  "/createAdvertisement",
  upload.single("advertisement"),
  async (req, res) => {
    const request = JSON.parse(req.body.request);
    const file = req.file;
    const { originalname } = file;

    res.header("Access-Control-Allow-Origin", "*");
    cloudinary.uploader
      .upload(`./uploads/${originalname}`, {
        public_id: originalname,
        width: 1000,
        height: 517,
        crop: "fit",
      })
      .then((image) => {
        request.advertisementImgUrl = image.secure_url;
        axios
          .post(
            process.env.SPRING_API_URL + "/advertisement/createAdvertisement",
            request
          )
          .then((response) => {
            console.log(response.data);
            return res.send(request);
          })
          .catch((err) => {
            console.log(err.response.data);
            res.status(400).send(err.response.data);
          });
      })
      .catch((err) => {
        console.log(err.response.data);
        res.status(400).send(err);
      });
  }
);

module.exports = router;
