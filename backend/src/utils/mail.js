import Mailgen from "mailgen";
import nodemailer from "nodemailer";


const sendEmail = async (options) => {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Authentication & Authorization",
      link: "****",
    },
  });

  const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent);
  const emailHtml = mailGenerator.generate(options.mailgenContent);

  try {
    // 1️Create Ethereal test account
    const testAccount = await nodemailer.createTestAccount();

    // 2️Create transporter using Ethereal
    const transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const mail = {
      from: "MERN APP <no-reply@mernapp.com>",
      to: options.email,
      subject: options.subject,
      text: emailTextual,
      html: emailHtml,
    };

    // Send mail
    const info = await transporter.sendMail(mail);

    // Log preview URL
    console.log(" Email Verification Preview URL :", nodemailer.getTestMessageUrl(info));

  } catch (error) {
    console.error("Email sending failed:", error);
  }
};



const emailVerificationMailgenContent = (username, verficationUrl) => {
  return {
    body: {
      name: username,
      intro: "Welcome to our App! we'are excited to have you on board.",
      action: {
        instructions:
          "To verify your email please click on the following button",
        button: {
          color: "#22BC66",
          text: "Verify your email",
          link: verficationUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

const forgotPasswordMailgenContent = (username, passwordResetUrl) => {
  return {
    body: {
      name: username,
      intro: "We got a request to reset the password of your account",
      action: {
        instructions:
          "To reset your password click on the following button or link",
        button: {
          color: "#22BC66",
          text: "Reset password",
          link: passwordResetUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

export {
  emailVerificationMailgenContent,
  forgotPasswordMailgenContent,
  sendEmail,
};
