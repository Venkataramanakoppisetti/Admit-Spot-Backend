import initDb from '../../lib/db';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { token } = req.query;

        try {
            const db = await initDb();

            const user = await db.get(`SELECT * FROM users WHERE verificationToken = ?`, token);

            if (!user) {
                return res.status(400).json({ error: 'Invalid or expired token' });
            }

            await db.run(`UPDATE users SET isVerified = 1, verificationToken = NULL WHERE id = ?`, user.id);

            res.status(200).json({ message: 'Email verified successfully' });
        } catch (error) {
            console.error('Verification error:', error.message);
            res.status(500).json({ error: 'Failed to verify email' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
