import bcrypt from 'bcryptjs';
import fs from 'fs/promises';

const USERS_DB = './users.json'; // A file to store users (for simplicity)

export default async (req, res) => {
  if (req.method === 'POST') {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      // Read and update the database
      const users = JSON.parse(await fs.readFile(USERS_DB, 'utf8')) || [];
      const existingUser = users.find((user) => user.email === email);

      if (existingUser) {
        return res.status(400).json({ error: 'User already exists.' });
      }

      users.push({ name, email, password: hashedPassword });
      await fs.writeFile(USERS_DB, JSON.stringify(users, null, 2));

      res.status(201).json({ message: 'User registered successfully!' });
    } catch (err) {
      res.status(500).json({ error: 'Server error.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed.' });
  }
};
