import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import pool from './db/client.js';
import { fileURLToPath } from 'url';
import path from 'path';

// Middleware (e.g., for protected routes)
import authenticateToken from './middleware/authenticateToken.js';


//routes
import loginRoutes from './routes/login.js';
import signupRoutes from './routes/signup.js';
import profileRoutes from './routes/profile.js';
import skillRoutes from './routes/skills.js';
import homeRoutes from './routes/home.js';
import viewProfileRoutes from './routes/viewProfile.js';
import swapRoutes from './routes/swap.js';
import mySwapsRoutes from './routes/mySwaps.js';
import feedbackRoutes from './routes/feedback.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors()); // CORS should only be called once
app.use(express.json()); // for parsing JSON bodies

// Health check route
app.get('/', (req, res) => {
    res.send('Server is running');
});
console.log('Attempting to establish connection...');

// Connect and test PostgreSQL
pool.connect()
.then(() => console.log('Connected to PostgreSQL'))
.catch(err => console.error('PostgreSQL Connection Error:', err));

app.use('/signup', signupRoutes);
app.use('/login', loginRoutes);
app.use('/myprofile', profileRoutes);
app.use('/skills', skillRoutes);
app.use('/home', homeRoutes);
app.use('/profile', viewProfileRoutes);
app.use('/swap', swapRoutes);
app.use('/myswaps', mySwapsRoutes);
app.use('/feedback', feedbackRoutes);


// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
