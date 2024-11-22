import bcrypt from 'bcryptjs';
import fs from 'fs/promises';
import jwt from 'jsonwebtoken';

const USERS_DB = './users.json'; // A file to store users
const SECRET = 'your_jwt_secret'; // Replace with a secure key (store in environment variables)

export default async (req, res) => {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
      const users = JSON.parse(await fs.readFile(USERS_DB, 'utf8')) || [];
      const user = users.find((u) => u.email === email);

      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials.' });
      }

      // Generate JWT token
      const token = jwt.sign({ email: user.email }, SECRET, { expiresIn: '1h' });

      res.status(200).json({ message: 'Login successful!', token });
    } catch (err) {
      res.status(500).json({ error: 'Server error.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed.' });
  }
};
