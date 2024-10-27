import initDb from '../../../lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
    const { method } = req;

    if (method === 'POST') {
        const { email } = req.body;
        try {
            const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '15m' });
            return res.status(200).json({ message: 'Password reset token generated', resetToken });
        } catch (error) {
            return res.status(500).json({ message: 'Error generating reset token', error });
        }
    }

    if (method === 'PUT') {
        const { token, newPassword } = req.body;
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const email = decoded.email;

            // Initialize database
            const db = await initDb();

            // Hash the new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Update password in the database
            await db.run(`UPDATE users SET password = ? WHERE email = ?`, [hashedPassword, email]);

            return res.status(200).json({ message: 'Password reset successfully' });
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(400).json({ message: 'Token has expired' });
            } else if (error.name === 'JsonWebTokenError') {
                return res.status(400).json({ message: 'Invalid token' });
            } else {
                return res.status(400).json({ message: 'Token verification failed' });
            }
        }
    }

    res.setHeader('Allow', ['POST', 'PUT']);
    return res.status(405).json({ message: `Method ${method} not allowed` });
}
