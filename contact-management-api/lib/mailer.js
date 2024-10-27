// lib/mailer.js
import nodemailer from 'nodemailer';

export const sendVerificationEmail = async (email, token) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const verificationUrl = `http://localhost:3000/api/auth/verify?token=${token}`;

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verify Your Email',
        html: `<p>Please verify your email by clicking the following link:</p><a href="${verificationUrl}">Verify Email</a>`,
    });
};
