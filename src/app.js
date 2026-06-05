// Import express package
import express from 'express';
import { info } from './utils/logger.util.js';
import { initializeRoutes } from './routes/index.routes.js';

// Create express application object
const app = express();

/*
* Middleware for converting JSON request body to Javascript object and store it in req.body 
*/
app.use(express.json());

/**
 * This middleware handles form submissions.
 * extended:true allows parsing nested objects if needed
 */
app.use(express.urlencoded({extended: true}));

/**
 * Serve frontend files from public folder. Browser can access them directly.
 */
app.use(express.static('public'));

/**
 * Test Route 
 * GET Request to : http://localhost:3000
 */
app.get('/', (req,res) => {
    //Send response back to browser
    res.send('Insurance Policy Management System Running')
    info('Insurance Policy Management System Running');
});

initializeRoutes(app);

// Export app object
export  {app};