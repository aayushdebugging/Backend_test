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
    const jobs = await jobsModel.find({ createdBy: req.user.userId })
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


export const jobStatsController = async (req, res, next) => {
    const stats = await jobsModel.aggregate([
        //search by user jobs
        {
            $match: {
                createdBy: new mongoose.Types.ObjectId(req.user.userId),
            },

        },
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 }
            },
        },
    ]);

    //default status
    const defaultStats = {
        pending: stats.pending || 0,
        reject: stats.reject||0,
        interview:stats.interview ||0,
    };

    //monthly yearly stats
    let monthlyApplication  = await jobsModel.aggregate([
        {
            $match:{
                createdBy:new mongoose.Types.ObjectId (req.ues.userId)
            },
        },
        {
            $groups:{
                _id:{
                    year:{$year:'$createdAt'},
                    month:{$month:'$createdAt'},
                },
                count:{
                    $sum:1
                },
            }

        }
    ]); 

    res.status(200).json({ totalJobs: stats.length, stats });
};