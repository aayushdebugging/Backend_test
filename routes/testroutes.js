import express from 'express';
import { testPostController } from '../controller/testController.js';
import userAuth from '../middlewares/authMiddleware.js';

// Router object
const router = express.Router();

// Routes
router.post('/test-post',userAuth, testPostController); // Assuming this is a POST request

// Export the router
export default router;
