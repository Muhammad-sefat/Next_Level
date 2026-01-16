import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: [process.env.AUTH_URL!],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "active",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const VerificationUrl = `${process.env.AUTH_URL}/verify-email?token=${token}`;
        const info = await transporter.sendMail({
          from: '"Prisma Blog" <prismaemail.email>',
          to: user.email,
          subject: "Verify your email address",
          text: `Hello,
        Thanks for signing up for Prisma Blog 👋
        Please verify your email address by clicking the link below:
        ${VerificationUrl}
        If you did not create this account, you can safely ignore this email.
        Best regards,
        Prisma Blog Team`,
          html: `<div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 20px;">
        <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 24px; border-radius: 8px;">
        <h2 style="color: #111827; margin-bottom: 12px;">
        Verify your email
        </h2>

        <p style="color: #374151; font-size: 14px; line-height: 1.6;">
        Thanks for signing up for <strong>Prisma Blog</strong> 👋  
        Please confirm your email address by clicking the button below.
        </p>

        <div style="text-align: center; margin: 24px 0;">
        <a
          href="${VerificationUrl}"
          style="
            background-color: #4f46e5;
            color: #ffffff;
            padding: 12px 20px;
            text-decoration: none;
            border-radius: 6px;
            font-size: 14px;
            display: inline-block;
          "
        >
          Verify Email
         </a>
         </div>

      <p style="color: #6b7280; font-size: 12px;">
        If you didn’t create this account, you can safely ignore this email.
      </p>

      <p style="color: #6b7280; font-size: 12px; margin-top: 16px;">
        — Prisma Blog Team
      </p>
    </div>
  </div>
`,
        });

        console.log("Message sent:", info.messageId);
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
});
