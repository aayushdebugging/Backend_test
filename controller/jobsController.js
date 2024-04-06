import jobsModel from "../models/jobsModel.js";
import mongoose from "mongoose";

export const createJobController = async (req, res, next) => {
    const { company, position } = req.body;
    if (!company || !position) {
        return res.status(400).json({ error: "Provide all the fields" });
    }
    req.body.createdBy = req.user.userId;
    try {
        const job = await jobsModel.create(req.body);
        return res.status(201).json({ job });
    } catch (error) {
        return next(error);
    }
};


export const getAlljobsController = async (req, res, next) => {
    const {status , workType, search , sort} = req.query 
    //conditions for searching filters
    const queryObject ={
        createdBy:req.user.userId
    }
    //logic filter 
    if (status && status !== 'all'){
        queryObject.status = status;
    }
    if (workType && workType !=='all'){
        queryObject.workType = workType;
    }
    if (search){
        queryObject.position = {$regex:search, $options:'i'}
    }

    
    let queryResult = jobsModel.find(queryObject);
 

    //sorting
    if(sort==="latest"){
        queryResult = queryResult.sort("-createdAt");
    }
    if(sort === "oldest"){
        queryResult = queryResult.sort("createdAt");
    }
    if(sort === "a-z"){
        queryResult = queryResult.sort("position");
    }
    if(sort === "A-Z"){
        queryResult = queryResult.sort("-position");
    }
    //pagination
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page-1)*limit

    queryResult = queryResult.skip(skip).limit(limit)
    //jobsCount
    const totalJobs = await jobsModel.countDocuments(queryResult)
    const numOfPage = Math.ceil(totalJobs/limit)

    const jobs = await queryResult;
    //const jobs = await jobsModel.find({ createdBy: req.user.userId })
    res.status(200).json({
        totalJobs: jobs.length,
        jobs,
    });
};

export const updateJobController = async (req, res, next) => {
    const { id } = req.params
    const { company, position } = req.body
    //validation
    if (!company || !position) {
        next("Please provide all fields")
    }
    //find jobs
    const job = await jobsModel.findOne({ _id: id })
    //validation
    if (!job) {
        next(`no jobs found with this id ${id}`)
    }
    if (!req.user.userId === job.createdBy.toString()) {
        return ('You are not authorized to update this job')
    }
    const updateJob = await jobsModel.findOneAndUpdate({ _id: id }, req.body, {
        new: true,
        runValidators: true
    })
    //res
    res.status(200).json({ updateJob })

}
export const deleteJobController = async (req, res, next) => {
    const { id } = req.params
    //find Job
    const job = await jobsModel.findOne({ _id: id })
    //validation
    if (!job) {
        next(`No Jobs were found with this id ${id}`)
    }
    if (!req.user, userId === job.createdBy.toString()) {
        next('You are not authorized to delete the Job')
        return
    }
    await job.remove()
    res.status(200).json({ message: "Success,Job Deleted!" });
};
// export const jobStatsController = async (req, res, next) => {
//     try {
//         let userId;

//         // Check if req.user.userId is a number representing a timestamp
//         if (typeof req.user.userId === 'number') {
//             userId = mongoose.Types.ObjectId.createFromTime(req.user.userId);
//         } else {
//             userId = mongoose.Types.ObjectId(req.user.userId);
//         }

//         const stats = await jobsModel.aggregate([
//             // Search by user jobs
//             {
//                 $match: {
//                     createdBy: userId,
//                 },
//             },
//             {
//                 $group: {
//                     _id: '$status',
//                     count: { $sum: 1 }
//                 },
//             },
//         ]);

//         // Default status
//         const defaultStats = {
//             pending: 0,
//             reject: 0,
//             interview: 0,
//         };

//         // Populate default stats with actual values from stats array
//         stats.forEach(stat => {
//             defaultStats[stat._id] = stat.count;
//         });

//         // Monthly application stats
//         const monthlyApplication = await jobsModel.aggregate([
//             {
//                 $match: {
//                     createdBy: userId
//                 },
//             },
//             {
//                 $group: {
//                     _id: {
//                         year: { $year: '$createdAt' },
//                         month: { $month: '$createdAt' },
//                     },
//                     count: {
//                         $sum: 1
//                     },
//                 },
//             },
//         ]);

//         res.status(200).json({ totalJobs: stats.length, defaultStats, monthlyApplication });
//     } catch (error) {
//         next(error);
//     }
// };
