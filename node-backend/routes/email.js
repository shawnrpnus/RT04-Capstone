const express = require("express");
const router = express.Router();
const Mailgen = require("mailgen");
const Nodemailer = require("nodemailer");
const mailGenerator = new Mailgen({
  theme: "default",
  product: {
    // Appears in header & footer of e-mails
    name: "apricot & nut",
    link: "http://localhost:3000",
    // Optional product logo
    logo:
      "https://res.cloudinary.com/rt04capstone/image/upload/v1583433855/rsz_1apricot-nut-logo-word_jzhocy.png",
    copyright: "Copyright © 2020 apricot & nut. All rights reserved."
  }
});
const transporter = Nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "rt04capstone@gmail.com", // generated ethereal user
    pass: "retailretail" // generated ethereal password
  }
});

// req fields: email, fullName, link
router.post("/sendVerificationEmail", async (req, res) => {
  const { email, fullName, link } = req.body;
  const emailContent = {
    body: {
      name: `${fullName}`,
      intro: "Welcome to apricot & nut.",
      action: {
        instructions:
          "Thank you for registering! Get started by verifying your account below",
        button: {
          color: "#22BC66", // Optional action button color
          text: "Verify",
          link: link
        }
      },
      outro: "This link is valid for 1 hour."
    }
  };

  const emailBody = mailGenerator.generate(emailContent);
  const emailText = mailGenerator.generatePlaintext(emailContent);

  transporter.sendMail(
    {
      from: "rt04capstone@gmail.com",
      to: email,
      subject: "Verify your account",
      text: emailText,
      html: emailBody
    },
    (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).send({ message: "Email failed to send" });
      } else {
        res.status(200).send({ message: "Email Sent" });
      }
    }
  );
});

router.post("/sendForgotPasswordEmail", async (req, res) => {
  const { email, fullName, link } = req.body;
  const emailContent = {
    body: {
      name: `${fullName}`,
      intro: "Welcome to apricot & nut",
      action: {
        instructions:
          "Forgot your password? Click the button below to reset it:",
        button: {
          color: "#22BC66", // Optional action button color
          text: "Reset Password",
          link: link
        }
      },
      outro: "This link is valid for 1 hour."
    }
  };

  const emailBody = mailGenerator.generate(emailContent);
  const emailText = mailGenerator.generatePlaintext(emailContent);

  transporter.sendMail(
    {
      from: "rt04capstone@gmail.com",
      to: email,
      subject: "Reset your password",
      text: emailText,
      html: emailBody
    },
    (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).send({ message: "Email failed to send" });
      } else {
        res.status(200).send({ message: "Email Sent" });
      }
    }
  );
});

router.post("/sendUnattendedCartEmail", async (req, res) => {
  const { email, fullName, link } = req.body;
  const emailContent = {
    body: {
      name: `${fullName}`,
      intro: "You left something in your shopping cart!",
      action: {
        instructions: "Forget something? Click below to go to your cart",
        button: {
          color: "#22BC66", // Optional action button color
          text: "Go to cart",
          link: link
        }
      }
    }
  };

  const emailBody = mailGenerator.generate(emailContent);
  const emailText = mailGenerator.generatePlaintext(emailContent);

  transporter.sendMail(
    {
      from: "rt04capstone@gmail.com",
      to: email,
      subject: "Hi, you've left something in your shopping cart!",
      text: emailText,
      html: emailBody
    },
    (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).send({ message: "Email failed to send" });
      } else {
        res.status(200).send({ message: "Email Sent" });
      }
    }
  );
});

router.post("/contactUsConfirmation", async (req, res) => {
  const { email, fullName, contactUsCategory } = req.body;

  let response;

  switch (contactUsCategory.toUpperCase()) {
    case "COMPLAINT":
      response =
        "Thank you for your feedback. We hope to improve ourselves and serve you better"; // code block
      break;
    case "SUPPORT":
      response =
        "Thank you for contacting us. Our customer service staff will be in touch with you shortly";
      break;
    case "COMPLIMENT":
      response =
        "Thank you for the compliment! On behalf of apricot & nut, we would like to express gratitude for your continuous support.";
      break;
    default:
      response =
        "Thank you for your feedback. Hope you had a wonderful experiencing shopping on apricot & nut";
  }

  const emailContent = {
    body: {
      name: fullName,
      intro: response,
      outro: [
        "\nNeed help, or have questions?",
        "Just reply to this email, we'd love to help."
      ]
    }
  };

  const emailBody = mailGenerator.generate(emailContent);
  const emailText = mailGenerator.generatePlaintext(emailContent);

  transporter.sendMail(
    {
      from: "rt04capstone@gmail.com",
      to: email,
      subject: "apricot & nut - Feedback confirmation email",
      text: emailText,
      html: emailBody
    },
    (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).send({ message: "Email failed to send" });
      } else {
        res.status(200).send({ message: "Email Sent" });
      }
    }
  );
});

