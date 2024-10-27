import initDb from '../../../lib/db';
import { contactSchema } from '../../../utils/validate';

export default async function handler(req, res) {
    const db = await initDb();
    
    if (req.method === 'POST') {
        try {
            await contactSchema.validate(req.body);
            const { name, email, phone, address, timezone } = req.body;
            await db.run('INSERT INTO contacts (name, email, phone, address, timezone) VALUES (?, ?, ?, ?, ?)', [name, email, phone, address, timezone]);
            res.status(201).json({ message: 'Contact added successfully' });
        } catch (error) {
            res.status(400).json({ error: error.errors });
        }
    } else if (req.method === 'GET') {
        const contacts = await db.all('SELECT * FROM contacts WHERE deleted != 1');
        res.status(200).json(contacts);
    } else {
        res.setHeader('Allow', ['POST', 'GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
