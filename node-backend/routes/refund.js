// import RefundLabel from "refundLabelPDF/RefundLabel.jpg";
const express = require("express");
const router = express.Router();
const QRCode = require('easyqrcodejs-nodejs');

const PDFDocument = require("pdfkit");
const fs = require("fs");
// const RefundLabel = require('../refundLabelPDF/RefundLabel.jpg');
const generatePDF = (deliveryAddress,name,refundNumber, refundId) => {

    let doc = new PDFDocument();
    let date = new Date ();
    let dd = date.getDate();
    let mm = date.getMonth() +1;
    let yyyy = date.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    let today = dd + '/' + mm + '/' + yyyy;

    const options = {
        text: refundId.toString(),
        // title: refundNumber,
        titleFont: "bold 22px Arial",
        titleHeight: 50,
        titleBackgroundColor: "#FBCEB1",
        subTitleColor: "black",
        width: 130,
        height: 130
    };
    const qrcode = new QRCode(options);
    // Save QRCode image
    qrcode.saveImage({
        path: './refundLabelPDF/qrcode.jpg' // save path
    });

    function doGeneratePDF(deliveryAddress,name,refundNumber, refundId) {
        doc.pipe(fs.createWriteStream("./refundLabelPDF/RefundLabel_" + refundId + ".pdf"));
        doc.image('./refundLabelPDF/RefundLabel.jpg',  0, 15, {width: 600, height: 770});
        doc.image('./refundLabelPDF/addressFrom.jpg',  10, 410, {fit: [170, 170]});
        doc.image('./refundLabelPDF/qrcode.jpg', 200, 150, {fit: [200, 200]});
        doc.text("Refund No: " + refundNumber, 15, 395);
        doc.text(name, 15, 440);
        doc.text(deliveryAddress.line1, 15, 465);
        doc.text(deliveryAddress.line2, 15, 490);
        doc.text("S"+deliveryAddress.postalCode, 15, 515);
        doc.text("date created: " + today, 450, 680);
        doc.end();
    }

    setTimeout( () => {  doGeneratePDF(deliveryAddress,name,refundNumber, refundId) }, 10000);

};

router.post("/generateRefundPDF", async (req, res) => {
    // const { name, orderNum } = req.body;

    const deliveryAddress = JSON.parse(req.body.deliveryAddress);
    const name = req.body.name;
    const refundNumber = req.body.refundNumber;
    const refundId = req.body.refundId;
    // console.log(deliveryAddress);
    // console.log(name);
    // console.log(refundNumber);
    // console.log(refundId);
    generatePDF(deliveryAddress,name,refundNumber, refundId);

    }
);



module.exports = router;
