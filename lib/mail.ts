import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email: string, token: string) => {
  const verifyUrl = `${process.env.CLIENT_URL}/auth/new-verification?token=${token}`;

  // Create a transporter using SMTP transport
  const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_APP_PASS,
    },
  });

  // Email data
  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: email,
    subject: "Verify your Chatz account",
    text: "Please verify your email",
    html: `
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta http-equiv="X-UA-Compatible" content="IE=edge">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Verify Your Chatz Account</title>
              <style>
                  body {
                      font-family: Arial, sans-serif;
                      background-color: #f5f5f5;
                      margin: 0;
                      padding: 0;
                  }
                  .container {
                      max-width: 600px;
                      margin: 20px auto;
                      padding: 20px;
                      background-color: #fff;
                      border-radius: 5px;
                      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                  }
                  h1, h3 {
                      color: #333;
                  }
                  p {
                      color: #555;
                  }
                  a {
                      color: #007bff;
                      text-decoration: none;
                  }
                  a:hover {
                      text-decoration: underline;
                  }
              </style>
          </head>
          <body>
              <div class="container">
                  <h1>Hello ${email},</h1>
                  <p>You've registered an account on Chatz. Before you can start using your account, we need to verify that this email address belongs to you.</p>
                  <p>Please click the button below to verify your account:</p>
                  <p>
                      <a href="${verifyUrl}" style="display: inline-block; background-color: #007bff; color: #fff; padding: 10px 20px; border-radius: 5px; text-decoration: none;">Verify Account</a>
                  </p>
                  <p>If you didn't create an account with us, you can safely ignore this email.</p>
                  <h3>Kind Regards,<br><a href="${process.env.CLIENT_URL}" style="color: #007bff; text-decoration: none;">Chatz</a></h3>
              </div>
          </body>
          </html>
        `,
  };

  //console.log("mailOptions created");

  await transporter.sendMail(mailOptions);
  //console.log("sent verification");
};
export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetUrl = `${process.env.CLIENT_URL}/auth/new-password?token=${token}`;

  // Create a transporter using SMTP transport
  const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_APP_PASS,
    },
  });

  // Email data
  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: email,
    subject: "Reset your password",
    text: "Reset your password",
    html: `
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta http-equiv="X-UA-Compatible" content="IE=edge">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Reset your password</title>
              <style>
                  body {
                      font-family: Arial, sans-serif;
                      background-color: #f5f5f5;
                      margin: 0;
                      padding: 0;
                  }
                  .container {
                      max-width: 600px;
                      margin: 20px auto;
                      padding: 20px;
                      background-color: #fff;
                      border-radius: 5px;
                      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                  }
                  h1, h3 {
                      color: #333;
                  }
                  p {
                      color: #555;
                  }
                  a {
                      color: #007bff;
                      text-decoration: none;
                  }
                  a:hover {
                      text-decoration: underline;
                  }
              </style>
          </head>
          <body>
              <div class="container">
                  <h1>Hello ${email},</h1>
                  <p>
                      <a href="${resetUrl}" style="display: inline-block; background-color: #007bff; color: #fff; padding: 10px 20px; border-radius: 5px; text-decoration: none;">Reset Your Password</a>
                  </p>
                  <p>If you did not request this email, you can safely ignore this email.</p>
                  <h3>Kind Regards,<br><a href="${process.env.CLIENT_URL}" style="color: #007bff; text-decoration: none;">Chatz</a></h3>
              </div>
          </body>
          </html>
        `,
  };

  //console.log("mailOptions created");

  await transporter.sendMail(mailOptions);
  //console.log("sent reset");
};
