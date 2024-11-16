import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email: string, token: string) => {
  const verifyUrl = `${process.env.CLIENT_URL}/auth/new-verification?token=${token}`;
  const currentYear = new Date().getFullYear();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_APP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: email,
    subject: "Welcome to ChessHub Online! Verify Your Email",
    text: "Please verify your email",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your ChessHub Online Account</title>
        <style>
          /* Base styles */
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            background-color: #f4f4f8;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #1a1a1a;
          }

          /* Container */
          .container {
            max-width: 600px;
            margin: 40px auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          /* Header */
          .header {
            background: linear-gradient(135deg, #2b4c8c, #1a365d);
            padding: 40px 20px;
            text-align: center;
          }

          .logo {
            font-size: 36px;
            font-weight: 800;
            color: #ffffff;
            text-decoration: none;
            margin-bottom: 10px;
            display: block;
          }

          .header-subtitle {
            color: rgba(255, 255, 255, 0.9);
            font-size: 18px;
            font-weight: 500;
          }

          /* Content */
          .content {
            padding: 40px;
          }

          .greeting {
            font-size: 28px;
            font-weight: 700;
            color: #1a1a1a;
            margin-bottom: 24px;
          }

          .message {
            color: #4a5568;
            font-size: 16px;
            margin-bottom: 32px;
            line-height: 1.8;
          }

          /* Button */
          .button-wrapper {
            text-align: center;
            margin: 32px 0;
          }

          .action-button {
            display: inline-block;
            background: linear-gradient(135deg, #2b4c8c, #1a365d);
            color: #ffffff;
            padding: 16px 40px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            text-decoration: none;
            text-align: center;
            transition: all 0.3s ease;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          .action-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
          }

          /* Footer */
          .footer {
            background-color: #f8fafc;
            border-top: 1px solid #edf2f7;
            padding: 32px;
            text-align: center;
          }

          .social-links {
            margin: 20px 0;
          }

          .social-link {
            display: inline-block;
            margin: 0 12px;
            color: #2b4c8c;
            text-decoration: none;
            font-weight: 500;
          }

          .copyright {
            color: #718096;
            font-size: 14px;
          }

          .divider {
            height: 1px;
            background-color: #edf2f7;
            margin: 32px 0;
          }

          /* Utility */
          .text-secondary {
            color: #718096;
          }

          .support-link {
            color: #2b4c8c;
            text-decoration: none;
            font-weight: 500;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <a href="${process.env.CLIENT_URL}" class="logo">♟ ChessHub Online</a>
            <p class="header-subtitle">Verify your email address</p>
          </div>

          <div class="content">
            <h1 class="greeting">Welcome to ChessHub Online! ♟</h1>
            
            <p class="message">
              We're excited to have you join our community of chess enthusiasts! To get started and unlock all features, please verify your email address by clicking the button below.
            </p>

            <div class="button-wrapper">
              <a href="${verifyUrl}" class="action-button">
                Verify Email Address
              </a>
            </div>

            <p class="message text-secondary">
              For security, this verification link will expire in 24 hours. If you didn't create a ChessHub Online account, you can safely ignore this email.
            </p>

            <div class="divider"></div>

            <p class="message">
              Need assistance? Our support team is here to help at <a href="mailto:support@ChessHubOnline.com" class="support-link">support@ChessHubOnline.com</a>
            </p>
          </div>

          <div class="footer">
            <div class="social-links">
              <a href="#" class="social-link">Twitter</a>
              <a href="#" class="social-link">Facebook</a>
              <a href="#" class="social-link">LinkedIn</a>
            </div>

            <p class="copyright">
              © ${currentYear} ChessHub Online. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetUrl = `${process.env.CLIENT_URL}/auth/new-password?token=${token}`;
  const currentYear = new Date().getFullYear();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_APP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: email,
    subject: "Reset Your ChessHub Online Password",
    text: "Reset your password",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your ChessHub Online Password</title>
        <style>
          /* Base styles */
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            background-color: #f4f4f8;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #1a1a1a;
          }

          /* Container */
          .container {
            max-width: 600px;
            margin: 40px auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          /* Header */
          .header {
            background: linear-gradient(135deg, #2b4c8c, #1a365d);
            padding: 40px 20px;
            text-align: center;
          }

          .logo {
            font-size: 36px;
            font-weight: 800;
            color: #ffffff;
            text-decoration: none;
            margin-bottom: 10px;
            display: block;
          }

          .header-subtitle {
            color: rgba(255, 255, 255, 0.9);
            font-size: 18px;
            font-weight: 500;
          }

          /* Content */
          .content {
            padding: 40px;
          }

          .greeting {
            font-size: 28px;
            font-weight: 700;
            color: #1a1a1a;
            margin-bottom: 24px;
          }

          .message {
            color: #4a5568;
            font-size: 16px;
            margin-bottom: 32px;
            line-height: 1.8;
          }

          /* Button */
          .button-wrapper {
            text-align: center;
            margin: 32px 0;
          }

          .action-button {
            display: inline-block;
            background: linear-gradient(135deg, #2b4c8c, #1a365d);
            color: #ffffff;
            padding: 16px 40px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            text-decoration: none;
            text-align: center;
            transition: all 0.3s ease;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          .action-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
          }

          /* Footer */
          .footer {
            background-color: #f8fafc;
            border-top: 1px solid #edf2f7;
            padding: 32px;
            text-align: center;
          }

          .social-links {
            margin: 20px 0;
          }

          .social-link {
            display: inline-block;
            margin: 0 12px;
            color: #2b4c8c;
            text-decoration: none;
            font-weight: 500;
          }

          .copyright {
            color: #718096;
            font-size: 14px;
          }

          .divider {
            height: 1px;
            background-color: #edf2f7;
            margin: 32px 0;
          }

          /* Utility */
          .text-secondary {
            color: #718096;
          }

          .support-link {
            color: #2b4c8c;
            text-decoration: none;
            font-weight: 500;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <a href="${process.env.CLIENT_URL}" class="logo">♟ ChessHub Online</a>
            <p class="header-subtitle">Reset Your Password</p>
          </div>

          <div class="content">
            <h1 class="greeting">Password Reset Request</h1>
            
            <p class="message">
              We received a request to reset your password for your ChessHub Online account. Click the button below to create a new password. If you didn't request this change, you can safely ignore this email.
            </p>

            <div class="button-wrapper">
              <a href="${resetUrl}" class="action-button">
                Reset Password
              </a>
            </div>

            <p class="message text-secondary">
              For security, this password reset link will expire in 24 hours.
            </p>

            <div class="divider"></div>

            <p class="message">
              Need assistance? Our support team is here to help at <a href="mailto:support@ChessHubOnline.com" class="support-link">support@ChessHubOnline.com</a>
            </p>
          </div>

          <div class="footer">
            <div class="social-links">
              <a href="#" class="social-link">Twitter</a>
              <a href="#" class="social-link">Facebook</a>
              <a href="#" class="social-link">LinkedIn</a>
            </div>

            <p class="copyright">
              © ${currentYear} ChessHub Online. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};
