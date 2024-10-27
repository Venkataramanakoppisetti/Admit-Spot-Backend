import initDb from '../../../lib/db';

export default async function handler(req, res) {
    const db = await initDb();
    const { id } = req.query;

    if (req.method === 'PUT') {
        const { name, email, phone, address, timezone } = req.body;

        try {
            console.log('Attempting to update contact with ID:', id);
            console.log('New data:', { name, email, phone, address, timezone });

            // Execute the update query
            const result = await db.run(
                `UPDATE contacts 
                 SET name = COALESCE(?, name), 
                     email = COALESCE(?, email), 
                     phone = COALESCE(?, phone), 
                     address = COALESCE(?, address), 
                     timezone = COALESCE(?, timezone) 
                 WHERE id = ? AND deleted IS NOT 1`,
                [name, email, phone, address, timezone, id]
            );

            // Check if any rows were updated
            if (result.changes === 0) {
                return res.status(404).json({ error: 'Contact not found or already deleted' });
            }

            res.status(200).json({ message: 'Contact updated' });
        } catch (error) {
            console.error('Update error:', error.message);
            res.status(500).json({ error: 'Failed to update contact' });
        }
    } else if (req.method === 'DELETE') {
        try {
            console.log('Attempting to delete contact with ID:', id);
            const result = await db.run(
                `UPDATE contacts SET deleted = 1 WHERE id = ?`,
                id
            );

            if (result.changes === 0) {
                return res.status(404).json({ error: 'Contact not found or already deleted' });
            }

            res.status(200).json({ message: 'Contact deleted' });
        } catch (error) {
            console.error('Delete error:', error.message);
            res.status(500).json({ error: 'Failed to delete contact' });
        }
    } else {
        res.setHeader('Allow', ['PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
