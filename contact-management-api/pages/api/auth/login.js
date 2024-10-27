import { authenticateUser } from '../../../lib/auth';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { email, password } = req.body;
            const user = await authenticateUser(email, password);
            res.status(200).json(user);
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
