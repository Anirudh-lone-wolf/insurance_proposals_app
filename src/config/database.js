// Import mysql2/promise to handle database connection
import mysql from "mysql2/promise";

// Import dotenv package
import dotenv from "dotenv";

/**
 * Execute dotenv configuration
 * Loads variables from the .env file into process.env
 */
dotenv.config();

// Get credentials from the .env file
const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

/**
 * Create a reusable collection of database connections
 */
export const pool = mysql.createPool({
  // database host name
  host: DB_HOST,
  // database user name
  user: DB_USER,
  // database password
  password: DB_PASSWORD,
  // database name
  database: DB_NAME,
  // If all connections are busy, wait until one becomes free
  waitForConnections: true,
  // Maximum simultaneous DB connections
  connectionLimit: 10,
  // Unlimited waiting queue
  queueLimit: 0,
});
