// lib/db.js

import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

const initDb = async () => {
    const db = await open({
        filename: path.join(process.cwd(), 'database.sqlite'), // Ensure correct path for database
        driver: sqlite3.Database,
    });

    // Create tables if they don't exist
    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE,
            password TEXT,
            verificationToken TEXT,    
            isVerified INTEGER DEFAULT 0 
        );
    `);

    await db.exec(`
        CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT,
            phone TEXT,
            address TEXT,
            timezone TEXT,
            deleted INTEGER DEFAULT 0
        );
    `);

    return db;
};

export default initDb;
