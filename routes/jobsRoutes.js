import express from'express';
import userAuth from '../middlewares/authMiddleware.js';
import { createJobController, deleteJobController, getAlljobsController, jobStatsController, updateJobController } from '../controller/jobsController.js';


const router = express.Router()
    
//routes
//CREATE||JOB
router.post('/create-job',userAuth,createJobController)

//GET||JOBS
router.get('/get-jobs',userAuth,getAlljobsController)

//UPDATE||JOBS
router.patch('/update-job/:id',userAuth,updateJobController)

//DELETE||JOBS
router.delete('/delete-job/:id',userAuth,deleteJobController)


//JOBS STATS FILTER||GET
router.get('/job-stats',userAuth,jobStatsController)



export default router