router.post("/replyToEmail", async (req, res) => {
  const { email, fullName, contactUsCategory, reply } = req.body;

  const emailContent = {
    body: {
      name: fullName,
      intro: reply,
      outro: [
        "\nNeed help, or have questions?",
        "Just reply to this email, we'd love to help."
      ]
    }
  };

  const emailBody = mailGenerator.generate(emailContent);
  const emailText = mailGenerator.generatePlaintext(emailContent);

  transporter.sendMail(
    {
      from: "rt04capstone@gmail.com",
      to: email,
      subject: "apricot & nut - Support Ticket",
      text: emailText,
      html: emailBody
    },
    (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).send({ message: "Email failed to send" });
      } else {
        res.status(200).send({ message: "Email Sent" });
      }
    }
  );
});

router.post("/massSendEmail", async (req, res) => {
  const {
    subject,
    emails: list,
    intro,
    instructions,
    buttonText: text,
    link
  } = req.body;
  const enableAction = instructions && text && link;
  const emails = list.split(",");

  Promise.all(
    emails.map(email => {
      const emailContent = {
        body: {
          title: subject,
          intro,
          action: enableAction
            ? {
                instructions,
                button: {
                  color: "#22BC66", // Action button color
                  text,
                  link
                }
              }
            : null
        }
      };

      const emailBody = mailGenerator.generate(emailContent);
      const emailText = mailGenerator.generatePlaintext(emailContent);

      transporter.sendMail(
        {
          from: "rt04capstone@gmail.com",
          to: email,
          subject,
          text: emailText,
          html: emailBody
        },
        (error, info) => {
          if (error) {
            console.log(error);
          } else {
            console.log(info);
            return true;
          }
        }
      );
    })
  )
    .then(() => {
      console.log("Email Sent");
      res.status(200).send({ message: "Email Sent" });
    })
    .catch(err => {
      console.log(err.response);
      res.status(500).send(err.response);
    });
});

// send delivery notification
router.post("/deliveryNotification", async (req, res) => {
  // const { email, orderNumber, fullName } = req.body;
  console.log(req.body);
  console.log("parsing");
  console.log(JSON.stringify(req.body));

  // intro = [];

  // const emailContent = {
  //   body: {
  //     name: fullName,
  //     intro: `Your purchase(s) with order no. (${orderNumber}) will be delivered today! Please be there to collect your items!`
  //   }
  // };

  // const emailBody = mailGenerator.generate(emailContent);
  // const emailText = mailGenerator.generatePlaintext(emailContent);

  // transporter.sendMail(
  //   {
  //     from: "rt04capstone@gmail.com",
  //     to: email,
  //     subject: "apricot & nut - Your purchase(s) is/are coming to you!",
  //     text: emailText,
  //     html: emailBody
  //   },
  //   (error, info) => {
  //     if (error) {
  //       console.log(error);
  //       res.status(500).send({ message: "Email failed to send" });
  //     } else {
  //       res.status(200).send({ message: "Email sent" });
  //     }
  //   }
  // );
  res.status(200).send({ message: "Email Sent" });
});

// send refund label
router.post("/sendRefundLabel", async (req, res) => {
  const deliveryAddress = JSON.parse(req.body.deliveryAddress);
  const name = req.body.name;
  const refundNumber = req.body.refundNumber;
  const orderNumber = req.body.orderNumber;
  const refundId = req.body.refundId;
  const email = req.body.email;
  console.log(email);
  console.log(name);
  const emailContent = {
    body: {
      name: `${name}`,
      intro:
        "We've submitted a refund for your returned merchandise. You can find the refund label attached.",
      outro:
        "We hope you'll shop with us again. " +
        "Feel free to contact us @ 6512 5534 with any questions. "
    }
  };

  const emailBody = mailGenerator.generate(emailContent);
  const emailText = mailGenerator.generatePlaintext(emailContent);

  const path =
    __dirname.split("routes")[0] +
    `refundLabelPDF\\RefundLabel_${refundId}.pdf`;

  transporter.sendMail(
    {
      from: "rt04capstone@gmail.com",
      to: email,
      subject: `We’ve Submitted a Refund for Order ${orderNumber}`,
      text: emailText,
      html: emailBody,
      attachments: [
        {
          filename: `RefundLabel_${refundId}`,
          path,
          contentType: "application/pdf"
        }
      ]
    },
    (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).send({ message: "Email failed to send" });
      } else {
        res.status(200).send({ message: "Email Sent" });
      }
    }
  );
});

module.exports = router;
