const express = require("express");
const router = express.Router();
const Mailgen = require("mailgen");
const Nodemailer = require("nodemailer");
const mailGenerator = new Mailgen({
  theme: "default",
  product: {
    // Appears in header & footer of e-mails
    name: "Apricot & Nut",
    link: "http://localhost:3000"
    // Optional product logo
    // logo: 'https://mailgen.js/img/logo.png'
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
      intro: "Welcome to Apricot & Nut.",
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
      intro: "Welcome to Apricot & Nut.",
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
        instructions:
            "Forget something? Click below to go to your cart",
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

module.exports = router;
