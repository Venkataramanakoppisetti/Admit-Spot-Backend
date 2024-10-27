import multer from 'multer';
import initDb from '../../lib/db';
import { parseCSV } from '../../utils/fileHandler';

const upload = multer({ dest: 'uploads/' });

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    if (req.method === 'POST') {
        upload.single('file')(req, res, async (err) => {
            if (err) return res.status(400).json({ error: 'Error uploading file' });

            try {
                const contacts = await parseCSV(req.file.path);
                const db = await initDb();
                res.status(200).json({ message: 'Contacts uploaded successfully' });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
