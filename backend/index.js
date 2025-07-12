    console.log("hello");
    import express from 'express';
    import dotenv from 'dotenv';
    import cors from 'cors';
    import pool from './db/client.js';
    import { fileURLToPath } from 'url';
    import path from 'path';

    // Middleware (e.g., for protected routes)
    import authenticateToken from './middleware/authenticateToken.js';

    // import homeRoutes from './routes/home.js';
    // import teamRoutes from './routes/team.js';
    // import signupRoutes from './routes/signup.js';
    // import loginRoutes from './routes/login.js';

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

    // Mount routes here if needed
    // app.use('/api/home', homeRoutes);
    // app.use('/api/team', teamRoutes);
    // app.use('/api/signup', signupRoutes);
    // app.use('/api/login', loginRoutes);

    // Start the server
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
