const express = require("express");
const router = express.Router();
const fs = require("fs");
const axios = require("axios");
const _ = require("lodash");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
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

router.post(
  "/createNewProduct",
  [
    upload.fields([
      { name: 0, maxCount: 5 },
      { name: 1, maxCount: 5 },
      { name: 2, maxCount: 5 },
      { name: 3, maxCount: 5 },
      { name: 4, maxCount: 5 },
      { name: 5, maxCount: 5 },
      { name: 6, maxCount: 5 },
      { name: 7, maxCount: 5 },
      { name: 8, maxCount: 5 },
      { name: 9, maxCount: 5 },
      { name: 10, maxCount: 5 },
      { name: 11, maxCount: 5 },
      { name: 12, maxCount: 5 },
      { name: 13, maxCount: 5 },
      { name: 14, maxCount: 5 },
      { name: 15, maxCount: 5 }
    ])
  ],
  async (req, res) => {
    const request = JSON.parse(req.body.request);

    // An array of array
    const filesArray = Object.values(req.files);
    let imageUrls;

    filesArray.map((files, index) => {
      imageUrls = [];
      Promise.all(
        files.map(async ({ originalname }, idx) => {
          await cloudinary.uploader
            .upload(`./uploads/${originalname}`, {
              public_id: originalname,
              width: 500,
              height: 500,
              crop: "fit"
              // tags: "basic_sample",
              // effect: "saturation:-70"
            })
            .then(image => {
              if (request.colourToImageUrlsMaps[index].imageUrls) {
                request.colourToImageUrlsMaps[index].imageUrls.push(
                  image.secure_url
                );
              } else {
                request.colourToImageUrlsMaps[index].imageUrls = [
                  image.secure_url
                ];
                delete request.colourToImageUrlsMaps[index].files;
              }
            })
            .catch(err => {
              res.status(400).send(err);
            });
        })
      )
        .then(async () => {
          await axios
            .post(
              process.env.SPRING_API_URL + "/product/createNewProduct",
              request
            )
            .then(response => {
              console.log(request);
              return res.send(request);
            })
            .catch(err => {
              console.log(err);
              return res.status(400).send(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    });

    if (filesArray.length === 0) {
      request.colourToImageUrlsMaps.map((e, index) => {
        request.colourToImageUrlsMaps[index].imageUrls = [];
        delete request.colourToImageUrlsMaps[index].files;
      });

      axios
        .post(process.env.SPRING_API_URL + "/product/createNewProduct", request)
        .then(response => {
          return res.send(request);
        })
        .catch(err => {
          console.log(err);
          return res.status(400).send(err);
        });
    }
  }
);

router.put(
  "/updateProductVariantImages",
  [upload.fields([{ name: "images", maxCount: 5 }])],
  async (req, res) => {
    const request = JSON.parse(req.body.request);
    request.imageUrls = [];

    const images = req.files.images;

    images.map(({ originalname }, index) => {
      cloudinary.uploader
        .upload(`./uploads/${originalname}`, {
          public_id: originalname,
          width: 500,
          height: 500,
          crop: "fit"
          // tags: "basic_sample",
          // effect: "saturation:-70"
        })
        .then(image => {
          request.imageUrls.push(image.secure_url);
          if (index === images.length - 1) {
            console.log(request);
            axios
              .put(
                process.env.SPRING_API_URL + "/productImage/updateProductImage",
                request
              )
              .then(response => {
                return res.send(request);
              })
              .catch(err => {
                return res.status(400).send(err);
              });
          }
        })
        .catch(err => {
          res.status(400).send(err);
        });
    });
  }
);

module.exports = router;
