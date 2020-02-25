const Mailgen = require("mailgen");

// Configure mailgen by setting a theme and your product info
const mailGenerator = new Mailgen({
  theme: "default",
  product: {
    // Appears in header & footer of e-mails
    name: "Mailgen",
    link: "https://mailgen.js/"
    // Optional product logo
    // logo: 'https://mailgen.js/img/logo.png'
  }
});

const email = {
  body: {
    name: "John Appleseed",
    intro: "Welcome to Mailgen! We're very excited to have you on board.",
    action: {
      instructions: "To get started with Mailgen, please click here:",
      button: {
        color: "#22BC66", // Optional action button color
        text: "Confirm your account",
        link: "https://mailgen.js/confirm?s=d9729feb74992cc3482b350163a1a010"
      }
    },
    outro:
      "Need help, or have questions? Just reply to this email, we'd love to help."
  }
};

// Generate an HTML email with the provided contents
const emailBody = mailGenerator.generate(email);

// Generate the plaintext version of the e-mail (for clients that do not support HTML)
const emailText = mailGenerator.generatePlaintext(email);

// Optionally, preview the generated HTML e-mail by writing it to a local file

// require("fs").writeFileSync("preview.html", emailBody, "utf8");

// `emailBody` now contains the HTML body,
// and `emailText` contains the textual version.
//
// It's up to you to send the e-mail.
// Check out nodemailer to accomplish this:
// https://nodemailer.com/

router.post("/sendVerificationEmail", async (req, res) => {
  console.log(req.body);
  require("fs").writeFileSync("preview.html", emailBody, "utf8");
  res.send("Email sent!!!!!!!!!!!!!!!!!!!!!!!!");
});

module.exports = router;
