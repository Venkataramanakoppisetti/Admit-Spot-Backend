import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import initDb from './db';

const dbPromise = initDb();

export const registerUser = async (email, password) => {
    const db = await dbPromise;
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);
};

export const authenticateUser = async (email, password) => {
    const db = await dbPromise;
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);

    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
        return { token, user };
    }
    throw new Error('Invalid credentials');
};
