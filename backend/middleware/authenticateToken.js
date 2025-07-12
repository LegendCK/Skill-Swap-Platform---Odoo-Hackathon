import jwt from "jsonwebtoken";
import pool from "../db/client.js";

const JWT_SECRET = process.env.JWT_SECRET;

async function authenticateToken(req, res, next) {
    const token = req.cookies?.token;
    if (!token) {
        return res.status(401).redirect('/login');
    }

    try {
        const user = jwt.verify(token, JWT_SECRET);
        const query = `SELECT id, email FROM "User" WHERE email = $1;`;
        const { rows } = await pool.query(query, [user.email]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        req.user = rows[0];
        next();
    } catch (err) {
        return res.status(403).send("Invalid token");
    }
}

export default authenticateToken;
