// api/auth/register.js
import initDb from '../../../lib/db';
import { hash } from 'bcryptjs';
import crypto from 'crypto';
import { sendVerificationEmail } from '../../../lib/mailer';


export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { email, password } = req.body;

        try {
            const db = await initDb();

            // Generate hashed password and verification token
            const hashedPassword = await hash(password, 10);
            const verificationToken = crypto.randomBytes(32).toString('hex');

            await db.run(`
                INSERT INTO users (email, password, verificationToken)
                VALUES (?, ?, ?)
            `, [email, hashedPassword, verificationToken]);

            await sendVerificationEmail(email, verificationToken);

            res.status(200).json({ message: 'User registered. Please check your email to verify your account.' });
        } catch (error) {
            console.error('Registration error:', error.message);
            res.status(500).json({ error: 'Failed to register user' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
