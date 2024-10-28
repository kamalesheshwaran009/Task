import express from 'express';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Helper function to create a JWT
const createToken = (user) => {
  return jwt.sign(
    { userId: user._id, email: user.email },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Register endpoint
router.post(['/register', '/api/register'], async (req, res) => {
  const { username, email, password } = req.body;

  try {
    console.log('Registration attempt for email:', email);

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    // Normalize email for case-insensitive comparison
    const normalizedEmail = email.toLowerCase();

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email: normalizedEmail }, { username }] });
    if (existingUser) {
      return res.status(409).json({ message: 'Email or username already registered' });
    }

    // Create new user and save
    const user = new User({ username, email: normalizedEmail, password });
    await user.save();
    console.log('User registered successfully:', normalizedEmail);

    // Generate token for auto-login after registration
    const token = createToken(user);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      email: user.email,
      username: user.username
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

// Login endpoint
router.post(['/login', '/api/login'], async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Login attempt for email:', email);

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Normalize email for case-insensitive comparison
    const normalizedEmail = email.toLowerCase();

    // Find the user by email
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      console.log('User not found:', normalizedEmail);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Invalid password for email:', normalizedEmail);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Successful login
    const token = createToken(user);
    console.log('Login successful for user:', normalizedEmail);

    // Include userId in the response
    res.json({
      message: 'Login successful',
      token,
      userId: user._id.toString(), // Include userId in the response
      email: user.email,
      username: user.username
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});


// Protected route example - fetch users (with token authentication)
router.get('/users', async (req, res) => {
  // Middleware for token verification can be implemented here
  try {
    const users = await User.find({}, 'email username -_id'); // Include username in the fetched data
    res.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

export default router;
