const JobType = require("../models/jobTypeModel");
const ErrorResponse = require("../utils/errorResponse");
const { v1: uuidv1, v4: uuidv4 } = require("uuid");

//create job category
// exports.createJobType = async (req, res, next) => {
//     try {
//         const jobT = await JobType.create({
//             jobTypeName: req.body.jobTypeName,
//             user: req.user.id
//         });
//         res.status(201).json({
//             success: true,
//             jobT
//         })
//     } catch (error) {
//         next(error);
//     }
// }

const AWS = require("aws-sdk");

exports.createJobType = async (req, res, next) => {
  try {
    const docClient = new AWS.DynamoDB.DocumentClient();
    const new_job_type = {
      id: uuidv4(), // Unique identifier for the job type
      jobTypeName: req.body.jobTypeName,
      user: req.user.id,
    };

    const params = {
      TableName: "jobtypes", // Replace with your DynamoDB table name for job types
      Item: new_job_type,
    };

    await docClient.put(params).promise();

    res.status(201).json({
      success: true,
      new_job_type,
    });
  } catch (error) {
    next(error);
  }
};

//all jobs category
// exports.allJobsType = async (req, res, next) => {
//   try {
//     const jobT = await JobType.find().sort({ createdAt: -1 });
//     res.status(200).json({
//       success: true,
//       jobT,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

exports.allJobsType = async (req, res, next) => {
  try {
    const docClient = new AWS.DynamoDB.DocumentClient();

    const params = {
      TableName: "jobtypes", // Replace with your DynamoDB table name for job types
    };

    const result = await docClient.scan(params).promise();

    const jobTypes = result.Items;

    res.status(200).json({
      success: true,
      jobT: jobTypes,
    });
  } catch (error) {
    next(error);
  }
};

//update job type
exports.updateJobType = async (req, res, next) => {
  try {
    const jobT = await JobType.findByIdAndUpdate(req.params.type_id, req.body, {
      new: true,
    });
    res.status(200).json({
      success: true,
      jobT,
    });
  } catch (error) {
    next(error);
  }
};

//delete job type
exports.deleteJobType = async (req, res, next) => {
  const docClient = new AWS.DynamoDB.DocumentClient();
  try {
    const params = {
      TableName: "jobtypes",
      Key: {
        id: req.params.type_id,
      },
    };

    await docClient.delete(params).promise();

    res.status(200).json({
      success: true,
      message: "Job Type deleted",
    });
    next();
  } catch (error) {
    return next(error);
  }
};
